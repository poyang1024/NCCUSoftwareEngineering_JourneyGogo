from typing import Optional
from pydantic import BaseModel

class FavoritesCreate(BaseModel):
    name: str

class FavoritesResponse(FavoritesCreate):
    id: int

class FavoritesAttractionResponse(BaseModel):
    attraction_id: int
    attraction_name: str
    image: str

class FavoritesAttractions(BaseModel):
    attravtion_name: str
    image: str
