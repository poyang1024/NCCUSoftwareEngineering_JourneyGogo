from typing import List, Optional, Any, Union
from fastapi import APIRouter, HTTPException, Body, Depends, Request, status
from sqlalchemy import and_, or_, any_
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError, PendingRollbackError

from ..db.db_setup import SessionLocal
from ..schemas.schedules import ScheduleCreate, ScheduleResponse, ScheduleAttractionResponse,  AttractionTimeInput, AttractionTimeUpdate
from ..db.models.models import Schedules, ListBase, User, ScheduledAttraction, Attraction

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

@router.get("",response_model=Union[List[ScheduleResponse],List[ScheduleAttractionResponse]])
async def get_schedules(
    list_id: int | None = None, 
    current_user: User = Depends(get_current_user)
):
    """
    Get schedules (all / by list_id)
    """
    if list_id: # get data by list_id
        result = db.query(ScheduledAttraction, Attraction).join(Attraction, Attraction.id == ScheduledAttraction.attraction).join(Schedules).filter(and_(Schedules.user_id == current_user.uuid, list_id == ScheduledAttraction.saved_list)).all()
        res = []
        for sa, a in result:
            res.append({
                "attraction_id": a.id,
                "attraction_name": a.name,
                "image": a.pic_url,
                "start_time": sa.start_time,
                # "end_time": sa.end_time
            })
    else: # get all schedules
        res = db.query(Schedules).filter(Schedules.user_id == current_user.uuid).all()

    return res

@router.patch("/{list_id}", response_model=ScheduleResponse)
async def update_schedule(
    list_id: int, 
    update: ScheduleCreate,
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

# CRUD for schedule in specific schedule list
@router.post("/{list_id}/{attraction_id}")
async def add_attraction_to_scheduleList(
    list_id: int,
    attraction_id: int,
    time_interval:AttractionTimeInput,
    current_user: User = Depends(get_current_user)
):
    """
    add attraction to specific scheduleList
    """
    # check if the list belong to this user
    schedule = db.query(Schedules).filter(and_(Schedules.user_id == current_user.uuid, Schedules.id == list_id)).first()
    if schedule is None:
        raise HTTPException(status_code=404, detail="Schedule not found")
    
    # Check if the attraction already exists in the schedule list
    existing_attraction = db.query(ScheduledAttraction).filter(
        and_(
            ScheduledAttraction.saved_list == list_id,
            ScheduledAttraction.attraction == attraction_id
        )
    ).first()
    if existing_attraction:
        raise HTTPException(status_code=400, detail="Attraction already exists in the schedule list")
    
    try:
        new_instance = ScheduledAttraction(
            saved_list = list_id,
            attraction = attraction_id,
            start_time = time_interval.start_time,
        )

        db.add(new_instance)
        db.commit()
        db.refresh(new_instance)
        # also return the attraction name and image
        attraction = db.query(Attraction).filter(Attraction.id == attraction_id).first()
        response = {
            "attraction_id": attraction.id,
            "attraction_name": attraction.name,
            "image": attraction.pic_url,
            "start_time": new_instance.start_time
        }

        return response
    except PendingRollbackError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Attraction not found.",
        )

@router.patch("/{list_id}/{attraction_id}", response_model=ScheduleEditResponse)
async def update_schedule_attraction(
    list_id: int,
    attraction_id: int,
    update: AttractionTimeUpdate,
    current_user: User = Depends(get_current_user)
):
    """
    Upate attraction time
    """
    scheduled_attraction = db.query(ScheduledAttraction).join(Schedules).filter(
        and_(
            Schedules.user_id == current_user.uuid,
            ScheduledAttraction.saved_list == list_id,
            ScheduledAttraction.attraction == attraction_id
        )
    ).first()

    # Check if the scheduled attraction exists and belongs to the current user
    if not scheduled_attraction:
        raise HTTPException(status_code=404, detail="Attraction not found in the schedule list.")

    # Update the attraction time
    scheduled_attraction.start_time = update.start_time

    try:
        db.commit()
        db.refresh(scheduled_attraction)
        return scheduled_attraction
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Something wrong.",
        )

@router.delete("/{list_id}/{attraction_id}")
async def delete_schedule_attraction(
    list_id: int,
    attraction_id: int,
    current_user: User = Depends(get_current_user)
):
    """
    delete attraction in specific schedule
    """
    # Check if the list belongs to this user
    schedule = db.query(Schedules).filter(
        and_(Schedules.user_id == current_user.uuid, Schedules.id == list_id)
    ).first()
    if schedule is None:
        raise HTTPException(status_code=404, detail="Schedule not found")

    # Check if the attraction exists in the schedule list
    scheduled_attraction = db.query(ScheduledAttraction).filter(
        and_(
            ScheduledAttraction.saved_list == list_id,
            ScheduledAttraction.attraction == attraction_id
        )
    ).first()
    if scheduled_attraction is None:
        raise HTTPException(status_code=404, detail="Attraction not found in the schedule list.")

    # Delete the attraction from the schedule list
    db.delete(scheduled_attraction)
    db.commit()

    return scheduled_attraction
