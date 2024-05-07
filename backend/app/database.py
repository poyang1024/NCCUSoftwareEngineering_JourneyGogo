# 引入必要參數
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from pydantic import PostgresDsn
from .config.config import settings


# 連接到的URL，這裡用postgresql舉例
# URL_DATABASE='postgresql://postgres:changethis@db:5432/app'


# Setup PostgreSQL connection
dsn = PostgresDsn.build(
    scheme="postgresql",
    username=settings.POSTGRES_USER,
    password=settings.POSTGRES_PASSWORD,
    host=settings.POSTGRES_SERVER,
    port=(settings.POSTGRES_PORT),
    path=f"{settings.POSTGRES_DB}"
)

# 用create_engine對這個URL_DATABASE建立一個引擎
engine = create_engine(str(dsn))

# 使用sessionmaker來與資料庫建立一個對話，記得要bind=engine，這才會讓專案和資料庫連結
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 創建SQLAlchemy的一個class，然後在其它地方使用
Base = declarative_base()