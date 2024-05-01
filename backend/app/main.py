from fastapi import FastAPI, Depends, HTTPException
from typing import List, Annotated
from app import models
# 引入engine及database設定好的SessionLocal
from app.database import engine, SessionLocal
# 引入Session
from sqlalchemy.orm import Session
from .routers.api import api_router
from .config.config import settings


app = FastAPI()
# 在資料庫中建立剛剛models中設定好的資料結構
models.Base.metadata.create_all(bind=engine)

# 每次操作get_db時，db使用SessionLocal中提供的資料與資料庫連線，產生db存儲，完事後關閉
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 一個db的dependency，可以看做是要操作的db，這裡的Depends對應get_db，get_db對應SessionLocal    
db_dependency = Annotated[Session, Depends(get_db)]

app.include_router(api_router, prefix=settings.API_V1_STR)