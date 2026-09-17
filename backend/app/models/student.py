from sqlalchemy import Column, Integer, String, Float, Text
from app.database.database import Base

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    degree = Column(String, default="")
    department = Column(String, default="")
    year = Column(Integer, nullable=True)
    graduation_year = Column(Integer, nullable=True)
    cgpa = Column(Float, nullable=True)
    skills = Column(Text, default="")
    interests = Column(Text, default="")
    state = Column(String, default="")
    country = Column(String, default="India")
    annual_income = Column(Float, nullable=True)
    category = Column(String, default="")
