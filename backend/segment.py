# # segment.py  ─────────────────────────────────────────────
# """
# SAM-first wound segmentation.
# • We try the Replicate SAM endpoint (fast GPU, good masks).
# • If that fails, we *optionally* fall back to TF-Hub BodyPix.
# """

# from __future__ import annotations

# import base64, io, os, asyncio, httpx, numpy as np
# from PIL import Image

# # ————————————————————————————————————————————————
# # 1) Replicate SAM settings
# _REPLICATE_URL = "https://api.replicate.com/v1/predictions"
# _REPLICATE_MODEL = "salesforce/blip-image-captioning-base"  # SAM default
# _REPLICATE_HEADERS = {
#     "Authorization": f"Token {os.getenv('REPLICATE_API_TOKEN','')}",
#     "Content-Type": "application/json",
# }

# # ————————————————————————————————————————————————
# # 2) Lazy BodyPix fallback (loaded only if/when needed)
# _BP = None            # will hold the TF-Hub model once loaded
# _BP_HANDLE = (
#     "https://tfhub.dev/tensorflow/lite-model/bodypix/float16/1"
# )  # valid handle for TF-Hub
# _BP_LOCK = asyncio.Lock()   # make lazy init thread-safe


# # ————————————————————————————————————————————————
# async def _sam_request(img_b: bytes) -> np.ndarray | None:
#     """Call Replicate SAM and return a binary mask numpy array (H×W) or None."""
#     async with httpx.AsyncClient(timeout=20) as client:
#         payload = {
#             "version": _REPLICATE_MODEL,
#             "input": {"image": "data:image/jpeg;base64," + base64.b64encode(img_b).decode()}
#         }
#         r = await client.post(_REPLICATE_URL, headers=_REPLICATE_HEADERS, json=payload)
#         if r.status_code != 201:         # Replicate returns 201 for accepted jobs
#             return None
#         poll = await client.get(r.json()["urls"]["get"])
#         for _ in range(20):              # poll up to ~10 s
#             j = poll.json()
#             if j["status"] == "succeeded":
#                 mask_b64 = j["output"]["mask"]
#                 return _b64_to_np(mask_b64)
#             if j["status"] == "failed":
#                 return None
#             await asyncio.sleep(0.5)
#             poll = await client.get(r.json()["urls"]["get"])
#     return None


# def _b64_to_np(b64: str) -> np.ndarray:
#     img = Image.open(io.BytesIO(base64.b64decode(b64))).convert("L")
#     return (np.array(img) > 127).astype(np.uint8)   # binary mask {0,1}


# # ————————————————————————————————————————————————
# async def _bodypix_mask(img_b: bytes) -> np.ndarray | None:
#     """Fallback mask using TF-Hub BodyPix (runs on CPU, slower)."""
#     global _BP
#     if _BP is None:
#         async with _BP_LOCK:             # only one coroutine downloads the model
#             if _BP is None:              # double-check (others may have loaded)
#                 import tensorflow as tf, tensorflow_hub as hub  # heavy deps
#                 try:
#                     _BP = hub.load(_BP_HANDLE)
#                 except Exception as e:   # network/offline/URL error
#                     print("BodyPix load failed:", e)
#                     return None
#     # Prepare input
#     import cv2
#     nparr = np.frombuffer(img_b, np.uint8)
#     img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)      # BGR
#     img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
#     resized = cv2.resize(img_rgb, (513, 513)) / 255.0
#     logits = _BP(resized[np.newaxis, ...])["segmentation_mask"]
#     mask = (logits[0] > 0.5).numpy().astype(np.uint8)
#     return cv2.resize(mask, (img.shape[1], img.shape[0]))


# # ————————————————————————————————————————————————
# async def segment_mask(img_b: bytes) -> np.ndarray | None:
#     """
#     High-level helper used by FastAPI endpoint.
#     1. Try SAM on Replicate.
#     2. If that fails/timeouts → BodyPix (if available).
#     Returns binary mask or None.
#     """
#     mask = await _sam_request(img_b)
#     if mask is not None:
#         return mask
#     return await _bodypix_mask(img_b)


# segment.py
"""
Local mask + stats generator for SnapPatch tests.
No external API calls, no auth headers required.
"""

from __future__ import annotations
import cv2, base64, numpy as np
from typing import Tuple, Dict, List


# ────────────────────────────────────────────────────────────
# simple HSV red-hue mask (same logic used in main.py example)
def _simple_mask(bgr: np.ndarray) -> np.ndarray:
    hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV)
    lower, upper = np.array([0, 50, 50]), np.array([10, 255, 255])
    mask = cv2.inRange(hsv, lower, upper)
    return cv2.medianBlur(mask, 5)


def _stats(mask: np.ndarray) -> Dict:
    ys, xs = np.where(mask > 0)
    if xs.size == 0:
        return dict(bbox=[], pixel_area=0, severity="Unknown", solution_type="mesh")

    x, y, w, h = xs.min(), ys.min(), xs.max() - xs.min(), ys.max() - ys.min()
    area = int(mask.sum() / 255)

    if area < 2_000:
        sev = "Low"
    elif area < 8_000:
        sev = "Moderate"
    else:
        sev = "Severe"

    sol = "mesh" if sev in {"Low", "Moderate"} else "splint"
    return dict(bbox=[int(x), int(y), int(w), int(h)],
                pixel_area=area,
                severity=sev,
                solution_type=sol)


# ────────────────────────────────────────────────────────────
async def segment_mask(img_b: bytes) -> Tuple[str, Dict]:
    """
    Fast, offline replacement for the SAM/Replicate call.
    Returns (mask_png_base64, stats_dict)
    """
    arr = np.frombuffer(img_b, np.uint8)
    bgr = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    if bgr is None:
        raise ValueError("Bad image bytes")

    mask = _simple_mask(bgr)
    ok, buf = cv2.imencode(".png", mask)
    if not ok:
        raise RuntimeError("PNG encode failed")

    mask_b64 = base64.b64encode(buf).decode()
    return mask_b64, _stats(mask)
