from pydantic import BaseModel
from typing import Optional

class StudentIn(BaseModel):
    name: str
    email: str
    degree: str = ""
    department: str = ""
    year: Optional[int] = None
    graduation_year: Optional[int] = None
    cgpa: Optional[float] = None
    skills: str = ""
    interests: str = ""
    state: str = ""
    country: str = "India"
    annual_income: Optional[float] = None
    category: str = ""

class MatchRequest(BaseModel):
    student: StudentIn
