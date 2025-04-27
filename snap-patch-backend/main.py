import os
import base64
import uuid
import requests
import openai
import cv2
import numpy as np
import trimesh
from datetime import datetime
from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import certifi
from dotenv import load_dotenv
from typing import Any, Dict

from verify import is_injury
from segment import segment_mask

# ─────── Load ENV ───────
load_dotenv()
AUTH0_DOMAIN   = os.getenv("AUTH0_DOMAIN")
API_AUDIENCE   = os.getenv("API_AUDIENCE")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
MONGO_URI      = os.getenv("MONGODB_URI")
MONGO_DB       = os.getenv("MONGODB_DB", "snappatch")

openai.api_key = OPENAI_API_KEY

# ─────── Auth0 Stub ───────
ALGORITHMS = ["RS256"]
class Auth0Bearer(HTTPBearer):
    def __init__(self, auto_error: bool = True):
        super().__init__(auto_error=auto_error)
    async def __call__(self, creds: HTTPAuthorizationCredentials = Depends(HTTPBearer())) -> Dict[str,Any]:
        if not creds or not creds.credentials:
            raise HTTPException(401, "Missing token")
        token = creds.credentials
        jwks = requests.get(f"https://{AUTH0_DOMAIN}/.well-known/jwks.json").json()
        header = jwt.get_unverified_header(token)
        rsa_key = next((k for k in jwks["keys"] if k["kid"]==header.get("kid")), None)
        if not rsa_key:
            raise HTTPException(401, "Invalid token header")
        try:
            payload = jwt.decode(
                token, rsa_key, algorithms=ALGORITHMS,
                audience=API_AUDIENCE, issuer=f"https://{AUTH0_DOMAIN}/"
            )
        except Exception as e:
            raise HTTPException(401, f"Token error: {e}")
        return payload

auth = Auth0Bearer()

# ─────── MongoDB Atlas w/ certifi ───────
mongo = AsyncIOMotorClient(
    MONGO_URI,
    tls=True,
    tlsCAFile=certifi.where(),
)
db             = mongo[MONGO_DB]
sessions_coll  = db["sessions"]
shares_coll    = db["shares"]

# ─────── In-memory fallback stores ───────
in_memory_sessions: Dict[str, Dict[str,Any]] = {}
in_memory_shares:   Dict[str, str]      = {}

# ─────── FastAPI App ───────
app = FastAPI(debug=True)
app.dependency_overrides[auth] = lambda: {"sub":"test-user"}
app.add_middleware(
    CORSMiddleware, allow_origins=["*"], allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"],
)

# ─ Health ─
@app.get("/health")
async def health():
    return {"status":"ok"}

@app.get("/")
async def root():
    return {"message":"Welcome to SnapPatch API"}

# ─ Verify ─
@app.post("/api/verify")
async def api_verify(file: UploadFile=File(...)):
    img = await file.read()
    try:
        ok, conf = is_injury(img)
    except Exception as e:
        print("⚠️ verify failed:", e)
        raise HTTPException(500, str(e))
    return {"is_injury": ok, "confidence": conf}

# ─ Segment ─
@app.post("/api/segment", dependencies=[Depends(auth)])
async def api_segment(file: UploadFile=File(...)):
    img = await file.read()
    ok, conf = is_injury(img)
    # disabled reject to demo every image
    # if not ok: raise HTTPException(412, f"Not an injury (p={conf:.2f})")

    mask_b64, stats = await segment_mask(img)
    to_insert = {
        "timestamp": datetime.utcnow(),
        "severity":   stats["severity"],
        "pixel_area": stats["pixel_area"],
    }
    session_id = None
    try:
        res = await sessions_coll.insert_one(to_insert)
        session_id = str(res.inserted_id)
    except Exception as e:
        print("⚠️ DB insert session failed:", e)
        # fall back to in-memory
        session_id = uuid.uuid4().hex
        in_memory_sessions[session_id] = to_insert

    return {"mask":mask_b64, "session_id":session_id, **stats}

# ─ Timeline ─
@app.get("/api/timeline", dependencies=[Depends(auth)])
async def api_timeline(severity: str = Query(..., regex="^(low|moderate|severe)$")):
    info = {
      "low":      ["D1 Clean + mesh","D3 Re-scan","D7 Remove"],
      "moderate": ["D1 Mesh","D2 Pain check","D5 Re-scan","D10 Remove"],
      "severe":   ["D1 Splint","D2 Doctor visit","D7 Re-scan","D14 Remove"],
    }
    return info[severity.lower()]

# ─ Generate STL ─
@app.post("/api/generate", dependencies=[Depends(auth)])
async def generate_model(style: str="cube", size: float=1.0):
    if style=="cube":
        mesh = trimesh.creation.box(extents=(size,)*3)
    elif style=="sphere":
        mesh = trimesh.creation.icosphere(radius=size)
    else:
        raise HTTPException(400,"Invalid style")
    os.makedirs("generated_stls", exist_ok=True)
    fname = f"{style}_{datetime.now():%Y%m%d_%H%M%S}.stl"
    path  = f"generated_stls/{fname}"
    mesh.export(path)
    return {"message":"STL generated","file_path":path}

# ─ Print ─
@app.post("/api/print", dependencies=[Depends(auth)])
async def print_model(stl_url: str):
    print(f"[OctoPrint-mock] printing {stl_url}")
    return {"status":"started","stl_url":stl_url}

# ─ Rescan ─
@app.post("/api/rescan", dependencies=[Depends(auth)])
async def rescan(old_mask: UploadFile=File(...), new_mask: UploadFile=File(...)):
    old = cv2.imdecode(np.frombuffer(await old_mask.read(), np.uint8), cv2.IMREAD_GRAYSCALE)>0
    new = cv2.imdecode(np.frombuffer(await new_mask.read(), np.uint8), cv2.IMREAD_GRAYSCALE)>0
    inter, union = np.logical_and(old,new).sum(), np.logical_or(old,new).sum()
    return {"iou": None if union==0 else round(inter/union,3)}

# ─ Share ─
@app.post("/api/share", dependencies=[Depends(auth)])
async def share_wound(session_id: str=Query(...,desc="scan session ID")):
    share_id = uuid.uuid4().hex[:8]
    rec = {"share_id":share_id,"session_id":session_id,"created_at":datetime.utcnow()}
    try:
        await shares_coll.insert_one(rec)
    except Exception as e:
        print("⚠️ DB insert share failed:", e)
        in_memory_shares[share_id] = session_id
    return {"share_url":f"https://snappatch.io/share/{share_id}"}

@app.get("/share/{share_id}")
async def get_share(share_id: str):
    rec = None
    try:
        rec = await shares_coll.find_one({"share_id":share_id})
    except Exception as e:
        print("⚠️ DB find share failed:", e)
    if rec:
        return {"session_id": rec["session_id"]}
    if share_id in in_memory_shares:
        return {"session_id": in_memory_shares[share_id]}
    raise HTTPException(404,"Not found")

# ─ Stats ─
@app.get("/api/stats", dependencies=[Depends(auth)])
async def stats():
    total = 0
    breakdown = {}
    try:
        total = await sessions_coll.count_documents({})
        pipeline = [{"$group":{"_id":"$severity","count":{"$sum":1}}}]
        breakdown = {d["_id"]:d["count"] async for d in sessions_coll.aggregate(pipeline)}
    except Exception as e:
        print("⚠️ DB stats failed:", e)
        # in-memory fallback
        total = len(in_memory_sessions)
        for sess in in_memory_sessions.values():
            sev = sess["severity"]
            breakdown[sev] = breakdown.get(sev,0) + 1
    return {"total_sessions": total, "by_severity": breakdown}

# ─ Advice ─
@app.post("/api/advice", dependencies=[Depends(auth)])
async def advice(session_id: str=Query(...,desc="Mongo ID")):
    sess = None
    try:
        sess = await sessions_coll.find_one({"_id": ObjectId(session_id)})
    except Exception as e:
        print("⚠️ DB find session failed:", e)
    if not sess:
        sess = in_memory_sessions.get(session_id)
    if not sess:
        raise HTTPException(404,"Session not found")
    severity = sess.get("severity","moderate")
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
