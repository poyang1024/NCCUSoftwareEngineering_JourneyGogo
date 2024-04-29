# 從SQLAlchemy引入相應的參數，來設定models
from sqlalchemy import Column, String, Boolean, Integer, ForeignKey

# 從database.py引入剛剛設定好的Base，並用它來建立要存入資料庫的資料形態
from app.database import Base
from uuid import uuid4
from sqlalchemy.dialects.postgresql import UUID

# 建立class並繼承Base，設定存入的tablename，並設定PK，還有各個column存入的資料形態
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