import pytest
from fastapi.testclient import TestClient

from src.main import app

client = TestClient(app)


def test_reminder_list():
    """Test reminder list endpoint."""
    response = client.get("/reminder/")
    assert response.status_code == 200
