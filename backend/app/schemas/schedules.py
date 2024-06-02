from typing import Optional
from pydantic import BaseModel
from uuid import UUID
from datetime import date, datetime

class ScheduleCreate(BaseModel):
    name: str
    start_date: date
    end_date: date

class ScheduleResponse(ScheduleCreate):
    id: int

class ScheduleAttractions(BaseModel):
    attravtion_name: str
    image: str
    start_time: datetime
    end_time: datetime

class ScheduleUpdate(ScheduleCreate):
    description: str

