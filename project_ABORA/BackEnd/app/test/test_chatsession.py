# app/test/test_chatsession.py
from starlette.testclient import TestClient
from app.main import app
import random

client = TestClient(app)

def create_user_and_token():
    email = f"user{random.randint(1000, 9999)}@example.com"
    password = "123456"

    response = client.post("/users/", json={
        "username": "testuser",
        "email": email,
        "password": password
    })
    assert response.status_code == 201
    user = response.json()

    token_response = client.post("/auth/token", data={
        "username": email,
        "password": password
    })
    assert token_response.status_code == 200
    token = token_response.json()["access_token"]
    return user, token

def auth_headers(token: str):
    return {"Authorization": f"Bearer {token}"}

def test_create_chatSession():
    user, token = create_user_and_token()

    response = client.post("/chatsessions/", headers=auth_headers(token), json={
        "user_id": user["id"],
        "chatsession_name": "My Session"
    })
    assert response.status_code == 201
    result = response.json()
    assert result["user_id"] == user["id"]
    assert result["chatsession_name"] == "My Session"

def test_get_chatSession_by_id():
    user, token = create_user_and_token()

    # 먼저 생성
    create_response = client.post("/chatsessions/", headers=auth_headers(token), json={
        "user_id": user["id"],
        "chatsession_name": "Session to Retrieve"
    })
    chat_session = create_response.json()

    # 단건 조회
    get_response = client.get(f"/chatsessions/{chat_session['id']}", headers=auth_headers(token))
    assert get_response.status_code == 200
    assert get_response.json()["id"] == chat_session["id"]

def test_delete_chatSession():
    user, token = create_user_and_token()

    create_response = client.post("/chatsessions/", headers=auth_headers(token), json={
        "user_id": user["id"],
        "chatsession_name": "Session to Delete"
    })
    chat_session = create_response.json()

    # 삭제
    delete_response = client.delete(f"/chatsessions/{chat_session['id']}", headers=auth_headers(token))
    assert delete_response.status_code == 200
    assert delete_response.json()["detail"] == "Chat session deleted successfully"

    # 조회 시 404
    get_response = client.get(f"/chatsessions/{chat_session['id']}", headers=auth_headers(token))
    assert get_response.status_code == 404

def test_get_all_chatSessions():
    user, token = create_user_and_token()

    # 채팅 세션 2개 생성
    for name in ["Session A", "Session B"]:
        response = client.post("/chatsessions/", headers=auth_headers(token), json={
            "user_id": user["id"],
            "chatsession_name": name
        })
        assert response.status_code == 201

    # 전체 채팅 세션 조회
    response = client.get("/chatsessions/", headers=auth_headers(token))
    assert response.status_code == 200
    sessions = response.json()
    assert isinstance(sessions, list)
    assert len(sessions) >= 2

    # 이름 확인 (두 개 중 하나만 포함되어도 OK)
    names = [s["chatsession_name"] for s in sessions]
    assert "Session A" in names
    assert "Session B" in names