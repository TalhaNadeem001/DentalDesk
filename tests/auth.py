import pytest
from fastapi.testclient import TestClient

from src.main import app

client = TestClient(app)


def test_auth_list():
    """Test auth list endpoint."""
    response = client.get("/auth/")
    assert response.status_code == 200
