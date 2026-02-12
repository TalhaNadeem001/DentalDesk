from src.exceptions import AppException


class PatientNotFoundError(AppException):
    """Patient not found."""
    pass


class PatientBiodataNotFoundError(AppException):
    """Patient biodata not found."""
    pass


class PatientBiodataAlreadyExistsError(AppException):
    """Patient biodata already exists for this patient."""
    pass


class RecordPlannerNotFoundError(AppException):
    """Record planner not found."""
    pass


class IntraoralPictureNotFoundError(AppException):
    """Intraoral picture not found."""
    pass


class XRayNotFoundError(AppException):
    """X-ray not found."""
    pass


class VisitNotFoundError(AppException):
    """Visit not found."""
    pass
