from src.exceptions import AppException


class AuthenticationError(AppException):
    """Authentication failed."""
    pass


class UserNotFoundError(AppException):
    """User not found."""
    pass


class InvalidCredentialsError(AppException):
    """Invalid email or password."""
    pass


class EmailAlreadyExistsError(AppException):
    """Email already registered."""
    pass


class SessionNotFoundError(AppException):
    """Session not found or expired."""
    pass
