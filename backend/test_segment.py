from fastapi.testclient import TestClient
from pathlib import Path
from main import app

client = TestClient(app)
SAMPLE = Path("hand.jpeg")        # tiny jpeg shipped in repo

def test_segment_endpoint():
    assert SAMPLE.exists(), "hand.jpeg sample missing"
    with SAMPLE.open("rb") as f:
        r = client.post("/api/segment",
                        files={"file": ("hand.jpeg", f, "image/jpeg")})
    assert r.status_code == 200
    data = r.json()
    for key in ("mask", "pixel_area", "severity"):
        assert key in data
