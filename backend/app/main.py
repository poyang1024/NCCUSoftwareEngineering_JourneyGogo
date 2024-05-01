from fastapi import FastAPI, Depends, HTTPException
from typing import List, Annotated
from app import models
# �ޤJengine��database�]�w�n��SessionLocal
from app.database import engine, SessionLocal
# �ޤJSession
from sqlalchemy.orm import Session
from .routers.api import api_router
from .config.config import settings


app = FastAPI()
# �b��Ʈw���إ߭��models���]�w�n����Ƶ��c
models.Base.metadata.create_all(bind=engine)

# �C���ާ@get_db�ɡAdb�ϥ�SessionLocal�����Ѫ���ƻP��Ʈw�s�u�A����db�s�x�A���ƫ�����
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# �@��db��dependency�A�i�H�ݰ��O�n�ާ@��db�A�o�̪�Depends����get_db�Aget_db����SessionLocal    
db_dependency = Annotated[Session, Depends(get_db)]

app.include_router(api_router, prefix=settings.API_V1_STR)