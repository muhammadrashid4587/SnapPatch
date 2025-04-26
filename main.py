from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import numpy as np, cv2, base64
import mediapipe as mp
import trimesh
from fastapi import UploadFile, File
# from google.cloud import storage  # Uncomment if Firebase Storage is enabled

app = FastAPI()

# ────────────────────────────────────────────────────────────
# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your frontend URL in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ────────────────────────────────────────────────────────────
# Health-check
@app.get("/health")
async def health():
    return {"status": "ok"}

# ────────────────────────────────────────────────────────────
# Simple red-hue wound mask
def simple_wound_mask(img_bgr):
    hsv = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV)
    lower = np.array([0, 50, 50])
    upper = np.array([10, 255, 255])
    mask = cv2.inRange(hsv, lower, upper)
    return cv2.medianBlur(mask, 5)

# ────────────────────────────────────────────────────────────
# /api/segment – returns mask, area, severity
@app.post("/api/segment")
async def segment(file: UploadFile = File(...)):
    img_bytes = await file.read()
    img_arr = np.frombuffer(img_bytes, np.uint8)
    img_bgr = cv2.imdecode(img_arr, cv2.IMREAD_COLOR)
    if img_bgr is None:
        raise HTTPException(status_code=400, detail="Bad image")

    mask = simple_wound_mask(img_bgr)
    ys, xs = np.where(mask > 0)
    if xs.size == 0:
        return {"mask": "", "bbox": [], "pixel_area": 0, "severity": "Unknown"}

    x, y, w, h = xs.min(), ys.min(), xs.max() - xs.min(), ys.max() - ys.min()
    area_px = int(mask.sum() / 255)
    severity = "Low" if area_px < 2000 else "Moderate" if area_px < 8000 else "Severe"

    _, buf = cv2.imencode(".png", mask)
    mask_b64 = base64.b64encode(buf).decode()

    return {
        "mask": mask_b64,
        "bbox": [int(x), int(y), int(w), int(h)],
        "pixel_area": area_px,
        "severity": severity
    }

# ────────────────────────────────────────────────────────────
# /api/generate – Generate STL model based on style and size
from datetime import datetime
import os

@app.post("/api/generate")
async def generate_model(style: str = "cube", size: float = 1.0):
    """
    Generate a 3D STL model based on the selected style and size.
    Saves STL file to ./generated_stls/ and returns the filename.
    """
    if style == "cube":
        mesh = trimesh.creation.box(extents=(size, size, size))
    elif style == "sphere":
        mesh = trimesh.creation.icosphere(radius=size)
    else:
        raise HTTPException(status_code=400, detail="Invalid style")

    # Ensure output folder exists
    os.makedirs("generated_stls", exist_ok=True)

    # Generate unique filename with timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{style}_{timestamp}.stl"
    output_path = f"generated_stls/{filename}"

    # Export STL
    mesh.export(output_path)

    return {
        "message": f"{style} STL generated successfully",
        "file_path": output_path
    }


# ────────────────────────────────────────────────────────────
# /api/print – Simulate forwarding STL URL to OctoPrint (fake demo)
@app.post("/api/print")
async def print_model(stl_url: str):
    print(f"Simulating print for STL: {stl_url}")

    return {
        "status": "Print started successfully",
        "stl_url": stl_url
    }

# ────────────────────────────────────────────────────────────
# /api/rescan – Accepts two masks, calculates IoU improvement
@app.post("/api/rescan")
async def rescan(old_mask: UploadFile = File(...), new_mask: UploadFile = File(...)):
    import numpy as np
    import cv2

    # Read and decode the two uploaded images
    old = np.array(cv2.imdecode(np.frombuffer(await old_mask.read(), np.uint8), cv2.IMREAD_GRAYSCALE)) > 0
    new = np.array(cv2.imdecode(np.frombuffer(await new_mask.read(), np.uint8), cv2.IMREAD_GRAYSCALE)) > 0

    # Calculate intersection and union
    intersection = np.logical_and(old, new).sum()
    union = np.logical_or(old, new).sum()

    if union == 0:
        return {"iou_improvement": 0.0}

    iou = intersection / union
    return {"iou_improvement": round(iou, 3)}