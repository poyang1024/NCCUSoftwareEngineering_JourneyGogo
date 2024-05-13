from typing import List, Optional, Any
from uuid import UUID
from app.db.db_setup import SessionLocal

from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

from fastapi import APIRouter, HTTPException, Body, Depends
from pydantic.networks import EmailStr
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from ..auth.auth import (
    get_hashed_password,
    get_current_active_superuser,
    get_current_active_user,
    verify_password
)

from ..schemas import users as schemas
from app.db.models import models

router = APIRouter()

db=SessionLocal()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/check-email")
async def check_email_registered(email: EmailStr, db: Session = Depends(get_db)):
    """
    Check if the given email is already registered.

    Parameters:
    - email (EmailStr): Email to check.

    Returns:
    - dict: A dictionary with a boolean indicating if the email is registered.
    """
    is_registered = db.query(models.User).filter(models.User.email == email).first() is not None
    return {"is_registered": is_registered}

@router.post("", response_model= schemas.User)
async def register_user(
    password: str = Body(...),
    email: EmailStr = Body(...),
    first_name: str = Body(None),
    last_name: str = Body(None),
):
    """
    Register a new user.
    """
    hashed_password = get_hashed_password(password)
    user = models.User(
        email=email,
        hashed_password=hashed_password,
        first_name=first_name,
        last_name=last_name,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user

@router.get("", response_model=List[schemas.User])
async def get_users(
    limit: Optional[int] = 10,
    offset: Optional[int] = 0,
    admin_user: models.User = Depends(get_current_active_superuser),
):
    users = db.query(models.User).offset(offset).limit(limit).all()
    return users

@router.get("/me", response_model=schemas.User)
async def get_profile(
    current_user: models.User = Depends(get_current_active_user),
) -> Any:
    """
    Get current user.
    """
    return current_user

@router.patch("/me", response_model=schemas.User)
async def update_profile(
    update: schemas.UserUpdate,
    current_user: models.User = Depends(get_current_active_user),
) -> Any:
    """
    Update current user.
    """
    update_data = update.model_dump(
        exclude={"is_active", "is_superuser"}, exclude_unset=True
    )
    try:
        if update_data["password"]:
            update_data["hashed_password"] = get_hashed_password(
                update_data["password"]
            )
            del update_data["password"]
    except KeyError:
        pass

    user = db.query(models.User).filter(models.User.uuid == current_user.uuid).first()
    for key, value in update_data.items():
        setattr(user, key, value)

    try:
        db.commit()
        db.refresh(user)
        return user
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="User with that email already exists.",
        )

@router.delete("/me", response_model=schemas.User)
async def delete_me(user: models.User = Depends(get_current_active_user)):
    current_user = db.query(models.User).filter(models.User.uuid == user.uuid).first()
    db.delete(current_user)
    db.commit()
    return user

@router.patch("/{userid}", response_model=schemas.User)
async def update_user(
    userid: UUID,
    update: schemas.UserUpdate,
    admin_user: models.User = Depends(get_current_active_superuser),
) -> Any:
    """
    Update a user.

    ** Restricted to superuser **

    Parameters
    ----------
    userid : UUID
        the user's UUID
    update : schemas.UserUpdate
        the update data
    current_user : models.User, optional
        the current superuser, by default Depends(get_current_active_superuser)
    """
    user = db.query(models.User).filter(models.User.uuid == userid).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    update_data = update.model_dump(exclude_unset=True)
    if update_data.get("password"):
        update_data["hashed_password"] = get_hashed_password(update_data["password"])
        del update_data["password"]

    for key, value in update_data.items():
        setattr(user, key, value)

    try:
        db.commit()
        db.refresh(user)
        return user
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="User with that email already exists.",
        )


@router.get("/{userid}", response_model=schemas.User)
async def get_user(
    userid: UUID, admin_user: models.User = Depends(get_current_active_superuser)
):
    """
    Get User Info

    ** Restricted to superuser **

    Parameters
    ----------
    userid : UUID
        the user's UUID

    Returns
    -------
    schemas.User
        User info
    """
    user = db.query(models.User).filter(models.User.uuid == userid).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.delete("/{userid}", response_model=schemas.User)
async def delete_user(
    userid: UUID, admin_user: models.User = Depends(get_current_active_superuser)
):
    user = db.query(models.User).filter(models.User.uuid == userid).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return user

@router.post("/verifyPassword")
async def verifyPassword(
    update: schemas.PasswordUpdate,
    current_user: models.User = Depends(get_current_active_user)
):
    """
    Check if password legal
    """
    user = db.query(models.User).filter(models.User.uuid == current_user.uuid).first()
    is_legal = verify_password(update.password, user.hashed_password)
    res = jsonable_encoder({"state": is_legal})
    return res
