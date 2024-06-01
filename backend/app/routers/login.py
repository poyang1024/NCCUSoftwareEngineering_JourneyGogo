from datetime import timedelta
from typing import Any
from app.db.db_setup import SessionLocal
from pydantic.networks import EmailStr

from app.db.models import models
from app.schemas import tokens, users
from app.auth.auth import (
    authenticate_user,
    create_access_token,
    get_current_user,
    get_current_user_from_cookie,
    create_access_token_forResetPwd,
    get_hashed_password,
)
from app.config.config import settings
from starlette.requests import Request
from starlette.responses import RedirectResponse
from fastapi import APIRouter, Depends, HTTPException, Body, status, BackgroundTasks
from fastapi.security import OAuth2PasswordRequestForm
from fastapi_sso.sso.facebook import FacebookSSO
from fastapi_sso.sso.google import GoogleSSO
from fastapi.encoders import jsonable_encoder
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from jose import JWTError, jwt
from uuid import UUID
from sqlalchemy.exc import DatabaseError

router = APIRouter()

db = SessionLocal()

google_sso = (
    GoogleSSO(
        settings.GOOGLE_CLIENT_ID,
        settings.GOOGLE_CLIENT_SECRET,
        f"{settings.SSO_CALLBACK_HOSTNAME}{settings.API_V1_STR}/login/google/callback",
    )
    if settings.GOOGLE_CLIENT_ID is not None
    and settings.GOOGLE_CLIENT_SECRET is not None
    else None
)

facebook_sso = (
    FacebookSSO(
        settings.FACEBOOK_CLIENT_ID,
        settings.FACEBOOK_CLIENT_SECRET,
        f"{settings.SSO_CALLBACK_HOSTNAME}{settings.API_V1_STR}/login/facebook/callback",
    )
    if settings.FACEBOOK_CLIENT_ID is not None
    and settings.FACEBOOK_CLIENT_SECRET is not None
    else None
)


@router.post("/access-token", response_model=tokens.Token)
async def login_access_token(form_data: OAuth2PasswordRequestForm = Depends()) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(user.uuid, expires_delta=access_token_expires)
    return {
        "access_token": access_token,
        "token_type": "bearer",
    }


@router.get("/test-token", response_model=users.User)
async def test_token(current_user: models.User = Depends(get_current_user)) -> Any:
    """
    Test access token
    """
    return current_user


@router.get("/refresh-token", response_model=tokens.Token)
async def test_token(
    current_user: models.User = Depends(get_current_user_from_cookie),
) -> Any:
    """
    Return a new token for current user
    """
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        current_user.uuid, expires_delta=access_token_expires
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
    }


@router.get("/google")
async def google_login():
    """
    Generate login url and redirect
    """
    return await google_sso.get_login_redirect()


@router.get("/google/callback")
async def google_callback(request: Request):
    """
    Process login response from Google and return user info
    """
    # Get user details from Google
    google_user = await google_sso.verify_and_process(request)

    # Check if user is already created in DB
    # user = await models.User.find_one({"email": google_user.email})
    user = db.query(models.User).filter(models.User.email == google_user.email).first()
    if user is None:
        # If user does not exist, create it in DB
        user = models.User(
            email=google_user.email,
            first_name=google_user.first_name,
            last_name=google_user.last_name,
            picture=google_user.picture,
            provider=google_user.provider,
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")

    # Login user by creating access_token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(user.uuid, expires_delta=access_token_expires)
    response = RedirectResponse(settings.SSO_LOGIN_CALLBACK_URL)
    response.set_cookie(
        "Authorization",
        value=f"Bearer {access_token}",
        httponly=True,
        max_age=120,
        expires=120,
    )
    return response


def send_email_background(
    background_tasks: BackgroundTasks, subject: str, email_to: str, body: str
):
    message = MessageSchema(
        subject=subject,
        recipients=[email_to],
        body=body,
        subtype="plain",
    )
    conf = ConnectionConfig(
        MAIL_USERNAME=settings.MAIL_USERNAME,
        MAIL_PASSWORD=settings.MAIL_PASSWORD,
        MAIL_FROM=settings.MAIL_FROM,
        MAIL_PORT=settings.MAIL_PORT,
        MAIL_SERVER=settings.MAIL_SERVER,
        MAIL_FROM_NAME=settings.MAIL_FROM_NAME,
        MAIL_TLS=True,
        MAIL_SSL=False,
        USE_CREDENTIALS=True,
        # TEMPLATE_FOLDER='../template/mail.html'
    )
    fm = FastMail(conf)
    background_tasks.add_task(fm.send_message, message)


@router.post("/forget-password")
async def forgetPassword(
    email: EmailStr = Body(..., embed=True),
    background_tasks: BackgroundTasks = BackgroundTasks(),
):
    """
    generate the redirect url for reset password
    """
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    secret = settings.SECRET_KEY + user.hashed_password
    access_token = create_access_token_forResetPwd(user.uuid, secret)
    access_token = access_token.replace(".", "!d")
    redirect_link = f"{settings.RESET_PWD_CALLBACK_URL}/{user.uuid}/{access_token}"

    # try:
    # send_email_background(background_tasks, "Reset Password URL", str(email), redirect_link)
    # except Exception as e:
    #     raise HTTPException(status_code=500, detail=e)

    return redirect_link


@router.post("/reset-password/{id}/{token}")
async def resetPassword(id: UUID, token: str, password: str = Body(..., embed=True)):
    # get user by uuid
    user = db.query(models.User).filter(models.User.uuid == id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    # verfiy JWT token
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    token = token.replace("!d", ".")
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY + user.hashed_password, algorithms=["HS256"]
        )
        user_id: UUID = payload.get("sub")
        print(user_id)
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    # reset password
    update_password = get_hashed_password(password)
    setattr(user, "hashed_password", update_password)
    try:
        db.commit()
        db.refresh(user)
        return jsonable_encoder({"message": "Reset password success"})
    except DatabaseError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Error updating password")
