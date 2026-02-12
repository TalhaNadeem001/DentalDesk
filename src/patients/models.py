from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional


class Patient(SQLModel, table=True):
    __tablename__ = "patients"
    
    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class PatientBiodata(SQLModel, table=True):
    __tablename__ = "patient_biodata"
    
    id: int | None = Field(default=None, primary_key=True)
    patient_id: int = Field(foreign_key="patients.id", unique=True, index=True)
    first_name: str = Field(max_length=100)
    last_name: str = Field(max_length=100)
    date_of_birth: datetime | None = None
    gender: str | None = Field(default=None, max_length=20)
    phone: str | None = Field(default=None, max_length=20)
    email: str | None = Field(default=None, max_length=255)
    address: str | None = Field(default=None, max_length=500)
    occupation: str | None = Field(default=None, max_length=200)
    emergency_contact_name: str | None = Field(default=None, max_length=100)
    emergency_contact_phone: str | None = Field(default=None, max_length=20)
    medical_history: str | None = Field(default=None)
    allergies: str | None = Field(default=None)
    medications: str | None = Field(default=None)
    previous_surgeries: str | None = Field(default=None)
    family_medical_history: str | None = Field(default=None)
    previous_dental_treatments: str | None = Field(default=None)
    gum_disease_history: str | None = Field(default=None)
    dental_visit_frequency: str | None = Field(default=None, max_length=100)
    oral_hygiene_habits: str | None = Field(default=None)
    dental_trauma_history: str | None = Field(default=None)
    smoking_tobacco_use: str | None = Field(default=None, max_length=200)
    alcohol_consumption: str | None = Field(default=None, max_length=200)
    diet_habits: str | None = Field(default=None)
    insurance_provider: str | None = Field(default=None, max_length=200)
    insurance_policy_number: str | None = Field(default=None, max_length=100)
    consent_forms: str | None = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class PatientRecordPlanner(SQLModel, table=True):
    __tablename__ = "patient_record_planner"
    
    id: int | None = Field(default=None, primary_key=True)
    patient_id: int = Field(foreign_key="patients.id", index=True)
    title: str = Field(max_length=200)
    description: str | None = Field(default=None)
    planned_date: datetime | None = None
    completed_date: datetime | None = None
    status: str = Field(default="planned", max_length=50)
    priority: str | None = Field(default=None, max_length=50)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class IntraoralPicture(SQLModel, table=True):
    __tablename__ = "intraoral_pictures"
    
    id: int | None = Field(default=None, primary_key=True)
    patient_id: int = Field(foreign_key="patients.id", index=True)
    image_url: str = Field(max_length=500)
    image_path: str | None = Field(default=None, max_length=500)
    description: str | None = Field(default=None)
    picture_type: str | None = Field(default=None, max_length=100)
    taken_date: datetime = Field(default_factory=datetime.utcnow)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class XRay(SQLModel, table=True):
    __tablename__ = "xrays"
    
    id: int | None = Field(default=None, primary_key=True)
    patient_id: int = Field(foreign_key="patients.id", index=True)
    image_url: str = Field(max_length=500)
    image_path: str | None = Field(default=None, max_length=500)
    xray_type: str | None = Field(default=None, max_length=100)
    description: str | None = Field(default=None)
    taken_date: datetime = Field(default_factory=datetime.utcnow)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Visit(SQLModel, table=True):
    __tablename__ = "visits"
    
    id: int | None = Field(default=None, primary_key=True)
    patient_id: int = Field(foreign_key="patients.id", index=True)
    visit_date: datetime = Field(default_factory=datetime.utcnow)
    visit_type: str | None = Field(default=None, max_length=100)
    chief_complaint: str | None = Field(default=None)
    examination_notes: str | None = Field(default=None)
    diagnosis: str | None = Field(default=None)
    treatment_plan: str | None = Field(default=None)
    treatment_performed: str | None = Field(default=None)
    next_appointment: datetime | None = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
