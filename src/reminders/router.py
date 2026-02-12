from fastapi import APIRouter

router = APIRouter(prefix="/reminder", tags=["reminder"])


@router.get("/")
def list_items():
    """List items."""
    return {}
