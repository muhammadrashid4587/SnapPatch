"""
SnapPatch Firebase helper.

• If a valid `firebase-key.json` service-account file is found, we connect to
  Firestore and read/write the real collection  users/{uid}.

• In CI / local dev without credentials, we silently fall back to an
  in-memory dict so the rest of the code (and tests) keeps working.
"""

from pathlib import Path
from typing import Optional

# ─────────────────────────────────────────────────────────────
# Try to initialise Firebase
_app = None
_db = None

try:
    import firebase_admin
    from firebase_admin import credentials, firestore

    key_file = Path("firebase-key.json")
    if key_file.exists():
        cred = credentials.Certificate(key_file.__fspath__())
        _app = firebase_admin.initialize_app(cred)
        _db = firestore.client()
except Exception:  # any import / credential failure ⇒ fallback
    firebase_admin = None
    _db = None

# ─────────────────────────────────────────────────────────────
# Helpers

def _pack(uid: str, name: str, email: str) -> dict:
    return {"uid": uid, "name": name, "email": email}

# Real Firestore branch
if _db is not None:

    def add_user(uid: str, name: str, email: str) -> None:
        _db.collection("users").document(uid).set(_pack(uid, name, email))

    def get_user(uid: str) -> Optional[dict]:
        snap = _db.collection("users").document(uid).get()
        return snap.to_dict() if snap.exists else None

# In-memory stub branch (tests / offline)
else:
    _MEM = {}

    def add_user(uid: str, name: str, email: str) -> None:
        _MEM[uid] = _pack(uid, name, email)

    def get_user(uid: str) -> Optional[dict]:
        return _MEM.get(uid)
