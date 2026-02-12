from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional


class PatientCreate(BaseModel):
    user_id: int


class PatientResponse(BaseModel):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PatientBiodataCreate(BaseModel):
    patient_id: int
    first_name: str = Field(min_length=1, max_length=100)
    last_name: str = Field(min_length=1, max_length=100)
    date_of_birth: Optional[datetime] = None
    gender: Optional[str] = Field(default=None, max_length=20)
    phone: Optional[str] = Field(default=None, max_length=20)
    email: Optional[str] = Field(default=None, max_length=255)
    address: Optional[str] = Field(default=None, max_length=500)
    occupation: Optional[str] = Field(default=None, max_length=200)
    emergency_contact_name: Optional[str] = Field(default=None, max_length=100)
    emergency_contact_phone: Optional[str] = Field(default=None, max_length=20)
    medical_history: Optional[str] = None
    allergies: Optional[str] = None
    medications: Optional[str] = None
    previous_surgeries: Optional[str] = None
    family_medical_history: Optional[str] = None
    previous_dental_treatments: Optional[str] = None
    gum_disease_history: Optional[str] = None
    dental_visit_frequency: Optional[str] = Field(default=None, max_length=100)
    oral_hygiene_habits: Optional[str] = None
    dental_trauma_history: Optional[str] = None
    smoking_tobacco_use: Optional[str] = Field(default=None, max_length=200)
    alcohol_consumption: Optional[str] = Field(default=None, max_length=200)
    diet_habits: Optional[str] = None
    insurance_provider: Optional[str] = Field(default=None, max_length=200)
    insurance_policy_number: Optional[str] = Field(default=None, max_length=100)
    consent_forms: Optional[str] = None


class PatientBiodataUpdate(BaseModel):
    first_name: Optional[str] = Field(default=None, max_length=100)
    last_name: Optional[str] = Field(default=None, max_length=100)
    date_of_birth: Optional[datetime] = None
    gender: Optional[str] = Field(default=None, max_length=20)
    phone: Optional[str] = Field(default=None, max_length=20)
    email: Optional[str] = Field(default=None, max_length=255)
    address: Optional[str] = Field(default=None, max_length=500)
    occupation: Optional[str] = Field(default=None, max_length=200)
    emergency_contact_name: Optional[str] = Field(default=None, max_length=100)
    emergency_contact_phone: Optional[str] = Field(default=None, max_length=20)
    medical_history: Optional[str] = None
    allergies: Optional[str] = None
    medications: Optional[str] = None
    previous_surgeries: Optional[str] = None
    family_medical_history: Optional[str] = None
    previous_dental_treatments: Optional[str] = None
    gum_disease_history: Optional[str] = None
    dental_visit_frequency: Optional[str] = Field(default=None, max_length=100)
    oral_hygiene_habits: Optional[str] = None
    dental_trauma_history: Optional[str] = None
    smoking_tobacco_use: Optional[str] = Field(default=None, max_length=200)
    alcohol_consumption: Optional[str] = Field(default=None, max_length=200)
    diet_habits: Optional[str] = None
    insurance_provider: Optional[str] = Field(default=None, max_length=200)
    insurance_policy_number: Optional[str] = Field(default=None, max_length=100)
    consent_forms: Optional[str] = None


class PatientBiodataResponse(BaseModel):
    id: int
    patient_id: int
    first_name: str
    last_name: str
    date_of_birth: Optional[datetime]
    gender: Optional[str]
    phone: Optional[str]
    email: Optional[str]
    address: Optional[str]
    occupation: Optional[str]
    emergency_contact_name: Optional[str]
    emergency_contact_phone: Optional[str]
    medical_history: Optional[str]
    allergies: Optional[str]
    medications: Optional[str]
    previous_surgeries: Optional[str]
    family_medical_history: Optional[str]
    previous_dental_treatments: Optional[str]
    gum_disease_history: Optional[str]
    dental_visit_frequency: Optional[str]
    oral_hygiene_habits: Optional[str]
    dental_trauma_history: Optional[str]
    smoking_tobacco_use: Optional[str]
    alcohol_consumption: Optional[str]
    diet_habits: Optional[str]
    insurance_provider: Optional[str]
    insurance_policy_number: Optional[str]
    consent_forms: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PatientRecordPlannerCreate(BaseModel):
    patient_id: int
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = None
    planned_date: Optional[datetime] = None
    status: str = Field(default="planned", max_length=50)
    priority: Optional[str] = Field(default=None, max_length=50)


class PatientRecordPlannerUpdate(BaseModel):
    title: Optional[str] = Field(default=None, max_length=200)
    description: Optional[str] = None
    planned_date: Optional[datetime] = None
    completed_date: Optional[datetime] = None
    status: Optional[str] = Field(default=None, max_length=50)
    priority: Optional[str] = Field(default=None, max_length=50)


class PatientRecordPlannerResponse(BaseModel):
    id: int
    patient_id: int
    title: str
    description: Optional[str]
    planned_date: Optional[datetime]
    completed_date: Optional[datetime]
    status: str
    priority: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class IntraoralPictureCreate(BaseModel):
    patient_id: int
    image_url: str = Field(min_length=1, max_length=500)
    image_path: Optional[str] = Field(default=None, max_length=500)
    description: Optional[str] = None
    picture_type: Optional[str] = Field(default=None, max_length=100)
    taken_date: Optional[datetime] = None


class IntraoralPictureResponse(BaseModel):
    id: int
    patient_id: int
    image_url: str
    image_path: Optional[str]
    description: Optional[str]
    picture_type: Optional[str]
    taken_date: datetime
    created_at: datetime

    class Config:
        from_attributes = True


class XRayCreate(BaseModel):
    patient_id: int
    image_url: str = Field(min_length=1, max_length=500)
    image_path: Optional[str] = Field(default=None, max_length=500)
    xray_type: Optional[str] = Field(default=None, max_length=100)
    description: Optional[str] = None
    taken_date: Optional[datetime] = None


class XRayResponse(BaseModel):
    id: int
    patient_id: int
    image_url: str
    image_path: Optional[str]
    xray_type: Optional[str]
    description: Optional[str]
    taken_date: datetime
    created_at: datetime

    class Config:
        from_attributes = True


class VisitCreate(BaseModel):
    patient_id: int
    visit_date: Optional[datetime] = None
    visit_type: Optional[str] = Field(default=None, max_length=100)
    chief_complaint: Optional[str] = None
    examination_notes: Optional[str] = None
    diagnosis: Optional[str] = None
    treatment_plan: Optional[str] = None
    treatment_performed: Optional[str] = None
    next_appointment: Optional[datetime] = None


class VisitUpdate(BaseModel):
    visit_date: Optional[datetime] = None
    visit_type: Optional[str] = Field(default=None, max_length=100)
    chief_complaint: Optional[str] = None
    examination_notes: Optional[str] = None
    diagnosis: Optional[str] = None
    treatment_plan: Optional[str] = None
    treatment_performed: Optional[str] = None
    next_appointment: Optional[datetime] = None


class VisitResponse(BaseModel):
    id: int
    patient_id: int
    visit_date: datetime
    visit_type: Optional[str]
    chief_complaint: Optional[str]
    examination_notes: Optional[str]
    diagnosis: Optional[str]
    treatment_plan: Optional[str]
    treatment_performed: Optional[str]
    next_appointment: Optional[datetime]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
