from typing import Optional
from pydantic import BaseModel

class FavoritesCreate(BaseModel):
    name: str
    description: Optional[str] = None

class FavoritesResponse(FavoritesCreate):
    id: int

class FavoritesAttractions(BaseModel):
    attravtion_name: str
    image: str

class FavoritesUpdate(FavoritesCreate):
    description: str
