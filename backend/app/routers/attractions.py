from typing import List, Optional, Any
from fastapi import APIRouter, HTTPException, Body, Depends
from sqlalchemy import and_, or_

from ..db.db_setup import SessionLocal
from ..schemas import attractions as schemas
from ..db.models import models

from ..auth.auth import (
    get_hashed_password,
    get_current_user,
    get_current_active_superuser,
    get_current_active_user,
)

router = APIRouter()

db = SessionLocal()

@router.get("/", response_model=None)
async def get_attractions(
    city: Optional[str] = None,
    keyword: Optional[str] = None
):  
    cityFilter = (models.Attraction.city == city) if city else True
    if keyword: # need to check the value of keyword if the search box is empty
        cityFilter = (models.Attraction.city == city) if city else True
        attractions = db.query(models.Attraction).filter(and_(cityFilter, models.Attraction.name.like(f'%{keyword}%'))).all()
        # when contain one word # to be edited
    else:
        attractions = db.query(models.Attraction).filter(cityFilter).all()

    attractions_data = []
    for attraction in attractions:
        attractions_data.append({
            "attraction": attraction, 
            "favorite": 0, 
            "comments": db.query(models.Comment).filter(models.Comment.attraction_id == attraction.id).all()
            })
    return attractions_data

@router.get("/{id}", response_model=None)
async def get_attraction_by_id(id: int):
    attraction = db.query(models.Attraction).filter(models.Attraction.id == id).first()
    if not attraction:
        raise HTTPException(status_code=404, detail="This attraction is not existed.")
    return attraction

@router.get("/favorites/{userId}", response_model=None)
async def get_favorites_list_by_user(userId: int):
    user = db.query(models.User).filter(models.User.uuid == userId).first()
    if not user.lists:
        raise HTTPException(status_code=404, detail="The user doesn't create any favorites.")
    return user.lists

@router.post("/favorites", response_model=None)
async def create_favorites_list():
    pass
