# segment.py  ─────────────────────────────────────────────
"""
SAM-first wound segmentation.
• We try the Replicate SAM endpoint (fast GPU, good masks).
• If that fails, we *optionally* fall back to TF-Hub BodyPix.
"""

from __future__ import annotations

import base64, io, os, asyncio, httpx, numpy as np
from PIL import Image

# ————————————————————————————————————————————————
# 1) Replicate SAM settings
_REPLICATE_URL = "https://api.replicate.com/v1/predictions"
_REPLICATE_MODEL = "salesforce/blip-image-captioning-base"  # SAM default
_REPLICATE_HEADERS = {
    "Authorization": f"Token {os.getenv('REPLICATE_API_TOKEN','')}",
    "Content-Type": "application/json",
}

# ————————————————————————————————————————————————
# 2) Lazy BodyPix fallback (loaded only if/when needed)
_BP = None            # will hold the TF-Hub model once loaded
_BP_HANDLE = (
    "https://tfhub.dev/tensorflow/lite-model/bodypix/float16/1"
)  # valid handle for TF-Hub
_BP_LOCK = asyncio.Lock()   # make lazy init thread-safe


# ————————————————————————————————————————————————
async def _sam_request(img_b: bytes) -> np.ndarray | None:
    """Call Replicate SAM and return a binary mask numpy array (H×W) or None."""
    async with httpx.AsyncClient(timeout=20) as client:
        payload = {
            "version": _REPLICATE_MODEL,
            "input": {"image": "data:image/jpeg;base64," + base64.b64encode(img_b).decode()}
        }
        r = await client.post(_REPLICATE_URL, headers=_REPLICATE_HEADERS, json=payload)
        if r.status_code != 201:         # Replicate returns 201 for accepted jobs
            return None
        poll = await client.get(r.json()["urls"]["get"])
        for _ in range(20):              # poll up to ~10 s
            j = poll.json()
            if j["status"] == "succeeded":
                mask_b64 = j["output"]["mask"]
                return _b64_to_np(mask_b64)
            if j["status"] == "failed":
                return None
            await asyncio.sleep(0.5)
            poll = await client.get(r.json()["urls"]["get"])
    return None


def _b64_to_np(b64: str) -> np.ndarray:
    img = Image.open(io.BytesIO(base64.b64decode(b64))).convert("L")
    return (np.array(img) > 127).astype(np.uint8)   # binary mask {0,1}


# ————————————————————————————————————————————————
async def _bodypix_mask(img_b: bytes) -> np.ndarray | None:
    """Fallback mask using TF-Hub BodyPix (runs on CPU, slower)."""
    global _BP
    if _BP is None:
        async with _BP_LOCK:             # only one coroutine downloads the model
            if _BP is None:              # double-check (others may have loaded)
                import tensorflow as tf, tensorflow_hub as hub  # heavy deps
                try:
                    _BP = hub.load(_BP_HANDLE)
                except Exception as e:   # network/offline/URL error
                    print("BodyPix load failed:", e)
                    return None
    # Prepare input
    import cv2
    nparr = np.frombuffer(img_b, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)      # BGR
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    resized = cv2.resize(img_rgb, (513, 513)) / 255.0
    logits = _BP(resized[np.newaxis, ...])["segmentation_mask"]
    mask = (logits[0] > 0.5).numpy().astype(np.uint8)
    return cv2.resize(mask, (img.shape[1], img.shape[0]))


# ————————————————————————————————————————————————
async def segment_mask(img_b: bytes) -> np.ndarray | None:
    """
    High-level helper used by FastAPI endpoint.
    1. Try SAM on Replicate.
    2. If that fails/timeouts → BodyPix (if available).
    Returns binary mask or None.
    """
    mask = await _sam_request(img_b)
    if mask is not None:
        return mask
    return await _bodypix_mask(img_b)
