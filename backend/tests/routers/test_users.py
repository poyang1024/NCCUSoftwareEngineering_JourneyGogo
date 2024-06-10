import pytest

from app.config.config import settings
from app.db.models.models import User
from ..utils import (
    generate_random_email,
    generate_random_string,
    create_test_normal_user,
    generate_test_user_auth_headers,
    get_test_user_auth_headers
)

def test_create_user(client, session):
    email = generate_random_email()
    password = generate_random_string()
    data = {'email': email,
            'password': password}
    
    response = client.post(f'{settings.API_V1_STR}/users', json=data)
    assert response.status_code == 200

    received_data = response.json()
    user = session.query(User).filter(User.email==email).first()
    assert user # check the user is not empty
    assert user.email == received_data['email'] == email

def test_create_user_with_existing_email(client, session):
    user = create_test_normal_user(session)
    data = {'email': user.email,
            'password': generate_random_string()}
    
    response = client.post(f'{settings.API_V1_STR}/users', json=data)
    received_data = response.json()
    assert response.status_code == 400
    assert received_data['detail'] == 'User with that email already exists.'

def test_get_profile_by_normal_user(client, session):
    user = create_test_normal_user(session)
    auth_token = generate_test_user_auth_headers(user)
    response = client.get(f'{settings.API_V1_STR}/users/me', headers=auth_token)
    assert response.status_code == 200

    current_user = response.json()
    assert current_user
    assert current_user['is_active'] is True
    assert current_user['is_superuser'] is False
    assert current_user['email'] == user.email

def test_get_profile_by_superuser(client, superuser_auth_token):
    response = client.get(f'{settings.API_V1_STR}/users/me', headers=superuser_auth_token)
    assert response.status_code == 200

    current_user = response.json()
    assert current_user
    assert current_user['is_active'] is True
    assert current_user['is_superuser'] is True
    assert current_user['email'] == settings.FIRST_SUPERUSER

def test_update_username_by_normal_user(client, session):
    user = create_test_normal_user(session)
    auth_token = generate_test_user_auth_headers(user)
    new_name = generate_random_string(n=8)

    updated_data = {'last_name': new_name}
    response = client.patch(f'{settings.API_V1_STR}/users/me', 
                            headers=auth_token, 
                            json=updated_data)
    assert response.status_code == 200

    updated_user = response.json()
    assert updated_user['last_name'] != user.last_name
    assert updated_user['last_name'] == new_name

def test_update_email_by_normal_user(client, session):
    user = create_test_normal_user(session)
    auth_token = generate_test_user_auth_headers(user)
    new_email = f'updated_{generate_random_email()}'

    updated_data = {'email': new_email}
    response = client.patch(f'{settings.API_V1_STR}/users/me', 
                            headers=auth_token, 
                            json=updated_data)
    assert response.status_code == 200

    updated_user = response.json()
    assert updated_user['email'] != user.email
    assert updated_user['email'] == new_email

def test_update_existing_email_by_normal_user(client, session):
    user = create_test_normal_user(session)
    auth_token = generate_test_user_auth_headers(user)
    new_email = settings.FIRST_SUPERUSER

    updated_data = {'email': new_email}
    response = client.patch(f'{settings.API_V1_STR}/users/me', 
                            headers=auth_token, 
                            json=updated_data)
    received_data = response.json()
    assert response.status_code == 400
    assert received_data['detail'] == 'User with that email already exists.'

# test user cannot set itself to superuser or inactive
def test_prevent_normal_user_from_setting_status(client, session):
    user = create_test_normal_user(session)
    auth_token = generate_test_user_auth_headers(user)

    updated_data = {"is_superuser": True, "is_active": False}
    response = client.patch(f'{settings.API_V1_STR}/users/me', 
                            headers=auth_token, 
                            json=updated_data)
    assert response.status_code == 200
    
    updated_user = response.json()
    assert updated_user['is_superuser'] is False
    assert updated_user['is_active'] is True

def test_delete_normal_user(client, session):
    user = create_test_normal_user(session)
    auth_token = generate_test_user_auth_headers(user)

    response = client.delete(f'{settings.API_V1_STR}/users/me', headers=auth_token)
    assert response.status_code == 200

    deleted_user = session.query(User).filter(User.email==user.email).first()
    assert deleted_user == None


