from fastapi import APIRouter, Depends, HTTPException, Response
from src.auth.schema import SignUpRequest, LoginRequest, LoginResponse, UserResponse, MessageResponse
from src.auth.service import AuthService
from src.auth.dependencies import get_auth_service, get_current_user, get_current_session_id
from src.auth.exceptions import (
    EmailAlreadyExistsError,
    InvalidCredentialsError,
    UserNotFoundError,
)
from src.config import settings

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=UserResponse, status_code=201)
async def sign_up(
    request: SignUpRequest,
    auth_service: AuthService = Depends(get_auth_service),
):
    """Create a new user account."""
    try:
        return await auth_service.sign_up(request)
    except EmailAlreadyExistsError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login", response_model=LoginResponse)
async def login(
    request: LoginRequest,
    response: Response,
    auth_service: AuthService = Depends(get_auth_service),
):
    """Login and create a session."""
    try:
        user, session_id = await auth_service.login(request.email, request.password)
        response.set_cookie(
            key="session_id",
            value=session_id,
            httponly=True,
            secure=settings.ENVIRONMENT == "production",
            samesite="lax",
            max_age=86400,
        )
        return LoginResponse(user=user, session_id=session_id)
    except InvalidCredentialsError as e:
        raise HTTPException(status_code=401, detail=str(e))


@router.post("/logout", response_model=MessageResponse)
async def logout(
    response: Response,
    session_id: str = Depends(get_current_session_id),
    auth_service: AuthService = Depends(get_auth_service),
):
    """Logout and invalidate session."""
    try:
        await auth_service.logout(session_id)
        response.delete_cookie(key="session_id")
        return MessageResponse(message="Logged out successfully")
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: UserResponse = Depends(get_current_user),
):
    """Get current user information."""
    return current_user


@router.delete("/delete", response_model=MessageResponse)
async def delete_account(
    current_user: UserResponse = Depends(get_current_user),
    auth_service: AuthService = Depends(get_auth_service),
):
    """Delete the current user's account."""
    try:
        await auth_service.delete_user(current_user.id)
        return MessageResponse(message="Account deleted successfully")
    except UserNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
