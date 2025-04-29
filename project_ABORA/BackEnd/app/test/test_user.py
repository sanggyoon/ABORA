import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_create_user():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/user", json={
            "username": "newuser",
            "email": "new@example.com",
            "password": "123456"
        })
    assert response.status_code == 201  # 또는 200