import pytest

from app.config.config import settings

# def test_get_access_token
# def test_use_access_token
# def test_not_authorized

def test_get_access_token(client):
    login_data = {
        "username": settings.FIRST_SUPERUSER,
        "password": settings.FIRST_SUPERUSER_PASSWORD,
    }
    response = client.post(f"{settings.API_V1_STR}/login/access-token", data=login_data)
    tokens = response.json()
    assert response.status_code == 200
    assert "access_token" in tokens
    assert tokens["access_token"]

def test_use_access_token(client, superuser_auth_token):
    response = client.get(f"{settings.API_V1_STR}/login/test-token", headers=superuser_auth_token)
    assert response.status_code == 200

    user = response.json()
    assert "email" in user
    assert user['email'] == settings.FIRST_SUPERUSER

def test_not_authorized(client):
    response = client.get(f"{settings.API_V1_STR}/login/test-token")
    assert response.status_code == 401

    headers = {"AUTHORIZATION": "Bearer eyJ0eXAiOiJKV1QiLCJhbG"}
    response = client.get(f"{settings.API_V1_STR}/login/test-token", headers=headers)
    assert response.status_code == 401

