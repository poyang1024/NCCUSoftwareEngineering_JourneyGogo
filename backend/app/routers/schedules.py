from typing import List, Optional, Any
from fastapi import APIRouter, HTTPException, Body, Depends, Request, status
from sqlalchemy import and_, or_, any_
from fastapi.responses import JSONResponse

from ..db.db_setup import SessionLocal
from ..schemas import schedules
from ..db.models import models

from ..auth.auth import (
    get_current_login_status,
    get_current_user,
    get_current_active_superuser,
    get_current_active_user,
)

router = APIRouter()

db = SessionLocal()

@router.post("", response_model=None)
async def create_schedules_list(
    schedule: schedules.ScheduleCreate,
    current_user: models.User = Depends(get_current_login_status)
):
    """
    Create a new schedule.
    """
    # check if list name exist
    exist_schedules = db.query(models.Schedules).filter(models.Schedules.name == schedule.name, models.Schedules.user_id == current_user.uuid).first()
    if exist_schedules:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="List name already exist.")
    

    new_schedule = models.Schedules(
        name = schedule.name,
        user_id = current_user.uuid,
        start_date = schedule.start_date,
        end_date = schedule.end_date
    )

    db.add(new_schedule)
    db.commit()
    db.refresh(new_schedule)

    return JSONResponse(status_code=status.HTTP_201_CREATED, content={"message": "List is created successfully"})