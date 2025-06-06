from fastapi.testclient import TestClient
from main import app
from pathlib import Path
client = TestClient(app)

def test_segment():
    img = Path("samples/injury.jpg")
    if not img.exists():
        return
    r = client.post("/api/segment",
                    files={"file": ("injury.jpg", img.read_bytes(), "image/jpeg")})
    assert r.status_code == 200
    for k in ("mask", "pixel_area", "severity", "solution_type"):
        assert k in r.json()
