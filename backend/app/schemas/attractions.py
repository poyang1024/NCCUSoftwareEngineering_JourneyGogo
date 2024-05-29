from typing import Optional
from pydantic import BaseModel

class Attraction(BaseModel):
    id: int
    name: str
    tag: Optional[str] = None
    city: str

class ListBase(BaseModel): # Favorites
    id: int
    name: str