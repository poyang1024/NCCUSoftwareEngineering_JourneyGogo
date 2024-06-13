import pytest
import random
import string

from app.auth import auth
from .utils import (generate_random_string,
                    create_test_normal_user,
                    generate_test_user_auth_headers,
                    get_test_user_auth_headers)


def test_get_hashed_password(password_context):
    password = generate_random_string(n=16)
    hashed_password = auth.get_hashed_password(password=password)
    assert hashed_password
    assert password != hashed_password
    assert password_context.verify(password, hashed_password) is True

def test_verify_password(password_context):
    password = generate_random_string(n=16).join(random.choices(string.ascii_uppercase, k = 2))
    fake_password = generate_random_string(n=16)
    lower_password = password.lower()
    hashed_password = password_context.hash(password)

    verified_correct_pw = auth.verify_password(password=password,
                                    hashed_pass=hashed_password)
    assert verified_correct_pw is True

    verified_fake_pw = auth.verify_password(password=fake_password,
                                    hashed_pass=hashed_password)
    assert verified_fake_pw is False

    verified_lower_pw = auth.verify_password(password=lower_password,
                                    hashed_pass=hashed_password)
    assert verified_lower_pw is False

'''
@pytest.mark.asyncio
async def test__get_current_user(session):
    user = create_test_normal_user(session)
    headers = generate_test_user_auth_headers(user)
    token = headers["Authorization"][7:]
    fake_token = generate_random_string(n=len(token))

    received_user = await auth._get_current_user(token=token)
    assert received_user
    assert received_user.uuid == user.uuid

    response_empty_token = auth._get_current_user(token='')
    assert response_empty_token.status_code == 401

    response_fake_token = auth._get_current_user(token=fake_token)
    assert response_fake_token.status_code == 401
'''
    




'''
(v) get_hashed_password(password: str) -> str
(v) verify_password(password: str, hashed_pass: str) -> bool
authenticate_user(email: str, password: str)
create_access_token(subject: Union[str, Any], expires_delta: timedelta | None = None)
create_access_token_forResetPwd(subject: Union[str, Any], secret: str)
get_current_user(token: str = Depends(oauth2_scheme))
get_current_user_from_cookie(token: str = Depends(oauth2_scheme_with_cookies))
get_current_user_without_error(token: str = Depends(oauth2_scheme_without_error))
_get_current_user(token)
get_current_active_user(current_user: models.User = Depends(get_current_user)) -> models.User
get_current_active_superuser(current_user: models.User = Depends(get_current_user)) -> models.User
get_current_login_status(current_user: models.User = Depends(get_current_user_without_error))
'''