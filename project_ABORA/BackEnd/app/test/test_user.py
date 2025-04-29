import pytest
from starlette.testclient import TestClient
from app.main import app

def test_create_user():
    with TestClient(app) as client:
        import random
        unique_email = f"new{random.randint(1000,9999)}@example.com"

        response = client.post("/users/", json={
            "username": "newuser",
            "email": unique_email,
            "password": "123456"
        })
        assert response.status_code == 201  # 또는 200