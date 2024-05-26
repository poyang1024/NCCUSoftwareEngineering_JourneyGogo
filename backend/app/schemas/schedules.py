from typing import Optional
from pydantic import BaseModel
from uuid import UUID
from datetime import date

class ScheduleCreate(BaseModel):
    name: str
    start_date: date
    end_date: date
