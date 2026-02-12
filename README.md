# DentalDesk

A modern patient management system for dental practices with a FastAPI backend and React frontend.

## Quick Start

### Backend Setup

```bash
# Install dependencies
pip install -r requirements/base.txt

# Set environment variables (see .env.example if available)
export DATABASE_URL="postgresql+asyncpg://user:pass@localhost/dbname"
export REDIS_URL="redis://localhost:6379/0"
export ENVIRONMENT="development"

# Run the server
uvicorn src.main:app --reload
```

The backend will be available at `http://localhost:8000`

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Full Stack Development

1. Start the backend server (see Backend Setup above)
2. Start the frontend dev server (see Frontend Setup above)
3. Open `http://localhost:5173` in your browser
4. Sign up for a new account or login to access the dashboard

## Project Structure

```
DentalDesk/
├── alembic/              # Database migrations
├── frontend/             # React frontend application
│   ├── src/
│   │   ├── components/  # Reusable React components
│   │   ├── contexts/    # React contexts (Auth)
│   │   ├── pages/       # Page components
│   │   ├── services/    # API service layer
│   │   └── types/       # TypeScript types
│   └── package.json
├── src/                  # FastAPI backend
│   ├── auth/            # Authentication module
│   ├── patients/        # Patient management module
│   ├── reminders/       # Reminders module
│   ├── config.py        # Configuration
│   ├── database.py      # Database setup
│   └── main.py          # FastAPI app entry point
└── requirements/        # Python dependencies
```

## Features

### Backend (FastAPI)
- 🔐 Session-based authentication
- 👥 Patient management with CRUD operations
- 📋 Patient biodata management
- 📅 Visit tracking
- 📝 Record planner
- 🗄️ Async PostgreSQL with SQLAlchemy
- 🔄 Redis session storage
- 📊 OpenAPI/Swagger documentation

### Frontend (React)
- 🎨 Modern, responsive UI with Tailwind CSS
- 🔐 Authentication pages (Login/Signup)
- 📱 Patient dashboard with tabbed interface
- 📊 Overview with statistics
- 👤 Patient biodata display
- 📅 Visit history
- 📋 Record planner view

## Scripts

### `create_app.py` — Scaffold New App Modules

Creates a full module layout under `src/<app_name>/` with router, schemas, models, service, and tests.

```bash
python scripts/create_app.py users
```

This generates:

- `src/users/` with: `router.py`, `schema.py`, `models.py`, `dependencies.py`, `config.py`, `constants.py`, `exceptions.py`, `service.py`, `utils.py`
- `tests/users.py` with a basic TestClient test

Then wire the router in `src/main.py`:

```python
from src.users.router import router
app.include_router(router)
```

### `init_ai.py` — Initialize AI Module Structure

Sets up an AI-focused module structure under `src/ai/` for agents, RAG, and MCP integrations.

```bash
python scripts/init_ai.py
```

Creates:

- `src/ai/clients/`, `prompts/`, `schemas/`, `retrieval/`, `services/`, `tools/`, `tools/local/`, `tools/mcp/`
- `src/ai/policies.py`, `config.py`, `exceptions.py`

---

## Ruff

[Ruff](https://docs.astral.sh/ruff/) is included as the linter and formatter. It’s fast and replaces tools like Flake8, isort, and Black.

**Commands:**

```bash
ruff check .           # Lint
ruff check --fix .     # Lint and auto-fix
ruff format .          # Format code
```

**Alembic integration:** You can auto-lint new migrations by uncommenting the Ruff post-write hook in `alembic.ini`:

```ini
[post_write_hooks]
hooks = ruff
ruff.type = module
ruff.module = ruff
ruff.options = check --fix REVISION_SCRIPT_FILENAME
```

---

## Alembic

[Alembic](https://alembic.sqlalchemy.org/) is used for SQLAlchemy database migrations.

**Initial setup:**

1. Set `sqlalchemy.url` in `alembic.ini` or load it from your config (e.g. via `env.py` from `src.config`).
2. Point `target_metadata` in `alembic/env.py` at your models’ metadata so autogenerate can detect schema changes:

```python
from src.database import Base
target_metadata = Base.metadata
```

**Common commands:**

```bash
alembic revision --autogenerate -m "Add users table"  # Generate migration from models
alembic upgrade head                                 # Apply all migrations
alembic downgrade -1                                 # Roll back one revision
alembic current                                     # Show current revision
```

---

## Configuration

The app uses Pydantic Settings for configuration. Required env vars:

| Variable      | Description                    |
|---------------|--------------------------------|
| `DATABASE_URL`| PostgreSQL (e.g. `postgresql+asyncpg://...`) |
| `REDIS_URL`   | Redis connection string        |
| `ENVIRONMENT` | `development`, `staging`, or `production` (optional, defaults to `development`) |

---

## License

MIT
