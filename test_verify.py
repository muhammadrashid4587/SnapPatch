from fastapi.testclient import TestClient
from main import app
from pathlib import Path
client = TestClient(app)

def test_verify():
    img = Path("samples/injury.jpg")
    if not img.exists():  # skip if fixture missing
        return
    r = client.post("/api/verify",
                    files={"file": ("injury.jpg", img.read_bytes(), "image/jpeg")})
    assert r.status_code == 200
    assert "is_injury" in r.json()
