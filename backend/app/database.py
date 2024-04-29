# �ޤJ���n�Ѽ�
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from pydantic import PostgresDsn
from .config.config import settings


# �s���쪺URL�A�o�̥�postgresql�|��
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

# ��create_engine��o��URL_DATABASE�إߤ@�Ӥ���
engine = create_engine(str(dsn))

# �ϥ�sessionmaker�ӻP��Ʈw�إߤ@�ӹ�ܡA�O�o�nbind=engine�A�o�~�|���M�שM��Ʈw�s��
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# �Ы�SQLAlchemy���@��class�A�M��b�䥦�a��ϥ�
Base = declarative_base()