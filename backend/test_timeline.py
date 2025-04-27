from fastapi.testclient import TestClient
from main import app
client = TestClient(app)

def test_timeline():
    r = client.get("/api/timeline?severity=low")
    assert r.status_code == 200
    assert isinstance(r.json(), list)
