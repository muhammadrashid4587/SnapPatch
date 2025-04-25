from fastapi.testclient import TestClient
from main import app
from pathlib import Path

client = TestClient(app)
IMG = Path("hand.jpeg")          # sample image in project root

def test_segment_returns_mask():
    assert IMG.exists(), "Add a small hand.jpeg sample to project root"
    with IMG.open("rb") as f:
        r = client.post("/api/segment",
                        files={"file": ("hand.jpeg", f, "image/jpeg")})
    assert r.status_code == 200
    data = r.json()
    assert data["mask"]                    # base64 string not empty
    assert data["severity"] in {"Low", "Moderate", "Severe", "Unknown"}
