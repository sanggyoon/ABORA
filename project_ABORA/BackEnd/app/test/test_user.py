# app/test/test_user.py

from starlette.testclient import TestClient
from app.main import app
import random

client = TestClient(app)

def create_unique_user():
    unique_email = f"user{random.randint(1000,9999)}@example.com"
    response = client.post("/users/", json={
        "username": "testuser",
        "email": unique_email,
        "password": "123456"
    })
    assert response.status_code == 201
    return response.json()

def login_user(email: str, password: str):
    response = client.post("/auth/token", data={
        "username": email,
        "password": password
    })
    assert response.status_code == 200
    return response.json()["access_token"]

def setup_user_and_token():
    user = create_unique_user()
    token = login_user(user["email"], "123456")
    return user, token

def get_auth_headers(token: str):
    return {"Authorization": f"Bearer {token}"}

def test_create_user():
    user = create_unique_user()
    assert user["email"].startswith("user")
    assert user["username"] == "testuser"

def test_get_user_by_id():
    user, token = setup_user_and_token()

    response = client.get(f"/users/{user['id']}", headers=get_auth_headers(token))
    assert response.status_code == 200
    assert response.json()["email"] == user["email"]

def test_get_user_by_email():
    user, token = setup_user_and_token()

    response = client.get(f"/users/email/{user['email']}", headers=get_auth_headers(token))
    assert response.status_code == 200
    assert response.json()["email"] == user["email"]

def test_update_user():
    user, token = setup_user_and_token()

    response = client.put(f"/users/{user['id']}", headers=get_auth_headers(token), json={
        "username": "updateduser",
        "email": user["email"],
        "password": "newpass123"
    })
    assert response.status_code == 200
    assert response.json()["username"] == "updateduser"

def test_delete_user():
    user, token = setup_user_and_token()

    response = client.delete(f"/users/{user['id']}", headers=get_auth_headers(token))
    assert response.status_code == 200
    assert response.json()["detail"] == "User deleted successfully"

    # Verify user is deleted
    response = client.get(f"/users/{user['id']}", headers=get_auth_headers(token))
    assert response.status_code == 404