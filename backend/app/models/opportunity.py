from sqlalchemy import Column, Integer, String, Float, Boolean, Text

from app.database.database import Base


class Opportunity(Base):
    __tablename__ = "opportunities"

    # Primary key
    id = Column(Integer, primary_key=True, index=True)

    # Basic opportunity information
    title = Column(String, nullable=False)
    organization = Column(String, nullable=False)
    organization_type = Column(String, nullable=True)

    # Opportunity type
    # internship / scholarship
    kind = Column(String, nullable=False)

    # Description and details
    description = Column(Text, nullable=True)

    field = Column(String, nullable=True)
    location = Column(String, nullable=True)

    state = Column(String, nullable=True)
    country = Column(String, nullable=True)

    # Internship / work information
    remote = Column(Boolean, default=False)
    duration = Column(String, nullable=True)
    amount_or_stipend = Column(String, nullable=True)

    # Eligibility requirements
    required_degree = Column(String, nullable=True)
    required_year = Column(String, nullable=True)

    minimum_cgpa = Column(Float, default=0)
    income_limit = Column(Float, nullable=True)

    required_skills = Column(Text, nullable=True)

    # Scholarship / opportunity eligibility details
    eligibility = Column(Text, nullable=True)

    # Required documents
    documents = Column(Text, nullable=True)

    # Deadline
    deadline = Column(String, nullable=True)

    # Official source
    official_url = Column(String, nullable=True)
    source = Column(String, nullable=True)

    # Verification
    verification_date = Column(String, nullable=True)
    verified = Column(Boolean, default=False)