from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from src.database import get_db
from src.patients.service import PatientService


async def get_patient_service(
    db: AsyncSession = Depends(get_db),
) -> PatientService:
    return PatientService(db)
