from fastapi import APIRouter

from . import users, items, login, attractions, schedules, favorites

api_router = APIRouter()
api_router.include_router(login.router, prefix="/login", tags=["login"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(attractions.router, prefix="/attractions", tags=["attractions"])
api_router.include_router(schedules.router, prefix="/schedules", tags=["schedules"])
api_router.include_router(favorites.router, prefix="/favorites", tags=["favorites"])
# api_router.include_router(items.router, prefix="/items", tags=["items"])


@api_router.get("/")
async def root():
    return {"message": "Backend API for FARM-docker operational !"}

