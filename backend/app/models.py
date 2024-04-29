# �qSQLAlchemy�ޤJ�������ѼơA�ӳ]�wmodels
from sqlalchemy import Column, String, Boolean, Integer, ForeignKey

# �qdatabase.py�ޤJ���]�w�n��Base�A�åΥ��ӫإ߭n�s�J��Ʈw����ƧκA
from app.database import Base
from uuid import uuid4
from sqlalchemy.dialects.postgresql import UUID

# �إ�class���~��Base�A�]�w�s�J��tablename�A�ó]�wPK�A�٦��U��column�s�J����ƧκA
class Question(Base):
    __tablename__= 'Questions'

    id = Column(Integer, primary_key=True, index=True)
    question_text = Column(String)
class User(Base):
    __tablename__ = 'users'

    uuid = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    email = Column(String, unique=True, index=True)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    hashed_password = Column(String, nullable=True)
    provider = Column(String, nullable=True)
    picture = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)