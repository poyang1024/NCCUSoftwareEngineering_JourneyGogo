from typing import Optional
from pydantic import BaseModel, field_validator
from uuid import UUID
from datetime import date, datetime

class ScheduleCreate(BaseModel):
    name: str
    start_date: date
    end_date: date

class ScheduleResponse(ScheduleCreate):
    id: int

class ScheduleAttractionResponse(BaseModel):
    attraction_id: int
    attraction_name: str
    image: str
    start_time: datetime

class ScheduleUpdate(ScheduleCreate):
    description: str

class AttractionTimeInput(BaseModel):
    start_time: datetime

class AttractionTimeUpdate(BaseModel):
    start_time: datetime