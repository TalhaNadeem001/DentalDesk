import pytest
from fastapi.testclient import TestClient

from src.main import app

client = TestClient(app)


def test_patient_list():
    """Test patient list endpoint."""
    response = client.get("/patient/")
    assert response.status_code == 200
