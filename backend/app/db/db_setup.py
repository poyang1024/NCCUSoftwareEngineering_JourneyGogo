from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from pydantic import PostgresDsn
from app.config.config import settings

URL_DATABASE='postgresql://postgres:changethis@localhost:5432/app'


# Setup PostgreSQL connection
dsn = PostgresDsn.build(
    scheme="postgresql",
    username=settings.POSTGRES_USER,
    password=settings.POSTGRES_PASSWORD,
    host=settings.POSTGRES_SERVER,
    port=(settings.POSTGRES_PORT),
    path=f"{settings.POSTGRES_DB}"
)

engine = create_engine(URL_DATABASE, echo=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# DB Utilities, dependency to provide database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()