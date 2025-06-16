from sqlalchemy import Column, Integer, String
from app.database.connection import Base
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, nullable=False)
    password = Column(String)

    notes = relationship("Note", back_populates="user")
    todos = relationship("Todo", back_populates="user")
    journals = relationship("Journal", back_populates="user")
