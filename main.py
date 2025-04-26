from dotenv import load_dotenv
load_dotenv()                            # pulls REPLICATE_API_TOKEN from .env

from fastapi import FastAPI, UploadFile, File, HTTPException
from verify import is_injury
from segment import segment_mask

app = FastAPI()

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/api/verify")
async def api_verify(file: UploadFile = File(...)):
    img = await file.read()
    ok, conf = is_injury(img)
    return {"is_injury": ok, "confidence": conf}

@app.post("/api/segment")
async def api_segment(file: UploadFile = File(...)):
    img = await file.read()
    ok, conf = is_injury(img)
    if not ok:
        raise HTTPException(412, detail=f"Not an injury (p={conf:.2f})")
    mask_b64, stats = await segment_mask(img)
    return {"mask": mask_b64, **stats}

@app.get("/api/timeline")
async def api_timeline(severity: str):
    info = {
        "low":       ["D1 Clean + mesh", "D3 Re-scan", "D7 Remove"],
        "moderate":  ["D1 Mesh", "D2 Pain check", "D5 Re-scan", "D10 Remove"],
        "severe":    ["D1 Splint", "D2 Doctor visit", "D7 Re-scan", "D14 Remove"],
    }
    return info.get(severity.lower(), [])
