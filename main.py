from fastapi import FastAPI, File, UploadFile, HTTPException
import numpy as np, cv2, base64
import mediapipe as mp

app = FastAPI()

# ────────────────────────────────────────────────────────────
# Health-check
@app.get("/health")
async def health():
    return {"status": "ok"}


# ────────────────────────────────────────────────────────────
# Simple red-hue wound mask (placeholder for BodyPix/UNet)
def simple_wound_mask(img_bgr):
    hsv   = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV)
    lower = np.array([0, 50, 50])      # tweak if needed
    upper = np.array([10, 255, 255])
    mask  = cv2.inRange(hsv, lower, upper)
    mask  = cv2.medianBlur(mask, 5)
    return mask


# ────────────────────────────────────────────────────────────
# /api/segment – returns mask PNG (base64), bbox, area, severity
@app.post("/api/segment")
async def segment(file: UploadFile = File(...)):
    img_bytes = await file.read()
    img_arr   = np.frombuffer(img_bytes, np.uint8)
    img_bgr   = cv2.imdecode(img_arr, cv2.IMREAD_COLOR)
    if img_bgr is None:
        raise HTTPException(status_code=400, detail="Bad image")

    mask = simple_wound_mask(img_bgr)
    ys, xs = np.where(mask > 0)
    if xs.size == 0:
        return {"mask": "", "bbox": [], "pixel_area": 0, "severity": "Unknown"}

    x, y, w, h = xs.min(), ys.min(), xs.max() - xs.min(), ys.max() - ys.min()
    area_px    = int(mask.sum() / 255)
    severity   = ("Low" if area_px < 2000
                  else "Moderate" if area_px < 8000
                  else "Severe")

    _, buf   = cv2.imencode(".png", mask)
    mask_b64 = base64.b64encode(buf).decode()

    return {
        "mask": mask_b64,
        "bbox": [int(x), int(y), int(w), int(h)],
        "pixel_area": area_px,
        "severity": severity
    }
