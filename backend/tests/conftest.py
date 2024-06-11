import pytest

from fastapi import HTTPException
from fastapi.testclient import TestClient
from app.main import app, get_db
from app.config.config import settings
from app.db.db_setup import Base, SessionLocal

from .utils import get_test_user_auth_headers, create_test_superuser

test_client = TestClient(app)
db = SessionLocal()

def clean_data():
    try:
        tables = Base.metadata.tables.keys()
        for name in tables:
            if name not in ['attractions', 'comment']:
                db.execute(
                    Base.metadata.tables[name].delete()
                )
        db.commit()
    except:
        db.rollback()

@pytest.fixture(scope="session")
def client():
    create_test_superuser(db)
    try:
        yield test_client
    finally:
        clean_data()

@pytest.fixture()
def session():
    with SessionLocal() as session:
        yield session

@pytest.fixture()
def superuser_auth_token():
    token = get_test_user_auth_headers(test_client, settings.FIRST_SUPERUSER, settings.FIRST_SUPERUSER_PASSWORD)
    return token


