# # backend/main.py

# import os
# import uuid
# import shutil
# import base64
# from datetime import datetime
# from typing import Any, Dict

# import cv2
# import numpy as np
# import requests
# import trimesh
# import openai
# import certifi
# from dotenv import load_dotenv
# from jose import jwt
# from bson import ObjectId
# from fastapi import (
#     FastAPI,
#     UploadFile,
#     File,
#     HTTPException,
#     Depends,
#     Query,
# )
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import JSONResponse
# from fastapi.staticfiles import StaticFiles
# from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
# from motor.motor_asyncio import AsyncIOMotorClient

# # ─── Load environment variables ───
# load_dotenv()
# AUTH0_DOMAIN   = os.getenv("AUTH0_DOMAIN")
# API_AUDIENCE   = os.getenv("API_AUDIENCE")
# OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
# MONGO_URI      = os.getenv("MONGODB_URI")
# MONGO_DB       = os.getenv("MONGODB_DB", "snappatch")

# openai.api_key = OPENAI_API_KEY

# # ─── FastAPI app & CORS ───
# app = FastAPI(debug=True)

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],        # 🔒 lock this down in prod!
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # ─── Auth0 bearer dependency ───
# ALGORITHMS = ["RS256"]

# class Auth0Bearer(HTTPBearer):
#     def __init__(self, auto_error: bool = True):
#         super().__init__(auto_error=auto_error)

#     async def __call__(
#         self,
#         creds: HTTPAuthorizationCredentials = Depends(HTTPBearer())
#     ) -> Dict[str, Any]:
#         if not creds or not creds.credentials:
#             raise HTTPException(401, "Missing token")
#         token = creds.credentials
#         jwks = requests.get(f"https://{AUTH0_DOMAIN}/.well-known/jwks.json").json()
#         header = jwt.get_unverified_header(token)
#         rsa_key = next((k for k in jwks["keys"] if k["kid"] == header.get("kid")), None)
#         if not rsa_key:
#             raise HTTPException(401, "Invalid token header")
#         try:
#             payload = jwt.decode(
#                 token,
#                 rsa_key,
#                 algorithms=ALGORITHMS,
#                 audience=API_AUDIENCE,
#                 issuer=f"https://{AUTH0_DOMAIN}/"
#             )
#         except Exception as e:
#             raise HTTPException(401, f"Token error: {e}")
#         return payload

# auth = Auth0Bearer()

# # ─── MongoDB Atlas setup ───
# mongo = AsyncIOMotorClient(
#     MONGO_URI,
#     tls=True,
#     tlsCAFile=certifi.where(),
# )
# db            = mongo[MONGO_DB]
# sessions_coll = db["sessions"]
# shares_coll   = db["shares"]

# # ─── In-memory fallbacks ───
# in_memory_sessions: Dict[str, Dict[str, Any]] = {}
# in_memory_shares: Dict[str, str] = {}

# # ─── Static file mounts ───
# app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
# app.mount("/generated_stls", StaticFiles(directory="generated_stls"), name="generated_stls")

# # ─── Health & Root ───
# @app.get("/health")
# async def health():
#     return {"status": "ok"}

# @app.get("/")
# async def root():
#     return {"message": "Welcome to SnapPatch API"}

# # ─── Verify injury ───
# from verify import is_injury

# @app.post("/api/verify")
# async def api_verify(file: UploadFile = File(...)):
#     img_bytes = await file.read()
#     try:
#         ok, conf = is_injury(img_bytes)
#     except Exception as e:
#         raise HTTPException(500, f"Verify failed: {e}")
#     return {"is_injury": ok, "confidence": conf}

# # ─── Segment mask ───
# from segment import segment_mask

# @app.post("/api/segment")
# async def api_segment(file: UploadFile = File(...)):
#     # 1) read the bytes
#     img_bytes = await file.read()

#     # 2) optional injury check (you can drop this if you always want to segment)
#     ok, conf = is_injury(img_bytes)
#     # if not ok:
#     #     raise HTTPException(412, f"Not an injury (p={conf:.2f})")

#     # 3) segment → returns base64 mask + stats dict
#     mask_b64, stats = await segment_mask(img_bytes)

#     # 4) persist to Mongo (or fallback to in-memory)
#     record = {
#         "timestamp":    datetime.utcnow(),
#         "severity":     stats["severity"],
#         "pixel_area":   stats["pixel_area"],
#     }
#     try:
#         res = await sessions_coll.insert_one(record)
#         session_id = str(res.inserted_id)
#     except Exception:
#         session_id = uuid.uuid4().hex
#         in_memory_sessions[session_id] = record

#     # 5) return everything
#     return {
#         "mask":       mask_b64,
#         "session_id": session_id,
#         **stats
#     }
# # ─── Timeline ───
# @app.get("/api/timeline", dependencies=[Depends(auth)])
# async def api_timeline(severity: str = Query(..., regex="^(low|moderate|severe)$")):
#     info = {
#         "low":      ["D1 Clean + mesh", "D3 Re-scan", "D7 Remove"],
#         "moderate": ["D1 Mesh", "D2 Pain check", "D5 Re-scan", "D10 Remove"],
#         "severe":   ["D1 Splint", "D2 Doctor visit", "D7 Re-scan", "D14 Remove"],
#     }
#     return info[severity.lower()]

# # ─── Generate STL ───
# @app.post("/api/generate", dependencies=[Depends(auth)])
# async def generate_model(style: str = "cube", size: float = 1.0):
#     if style == "cube":
#         mesh = trimesh.creation.box(extents=(size,) * 3)
#     elif style == "sphere":
#         mesh = trimesh.creation.icosphere(radius=size)
#     else:
#         raise HTTPException(400, "Invalid style")
#     os.makedirs("generated_stls", exist_ok=True)
#     fname = f"{style}_{datetime.now():%Y%m%d_%H%M%S}.stl"
#     path  = f"generated_stls/{fname}"
#     mesh.export(path)
#     return {"message": "STL generated", "file_path": path}

# # ─── Print model ───
# @app.post("/api/print", dependencies=[Depends(auth)])
# async def print_model(stl_url: str = Query(...)):
#     # integrate with your printer API here
#     print(f"[OctoPrint-mock] printing {stl_url}")
#     return {"status": "started", "stl_url": stl_url}

# # ─── Rescan IOU ───
# @app.post("/api/rescan", dependencies=[Depends(auth)])
# async def rescan(
#     old_mask: UploadFile = File(...),
#     new_mask: UploadFile = File(...)
# ):
#     old = cv2.imdecode(
#         np.frombuffer(await old_mask.read(), np.uint8),
#         cv2.IMREAD_GRAYSCALE
#     ) > 0
#     new = cv2.imdecode(
#         np.frombuffer(await new_mask.read(), np.uint8),
#         cv2.IMREAD_GRAYSCALE
#     ) > 0
#     inter = np.logical_and(old, new).sum()
#     union = np.logical_or(old, new).sum()
#     return {"iou": None if union == 0 else round(inter / union, 3)}

# # ─── Share session ───
# @app.post("/api/share", dependencies=[Depends(auth)])
# async def share_wound(session_id: str = Query(..., desc="scan session ID")):
#     share_id = uuid.uuid4().hex[:8]
#     rec = {"share_id": share_id, "session_id": session_id, "created_at": datetime.utcnow()}
#     try:
#         await shares_coll.insert_one(rec)
#     except Exception:
#         in_memory_shares[share_id] = session_id
#     return {"share_url": f"https://snappatch.io/share/{share_id}"}

# @app.get("/share/{share_id}")
# async def get_share(share_id: str):
#     rec = await shares_coll.find_one({"share_id": share_id}) or {}
#     sid = rec.get("session_id") or in_memory_shares.get(share_id)
#     if not sid:
#         raise HTTPException(404, "Not found")
#     return {"session_id": sid}

# # ─── Stats ───
# @app.get("/api/stats", dependencies=[Depends(auth)])
# async def stats():
#     try:
#         total = await sessions_coll.count_documents({})
#         pipeline = [{"$group": {"_id": "$severity", "count": {"$sum": 1}}}]
#         breakdown = {d["_id"]: d["count"] async for d in sessions_coll.aggregate(pipeline)}
#     except Exception:
#         total = len(in_memory_sessions)
#         breakdown = {}
#         for sess in in_memory_sessions.values():
#             sev = sess["severity"]
#             breakdown[sev] = breakdown.get(sev, 0) + 1
#     return {"total_sessions": total, "by_severity": breakdown}

# # ─── Advice via OpenAI ───
# @app.post("/api/advice", dependencies=[Depends(auth)])
# async def advice(session_id: str = Query(..., desc="Mongo ID")):
#     sess = None
#     try:
#         sess = await sessions_coll.find_one({"_id": ObjectId(session_id)})
#     except Exception:
#         sess = in_memory_sessions.get(session_id)
#     if not sess:
#         raise HTTPException(404, "Session not found")
#     severity = sess.get("severity", "moderate")
#     prompt = (
#         f"You are a medical expert. Provide a step-by-step care plan "
#         f"for a {severity} wound, including cleaning, dressings, timeline, "
#         "and when to seek professional care."
#     )
#     resp = openai.ChatCompletion.create(
#         model="gpt-4",
#         messages=[{"role": "user", "content": prompt}],
#         temperature=0.7,
#         max_tokens=400,
#     )
#     return {"advice": resp.choices[0].message.content.strip()}


# @app.get("/health")
# @app.get("/api/health")
# async def health():
#     return {"status":"ok"}



# backend/main.py

import os
import uuid
import requests
import openai
import cv2
import numpy as np
import trimesh

from datetime import datetime
from fastapi import FastAPI, UploadFile, File, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import certifi
from dotenv import load_dotenv

from verify import is_injury
from segment import segment_mask

# ─────── Load environment ───────
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
MONGO_URI      = os.getenv("MONGODB_URI")
MONGO_DB       = os.getenv("MONGODB_DB", "snappatch")
openai.api_key = OPENAI_API_KEY

# ─────── FastAPI + CORS ───────
app = FastAPI(debug=True)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],     # in production, restrict this!
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

# ─────── MongoDB client ───────
mongo = AsyncIOMotorClient(
    MONGO_URI,
    tls=True,
    tlsCAFile=certifi.where(),
)
db            = mongo[MONGO_DB]
sessions_coll = db["sessions"]
shares_coll   = db["shares"]

# ─────── In-memory fallback stores ───────
in_memory_sessions = {}
in_memory_shares   = {}

# ─ Health check ─
@app.get("/api/health")
async def health():
    return {"status": "ok"}

# ─ Root ─
@app.get("/")
async def root():
    return {"message": "Welcome to SnapPatch API"}

# ─ Verify injury ─
@app.post("/api/verify")
async def api_verify(file: UploadFile = File(...)):
    img = await file.read()
    try:
        ok, conf = is_injury(img)
    except Exception as e:
        raise HTTPException(500, f"Verification error: {e}")
    return {"is_injury": ok, "confidence": conf}

# ─ Segment wound image ─
@app.post("/api/segment")
async def api_segment(file: UploadFile = File(...)):
    img_bytes = await file.read()
    ok, conf = is_injury(img_bytes)
    # if not ok:
    #     raise HTTPException(412, f"Not an injury (p={conf:.2f})")

    mask_b64, stats = await segment_mask(img_bytes)
    record = {
        "timestamp":  datetime.utcnow(),
        "severity":   stats["severity"],
        "pixel_area": stats["pixel_area"],
    }
    try:
        res = await sessions_coll.insert_one(record)
        session_id = str(res.inserted_id)
    except Exception:
        session_id = uuid.uuid4().hex
        in_memory_sessions[session_id] = record

    return {"mask": mask_b64, "session_id": session_id, **stats}

# ─ Timeline lookup ─
@app.get("/api/timeline")
async def api_timeline(severity: str = Query(..., regex="^(low|moderate|severe)$")):
    info = {
        "low":      ["D1 Clean + mesh","D3 Re-scan","D7 Remove"],
        "moderate": ["D1 Mesh","D2 Pain check","D5 Re-scan","D10 Remove"],
        "severe":   ["D1 Splint","D2 Doctor visit","D7 Re-scan","D14 Remove"],
    }
    return info[severity.lower()]

# ─ Generate STL ─
@app.post("/api/generate")
async def generate_model(style: str = "cube", size: float = 1.0):
    if style == "cube":
        mesh = trimesh.creation.box(extents=(size,) * 3)
    elif style == "sphere":
        mesh = trimesh.creation.icosphere(radius=size)
    else:
        raise HTTPException(400, "Invalid style")
    os.makedirs("generated_stls", exist_ok=True)
    fname = f"{style}_{datetime.now():%Y%m%d_%H%M%S}.stl"
    path  = f"generated_stls/{fname}"
    mesh.export(path)
    return {"message": "STL generated", "file_path": path}

# ─ Print job ─
@app.post("/api/print")
async def print_model(stl_url: str):
    print(f"[Mock Print] printing {stl_url}")
    return {"status": "started", "stl_url": stl_url}

# ─ Rescan comparison ─
@app.post("/api/rescan")
async def rescan(old_mask: UploadFile = File(...), new_mask: UploadFile = File(...)):
    old = cv2.imdecode(np.frombuffer(await old_mask.read(), np.uint8), cv2.IMREAD_GRAYSCALE) > 0
    new = cv2.imdecode(np.frombuffer(await new_mask.read(), np.uint8), cv2.IMREAD_GRAYSCALE) > 0
    inter = np.logical_and(old, new).sum()
    union = np.logical_or(old, new).sum()
    return {"iou": None if union == 0 else round(inter/union, 3)}

# ─ Share a session ─
@app.post("/api/share")
async def share_wound(session_id: str = Query(..., desc="scan session ID")):
    share_id = uuid.uuid4().hex[:8]
    rec = {"share_id": share_id, "session_id": session_id, "created_at": datetime.utcnow()}
    try:
        await shares_coll.insert_one(rec)
    except Exception:
        in_memory_shares[share_id] = session_id
    return {"share_url": f"https://snappatch.io/share/{share_id}"}

@app.get("/share/{share_id}")
async def get_share(share_id: str):
    rec = await shares_coll.find_one({"share_id": share_id}) or {}
    sid = rec.get("session_id") or in_memory_shares.get(share_id)
    if not sid:
        raise HTTPException(404, "Not found")
    return {"session_id": sid}

# ─ Stats ─
@app.get("/api/stats")
async def stats():
    try:
        total = await sessions_coll.count_documents({})
        pipeline = [{"$group": {"_id":"$severity", "count":{"$sum":1}}}]
        breakdown = {d["_id"]: d["count"] async for d in sessions_coll.aggregate(pipeline)}
    except Exception:
        total = len(in_memory_sessions)
        breakdown = {}
        for sess in in_memory_sessions.values():
            sev = sess["severity"]
            breakdown[sev] = breakdown.get(sev, 0) + 1
    return {"total_sessions": total, "by_severity": breakdown}

# ─ Advice via OpenAI ─
@app.post("/api/advice")
async def advice(session_id: str = Query(..., desc="Session ID")):
    try:
        sess = await sessions_coll.find_one({"_id": ObjectId(session_id)})
    except Exception:
        sess = None
    sess = sess or in_memory_sessions.get(session_id)
    if not sess:
        raise HTTPException(404, "Session not found")

    severity = sess.get("severity", "moderate")
    prompt = (
        f"You are a medical expert. Provide a step-by-step care plan "
        f"for a {severity} wound, including cleaning, dressings, timeline, "
        "and when to seek professional care."
    )
    resp = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role":"user","content":prompt}],
        temperature=0.7,
        max_tokens=400,
    )
    return {"advice": resp.choices[0].message.content.strip()}
