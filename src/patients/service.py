from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional
from src.patients.models import (
    Patient,
    PatientBiodata,
    PatientRecordPlanner,
    IntraoralPicture,
    XRay,
    Visit,
)
from src.patients.schema import (
    PatientCreate,
    PatientBiodataCreate,
    PatientBiodataUpdate,
    PatientRecordPlannerCreate,
    PatientRecordPlannerUpdate,
    IntraoralPictureCreate,
    XRayCreate,
    VisitCreate,
    VisitUpdate,
)
from src.patients.exceptions import (
    PatientNotFoundError,
    PatientBiodataNotFoundError,
    PatientBiodataAlreadyExistsError,
    RecordPlannerNotFoundError,
    IntraoralPictureNotFoundError,
    XRayNotFoundError,
    VisitNotFoundError,
)


class PatientService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_patient(self, request: PatientCreate) -> Patient:
        new_patient = Patient(user_id=request.user_id)
        self.db.add(new_patient)
        await self.db.commit()
        await self.db.refresh(new_patient)
        return new_patient

    async def get_patient_by_id(self, patient_id: int) -> Patient:
        patient = await self.db.get(Patient, patient_id)
        if not patient:
            raise PatientNotFoundError("Patient not found")
        return patient

    async def get_patients_by_user_id(self, user_id: int) -> list[Patient]:
        result = await self.db.execute(
            select(Patient).where(Patient.user_id == user_id)
        )
        return list(result.scalars().all())

    async def delete_patient(self, patient_id: int) -> None:
        patient = await self.db.get(Patient, patient_id)
        if not patient:
            raise PatientNotFoundError("Patient not found")
        await self.db.delete(patient)
        await self.db.commit()

    async def create_or_update_biodata(
        self, request: PatientBiodataCreate
    ) -> PatientBiodata:
        existing_biodata = await self.db.scalar(
            select(PatientBiodata).where(PatientBiodata.patient_id == request.patient_id)
        )
        
        if existing_biodata:
            raise PatientBiodataAlreadyExistsError(
                "Biodata already exists for this patient. Use update endpoint."
            )
        
        new_biodata = PatientBiodata(**request.model_dump())
        self.db.add(new_biodata)
        await self.db.commit()
        await self.db.refresh(new_biodata)
        return new_biodata

    async def update_biodata(
        self, patient_id: int, request: PatientBiodataUpdate
    ) -> PatientBiodata:
        biodata = await self.db.scalar(
            select(PatientBiodata).where(PatientBiodata.patient_id == patient_id)
        )
        if not biodata:
            raise PatientBiodataNotFoundError("Patient biodata not found")
        
        update_data = request.model_dump(exclude_unset=True)
        update_data["updated_at"] = datetime.utcnow()
        
        for field, value in update_data.items():
            setattr(biodata, field, value)
        
        await self.db.commit()
        await self.db.refresh(biodata)
        return biodata

    async def get_biodata_by_patient_id(self, patient_id: int) -> PatientBiodata:
        biodata = await self.db.scalar(
            select(PatientBiodata).where(PatientBiodata.patient_id == patient_id)
        )
        if not biodata:
            raise PatientBiodataNotFoundError("Patient biodata not found")
        return biodata

    async def create_record_planner(
        self, request: PatientRecordPlannerCreate
    ) -> PatientRecordPlanner:
        new_planner = PatientRecordPlanner(**request.model_dump())
        self.db.add(new_planner)
        await self.db.commit()
        await self.db.refresh(new_planner)
        return new_planner

    async def get_record_planners_by_patient_id(
        self, patient_id: int
    ) -> list[PatientRecordPlanner]:
        result = await self.db.execute(
            select(PatientRecordPlanner).where(
                PatientRecordPlanner.patient_id == patient_id
            )
        )
        return list(result.scalars().all())

    async def update_record_planner(
        self, planner_id: int, request: PatientRecordPlannerUpdate
    ) -> PatientRecordPlanner:
        planner = await self.db.get(PatientRecordPlanner, planner_id)
        if not planner:
            raise RecordPlannerNotFoundError("Record planner not found")
        
        update_data = request.model_dump(exclude_unset=True)
        update_data["updated_at"] = datetime.utcnow()
        
        for field, value in update_data.items():
            setattr(planner, field, value)
        
        await self.db.commit()
        await self.db.refresh(planner)
        return planner

    async def delete_record_planner(self, planner_id: int) -> None:
        planner = await self.db.get(PatientRecordPlanner, planner_id)
        if not planner:
            raise RecordPlannerNotFoundError("Record planner not found")
        await self.db.delete(planner)
        await self.db.commit()

    async def create_intraoral_picture(
        self, request: IntraoralPictureCreate
    ) -> IntraoralPicture:
        picture_data = request.model_dump()
        if not picture_data.get("taken_date"):
            picture_data["taken_date"] = datetime.utcnow()
        
        new_picture = IntraoralPicture(**picture_data)
        self.db.add(new_picture)
        await self.db.commit()
        await self.db.refresh(new_picture)
        return new_picture

    async def get_intraoral_pictures_by_patient_id(
        self, patient_id: int
    ) -> list[IntraoralPicture]:
        result = await self.db.execute(
            select(IntraoralPicture).where(IntraoralPicture.patient_id == patient_id)
        )
        return list(result.scalars().all())

    async def delete_intraoral_picture(self, picture_id: int) -> None:
        picture = await self.db.get(IntraoralPicture, picture_id)
        if not picture:
            raise IntraoralPictureNotFoundError("Intraoral picture not found")
        await self.db.delete(picture)
        await self.db.commit()

    async def create_xray(self, request: XRayCreate) -> XRay:
        xray_data = request.model_dump()
        if not xray_data.get("taken_date"):
            xray_data["taken_date"] = datetime.utcnow()
        
        new_xray = XRay(**xray_data)
        self.db.add(new_xray)
        await self.db.commit()
        await self.db.refresh(new_xray)
        return new_xray

    async def get_xrays_by_patient_id(self, patient_id: int) -> list[XRay]:
        result = await self.db.execute(
            select(XRay).where(XRay.patient_id == patient_id)
        )
        return list(result.scalars().all())

    async def delete_xray(self, xray_id: int) -> None:
        xray = await self.db.get(XRay, xray_id)
        if not xray:
            raise XRayNotFoundError("X-ray not found")
        await self.db.delete(xray)
        await self.db.commit()

    async def create_visit(self, request: VisitCreate) -> Visit:
        visit_data = request.model_dump()
        if not visit_data.get("visit_date"):
            visit_data["visit_date"] = datetime.utcnow()
        
        new_visit = Visit(**visit_data)
        self.db.add(new_visit)
        await self.db.commit()
        await self.db.refresh(new_visit)
        return new_visit

    async def get_visits_by_patient_id(self, patient_id: int) -> list[Visit]:
        result = await self.db.execute(
            select(Visit).where(Visit.patient_id == patient_id).order_by(Visit.visit_date.desc())
        )
        return list(result.scalars().all())

    async def get_visit_by_id(self, visit_id: int) -> Visit:
        visit = await self.db.get(Visit, visit_id)
        if not visit:
            raise VisitNotFoundError("Visit not found")
        return visit

    async def update_visit(self, visit_id: int, request: VisitUpdate) -> Visit:
        visit = await self.db.get(Visit, visit_id)
        if not visit:
            raise VisitNotFoundError("Visit not found")
        
        update_data = request.model_dump(exclude_unset=True)
        update_data["updated_at"] = datetime.utcnow()
        
        for field, value in update_data.items():
            setattr(visit, field, value)
        
        await self.db.commit()
        await self.db.refresh(visit)
        return visit

    async def delete_visit(self, visit_id: int) -> None:
        visit = await self.db.get(Visit, visit_id)
        if not visit:
            raise VisitNotFoundError("Visit not found")
        await self.db.delete(visit)
        await self.db.commit()
