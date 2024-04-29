from fastapi import FastAPI, Depends, HTTPException
from typing import List, Annotated
from app import models
# �ޤJengine��database�]�w�n��SessionLocal
from app.database import engine, SessionLocal
# �ޤJSession
from sqlalchemy.orm import Session

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

@app.get('/questions/{question_id}')
async def get_a_question(question_id:int, db:db_dependency):
    result = db.query(models.Question).filter(models.Question.id == question_id).first()
    if not result:
        raise HTTPException(status_code=404, detail='This id\'s question is not found...')
    return result

@app.get('/users')
async def get_a_question(db:db_dependency):
    result = db.query(models.User).all()
    if not result:
        raise HTTPException(status_code=404, detail='This id\'s question is not found...')
    return result

