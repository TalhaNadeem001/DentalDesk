from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from src.database import engine, init_db
from src.auth.router import router as auth_router
from src.patients.router import router as patients_router
from src.reminders.router import router as reminders_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield
    await engine.dispose()

app = FastAPI(lifespan=lifespan)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Vite default port and common React port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all the routes
app.include_router(auth_router)
app.include_router(patients_router)
app.include_router(reminders_router)