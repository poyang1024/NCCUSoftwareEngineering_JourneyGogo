from pydantic import BaseModel
from typing import Optional,List
from ..database import SessionLocal

class Item(BaseModel): #serializer
    id:int
    name:str
    description:str
    price:int
    on_offer:bool

    class Config:
        orm_mode=True