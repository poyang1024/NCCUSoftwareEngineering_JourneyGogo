from typing import List
from fastapi import APIRouter, HTTPException,  Depends, status
from sqlalchemy import and_
from fastapi.responses import JSONResponse
from sqlalchemy.exc import PendingRollbackError

from ..db.db_setup import SessionLocal
from app.schemas.favorites import FavoritesCreate, FavoritesResponse, FavoritesUpdate
from app.db.models.models import ListBase, User, SavedAttraction

from ..auth.auth import (
    get_current_user,
)

router = APIRouter()

db = SessionLocal()

@router.post("", response_model=None)
async def create_favorites_list(
    favorite: FavoritesCreate,
    current_user: User = Depends(get_current_user)
):
    """
    Create a new favorite list.
    """
    # check if list name exists
    exist_favorites = db.query(ListBase).filter(ListBase.name == favorite.name, ListBase.user_id == current_user.uuid).first()
    if exist_favorites:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="List name already exists.")

    new_favorite = ListBase(
        name=favorite.name,
        user_id=current_user.uuid,
        description=favorite.description
    )

    db.add(new_favorite)
    db.commit()
    db.refresh(new_favorite)

    return JSONResponse(status_code=status.HTTP_201_CREATED, content={"message": "List is created successfully"})

@router.get("", response_model=List[FavoritesResponse])
async def get_favorites(
    list_id: int | None = None, 
    current_user: User = Depends(get_current_user)
):
    """
    Get favorite lists (all / by list_id)
    """
    if list_id:  # get data by list_id
        favorite = db.query(ListBase).filter(ListBase.id == list_id, ListBase.user_id == current_user.uuid).first()
        if not favorite:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="List not found")
        return [favorite]
    else:  # get all favorite lists
        res = db.query(ListBase).filter(ListBase.user_id == current_user.uuid).all()
        return res

@router.patch("/{list_id}", response_model=FavoritesResponse)
async def update_favorite(
    list_id: int, 
    update: FavoritesUpdate,
    current_user: User = Depends(get_current_user)
):
    """
    Update a favorite list.
    """
    favorite_list = db.query(ListBase).filter(ListBase.id == list_id, ListBase.user_id == current_user.uuid).first()
    if not favorite_list:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="List not found")

    for key, value in update.dict(exclude_unset=True).items():
        setattr(favorite_list, key, value)

    db.commit()
    db.refresh(favorite_list)

    return favorite_list

@router.delete("/{list_id}", response_model=FavoritesResponse)
async def delete_favorite_list(
    list_id: int, 
    current_user: User = Depends(get_current_user)
):
    """
    Delete favorite list by id
    """
    favorite_list = db.query(ListBase).filter(and_(ListBase.user_id == current_user.uuid, ListBase.id == list_id)).first()
    if favorite_list is None:
        raise HTTPException(status_code=404, detail="favorite list not found")
    db.delete(favorite_list)
    db.commit()
    return favorite_list

# CRUD for favorites in specific favorites list
@router.post("/{list_id}/{attraction_id}")
async def add_attraction_to_favorite_list(
    list_id: int,
    attraction_id: int,
    current_user: User = Depends(get_current_user),
):
    """
    Add attraction to specific favorite list.
    """
    # Check if the list belongs to this user
    favorite_list = db.query(ListBase).filter(and_(ListBase.user_id == current_user.uuid, ListBase.id == list_id)).first()
    if not favorite_list:
        raise HTTPException(status_code=404, detail="Favorite list not found")
    
    # Check if the attraction already exists in the favorite list
    existing_attraction = db.query(SavedAttraction).filter(
        and_(
            SavedAttraction.saved_list == list_id,
            SavedAttraction.attraction == attraction_id,
            SavedAttraction.type == 0  # 0 for saved
        )
    ).first()
    if existing_attraction:
        raise HTTPException(status_code=400, detail="Attraction already exists in the favorite list")
    
    try:
        new_favorite = SavedAttraction(
            saved_list=list_id,
            attraction=attraction_id,
            type=0  # 0 for saved
        )

        db.add(new_favorite)
        db.commit()
        db.refresh(new_favorite)

        return JSONResponse(status_code=status.HTTP_201_CREATED, content={"message": "Attraction added to favorite list successfully"})
    except PendingRollbackError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Failed to add attraction to favorite list.",
        )

@router.delete("/{list_id}/{attraction_id}")
async def delete_favorite_attraction(
    list_id: int,
    attraction_id: int,
    current_user: User = Depends(get_current_user),
):
    """
    Delete attraction from specific favorite list.
    """
    # Check if the list belongs to this user
    favorite_list = db.query(ListBase).filter(
        and_(ListBase.user_id == current_user.uuid, ListBase.id == list_id)
    ).first()
    if not favorite_list:
        raise HTTPException(status_code=404, detail="Favorite list not found")

    # Check if the attraction exists in the favorite list
    favorite_attraction = db.query(SavedAttraction).filter(
        and_(
            SavedAttraction.saved_list == list_id,
            SavedAttraction.attraction == attraction_id,
            SavedAttraction.type == 0  # 0 for saved
        )
    ).first()
    if not favorite_attraction:
        raise HTTPException(status_code=404, detail="Attraction not found in the favorite list.")

    # Delete the attraction from the favorite list
    db.delete(favorite_attraction)
    db.commit()

    return JSONResponse(status_code=status.HTTP_200_OK, content={"message": "Attraction deleted from favorite list successfully"})