from fastapi import APIRouter

from . import  users, items

api_router = APIRouter()
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(items.router, prefix="/items", tags=["items"])


@api_router.get("/")
async def root():
    return {"message": "Backend API for FARM-docker operational !"}
