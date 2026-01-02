from sqlmodel import SQLModel, create_engine, Session # type: ignore
from typing import Generator

DATABASE_URL = "sqlite:///./mh.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

def get_session() -> Generator:
    with Session(engine) as session:
        yield session

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
