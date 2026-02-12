from fastapi import APIRouter, Depends, HTTPException, status
from src.patients.schema import (
    PatientCreate,
    PatientResponse,
    PatientBiodataCreate,
    PatientBiodataUpdate,
    PatientBiodataResponse,
    PatientRecordPlannerCreate,
    PatientRecordPlannerUpdate,
    PatientRecordPlannerResponse,
    IntraoralPictureCreate,
    IntraoralPictureResponse,
    XRayCreate,
    XRayResponse,
    VisitCreate,
    VisitUpdate,
    VisitResponse,
)
from src.patients.service import PatientService
from src.patients.dependencies import get_patient_service
from src.patients.exceptions import (
    PatientNotFoundError,
    PatientBiodataNotFoundError,
    PatientBiodataAlreadyExistsError,
    RecordPlannerNotFoundError,
    IntraoralPictureNotFoundError,
    XRayNotFoundError,
    VisitNotFoundError,
)

router = APIRouter(prefix="/patients", tags=["patients"])


@router.post("", response_model=PatientResponse, status_code=status.HTTP_201_CREATED)
async def create_patient(
    request: PatientCreate,
    patient_service: PatientService = Depends(get_patient_service),
):
    """Create a new patient record."""
    return await patient_service.create_patient(request)


@router.get("/{patient_id}", response_model=PatientResponse)
async def get_patient(
    patient_id: int,
    patient_service: PatientService = Depends(get_patient_service),
):
    """Get patient by ID."""
    try:
        return await patient_service.get_patient_by_id(patient_id)
    except PatientNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/user/{user_id}", response_model=list[PatientResponse])
async def get_patients_by_user(
    user_id: int,
    patient_service: PatientService = Depends(get_patient_service),
):
    """Get all patients for a user."""
    return await patient_service.get_patients_by_user_id(user_id)


@router.delete("/{patient_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_patient(
    patient_id: int,
    patient_service: PatientService = Depends(get_patient_service),
):
    """Delete a patient."""
    try:
        await patient_service.delete_patient(patient_id)
    except PatientNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/biodata", response_model=PatientBiodataResponse, status_code=status.HTTP_201_CREATED)
async def create_biodata(
    request: PatientBiodataCreate,
    patient_service: PatientService = Depends(get_patient_service),
):
    """Create patient biodata."""
    try:
        return await patient_service.create_or_update_biodata(request)
    except PatientBiodataAlreadyExistsError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/biodata/{patient_id}", response_model=PatientBiodataResponse)
async def get_biodata(
    patient_id: int,
    patient_service: PatientService = Depends(get_patient_service),
):
    """Get patient biodata."""
    try:
        return await patient_service.get_biodata_by_patient_id(patient_id)
    except PatientBiodataNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.put("/biodata/{patient_id}", response_model=PatientBiodataResponse)
async def update_biodata(
    patient_id: int,
    request: PatientBiodataUpdate,
    patient_service: PatientService = Depends(get_patient_service),
):
    """Update patient biodata."""
    try:
        return await patient_service.update_biodata(patient_id, request)
    except PatientBiodataNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/record-planner", response_model=PatientRecordPlannerResponse, status_code=status.HTTP_201_CREATED)
async def create_record_planner(
    request: PatientRecordPlannerCreate,
    patient_service: PatientService = Depends(get_patient_service),
):
    """Create a patient record planner entry."""
    return await patient_service.create_record_planner(request)


@router.get("/record-planner/{patient_id}", response_model=list[PatientRecordPlannerResponse])
async def get_record_planners(
    patient_id: int,
    patient_service: PatientService = Depends(get_patient_service),
):
    """Get all record planners for a patient."""
    return await patient_service.get_record_planners_by_patient_id(patient_id)


@router.put("/record-planner/{planner_id}", response_model=PatientRecordPlannerResponse)
async def update_record_planner(
    planner_id: int,
    request: PatientRecordPlannerUpdate,
    patient_service: PatientService = Depends(get_patient_service),
):
    """Update a record planner."""
    try:
        return await patient_service.update_record_planner(planner_id, request)
    except RecordPlannerNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.delete("/record-planner/{planner_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_record_planner(
    planner_id: int,
    patient_service: PatientService = Depends(get_patient_service),
):
    """Delete a record planner."""
    try:
        await patient_service.delete_record_planner(planner_id)
    except RecordPlannerNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/intraoral-pictures", response_model=IntraoralPictureResponse, status_code=status.HTTP_201_CREATED)
async def create_intraoral_picture(
    request: IntraoralPictureCreate,
    patient_service: PatientService = Depends(get_patient_service),
):
    """Add an intraoral picture."""
    return await patient_service.create_intraoral_picture(request)


@router.get("/intraoral-pictures/{patient_id}", response_model=list[IntraoralPictureResponse])
async def get_intraoral_pictures(
    patient_id: int,
    patient_service: PatientService = Depends(get_patient_service),
):
    """Get all intraoral pictures for a patient."""
    return await patient_service.get_intraoral_pictures_by_patient_id(patient_id)


@router.delete("/intraoral-pictures/{picture_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_intraoral_picture(
    picture_id: int,
    patient_service: PatientService = Depends(get_patient_service),
):
    """Delete an intraoral picture."""
    try:
        await patient_service.delete_intraoral_picture(picture_id)
    except IntraoralPictureNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/xrays", response_model=XRayResponse, status_code=status.HTTP_201_CREATED)
async def create_xray(
    request: XRayCreate,
    patient_service: PatientService = Depends(get_patient_service),
):
    """Add an X-ray."""
    return await patient_service.create_xray(request)


@router.get("/xrays/{patient_id}", response_model=list[XRayResponse])
async def get_xrays(
    patient_id: int,
    patient_service: PatientService = Depends(get_patient_service),
):
    """Get all X-rays for a patient."""
    return await patient_service.get_xrays_by_patient_id(patient_id)


@router.delete("/xrays/{xray_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_xray(
    xray_id: int,
    patient_service: PatientService = Depends(get_patient_service),
):
    """Delete an X-ray."""
    try:
        await patient_service.delete_xray(xray_id)
    except XRayNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/visits", response_model=VisitResponse, status_code=status.HTTP_201_CREATED)
async def create_visit(
    request: VisitCreate,
    patient_service: PatientService = Depends(get_patient_service),
):
    """Create a visit record."""
    return await patient_service.create_visit(request)


@router.get("/visits/{patient_id}", response_model=list[VisitResponse])
async def get_visits(
    patient_id: int,
    patient_service: PatientService = Depends(get_patient_service),
):
    """Get all visits for a patient."""
    return await patient_service.get_visits_by_patient_id(patient_id)


@router.get("/visits/detail/{visit_id}", response_model=VisitResponse)
async def get_visit(
    visit_id: int,
    patient_service: PatientService = Depends(get_patient_service),
):
    """Get a specific visit by ID."""
    try:
        return await patient_service.get_visit_by_id(visit_id)
    except VisitNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.put("/visits/{visit_id}", response_model=VisitResponse)
async def update_visit(
    visit_id: int,
    request: VisitUpdate,
    patient_service: PatientService = Depends(get_patient_service),
):
    """Update a visit record."""
    try:
        return await patient_service.update_visit(visit_id, request)
    except VisitNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.delete("/visits/{visit_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_visit(
    visit_id: int,
    patient_service: PatientService = Depends(get_patient_service),
):
    """Delete a visit record."""
    try:
        await patient_service.delete_visit(visit_id)
    except VisitNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
