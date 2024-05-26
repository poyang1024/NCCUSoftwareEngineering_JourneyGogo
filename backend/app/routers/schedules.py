from typing import List, Optional, Any
from fastapi import APIRouter, HTTPException, Body, Depends, Request, status
from sqlalchemy import and_, or_, any_
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError

from ..db.db_setup import SessionLocal
from ..schemas.schedules import ScheduleCreate, ScheduleResponse, ScheduleAttractions, ScheduleUpdate
from ..db.models.models import Schedules, ListBase, User

from ..auth.auth import (
    get_current_user,
)

router = APIRouter()

db = SessionLocal()

@router.post("", response_model=None)
async def create_schedules_list(
    schedule: ScheduleCreate,
    current_user: User = Depends(get_current_user)
):
    """
    Create a new schedule.
    """
    # check if list name exist
    exist_schedules = db.query(Schedules).filter(Schedules.name == schedule.name, Schedules.user_id == current_user.uuid).first()
    if exist_schedules:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="List name already exist.")
    

    new_schedule = Schedules(
        name = schedule.name,
        user_id = current_user.uuid,
        start_date = schedule.start_date,
        end_date = schedule.end_date
    )

    db.add(new_schedule)
    db.commit()
    db.refresh(new_schedule)

    return JSONResponse(status_code=status.HTTP_201_CREATED, content={"message": "List is created successfully"})

@router.get("", response_model=List[ScheduleResponse | ScheduleAttractions])
async def get_schedules(
    list_id: int | None = None, 
    current_user: User = Depends(get_current_user)
):
    """
    Get schedules (all / by list_id)
    """
    if list_id: # get data by list_id
        pass 
    else: # get all schedules
        res = db.query(Schedules).filter(Schedules.user_id == current_user.uuid).all()

    return res

@router.patch("/{list_id}", response_model=ScheduleResponse)
async def update_schedule(
    list_id: int, 
    update: ScheduleUpdate,
    current_user: User = Depends(get_current_user)
):
    """
    Upate schedule time, date, or description
    """
    # first check if schedule exist
    schedule = db.query(Schedules).filter(and_(Schedules.user_id == current_user.uuid, Schedules.id == list_id)).first()
    if schedule is None:
        raise HTTPException(status_code=404, detail="Schedule not found")
    
    update_data = update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(schedule, key, value)

    try:
        db.commit()
        db.refresh(schedule)
        return schedule
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Schedule with that name already exists.",
        )

@router.delete("/{list_id}", response_model=ScheduleResponse)
async def delete_schedule(
    list_id: int, 
    current_user: User = Depends(get_current_user)
):
    """
    Delete schedule by id
    """
    schedule = db.query(Schedules).filter(and_(Schedules.user_id == current_user.uuid, Schedules.id == list_id)).first()
    if schedule is None:
        raise HTTPException(status_code=404, detail="Schedule not found")
    db.delete(schedule)
    db.commit()
    return schedule
