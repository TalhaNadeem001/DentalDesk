from enum import Enum

SESSION_TTL_SECONDS = 86400


class UserRole(str, Enum):
    ADMIN = "admin"
    USER = "user"
    DENTIST = "dentist"
    RECEPTIONIST = "receptionist"
