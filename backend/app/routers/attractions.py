import asyncio

from typing import List, Optional, Any
from fastapi import APIRouter, HTTPException, Body, Depends, Request
from sqlalchemy import and_, or_

from ..db.db_setup import SessionLocal
from ..schemas import attractions as schemas
from ..db.models import models

from ..auth.auth import (
    get_current_login_status,
    get_current_user,
    get_current_active_superuser,
    get_current_active_user,
)

router = APIRouter()

db = SessionLocal()

@router.get("/", response_model=None)
async def get_attractions(
    city: Optional[str] = None,
    keyword: Optional[str] = None,
    current_user: models.User = Depends(get_current_login_status)
):
    cityFilter = (models.Attraction.city == city) if city else True
    if keyword: # need to check the value of keyword if the search box is empty
        cityFilter = (models.Attraction.city == city) if city else True
        attractions = db.query(models.Attraction).filter(and_(cityFilter, models.Attraction.name.like(f'%{keyword}%'))).all()
        # condition: when contain one word # to be edited
    else:
        attractions = db.query(models.Attraction).filter(cityFilter).all()

    attractions_data = []
    for attraction in attractions:
        saved = 0
        if current_user:
            # check whether the user has saved this attraction
            if db.query(models.SavedAttraction).join(models.ListBase)\
                .filter(and_(models.SavedAttraction.id == attraction.id, models.ListBase.user_id == current_user.uuid)).all():
                saved = 1

        attractions_data.append({
            "attraction": attraction, 
            "favorite": saved, 
            "comments": db.query(models.Comment).filter(models.Comment.attraction_id == attraction.id).all()
            })
    return attractions_data

@router.get("/{id}", response_model=None)
async def get_attraction_by_id(id: int, current_user: models.User = Depends(get_current_login_status)):
    attraction = db.query(models.Attraction).filter(models.Attraction.id == id).first()
    if not attraction:
        raise HTTPException(status_code=404, detail="This attraction is not existed.")
    
    saved = 0
    if current_user:
        # check whether the user has saved this attraction
        if db.query(models.SavedAttraction).join(models.ListBase)\
            .filter(and_(models.SavedAttraction.id == attraction.id, models.ListBase.user_id == current_user.uuid)).all():
            saved = 1

    return {"attraction": attraction,
            "favorite": saved,
            "comments": db.query(models.Comment).filter(models.Comment.attraction_id == attraction.id).all()
            }

@router.get("/favorites/{userId}", response_model=None)
async def get_favorites_list_by_user(userId: int):
    user = db.query(models.User).filter(models.User.uuid == userId).first()
    if not user.lists:
        raise HTTPException(status_code=404, detail="The user doesn't create any favorites.")
    return user.lists

@router.post("/favorites", response_model=None)
async def create_favorites_list():
    pass
