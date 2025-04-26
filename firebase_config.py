import firebase_admin
from firebase_admin import credentials, firestore

# Path to your Firebase key
cred = credentials.Certificate("firebase-key.json")
firebase_admin.initialize_app(cred)

# Firestore client
db = firestore.client()

# ──────────────────────────────
# Functions to read/write users
def add_user(user_id, name, email):
    db.collection("users").document(user_id).set({
        "user_id": user_id,
        "name": name,
        "email": email
    })

def get_user(user_id):
    doc = db.collection("users").document(user_id).get()
    return doc.to_dict() if doc.exists else None
