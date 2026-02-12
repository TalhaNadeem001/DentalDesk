# Code Formatting and Standards

## Clean Code Principles

### Organization and Structure
- **Use classes to group and organize related code**: Classes should encapsulate related functionality and data
- **Use classes and data structures wherever they make sense**: Prefer structured data over loose variables
- **Short functions**: Functions should be concise and focused on a single responsibility
- **Abstraction levels**: Each function should describe an abstraction; code inside the function should be one level down the abstraction
- **Vertical proximity**: Dependent functions should be vertically near each other in the file
- **Single Responsibility Principle**: Each function, class, and module should have one reason to change

### Naming Conventions
- **Descriptive names**: Names must describe exactly what's going on
- **Long names when necessary**: Use long names if they help explain the function's purpose
- **Avoid vague names**: Names must not be vague (avoid `data`, `info`, `stuff`, `thing`, `handle`, `process`)
- **Self-documenting code**: Use as few comments as possible. If you need a comment to describe functionality, the function names aren't good enough
- **Function arguments**: Function arguments must be as small as possible (prefer 3 or fewer parameters)

### Additional Clean Code Principles
- **DRY (Don't Repeat Yourself)**: Avoid code duplication; extract common functionality
- **KISS (Keep It Simple, Stupid)**: Prefer simple solutions over complex ones
- **YAGNI (You Aren't Gonna Need It)**: Don't add functionality until it's needed
- **Fail Fast**: Validate inputs early and fail with clear error messages
- **Error handling**: Handle errors explicitly; don't ignore exceptions
- **Immutable when possible**: Prefer immutable data structures to reduce bugs
- **Pure functions**: Prefer pure functions (no side effects) when possible
- **Avoid deep nesting**: Limit nesting levels (prefer early returns, guard clauses)
- **Consistent formatting**: Follow consistent code formatting throughout the project

## FastAPI-Specific Rules

### Router Files (`router.py`)
- **Always functional**: Code in `router.py` files must always be functional; never add classes
- **Thin controllers**: Routers should be thin - delegate business logic to services
- **Dependency injection**: Use FastAPI's dependency injection for shared logic
- **Route organization**: Group related routes together; use tags appropriately

### Pydantic Usage
- **Aggressively use Pydantic**: Use Pydantic models for all request/response validation
- **Schema separation**: Separate create, update, and response schemas
- **Field validation**: Use Pydantic validators for complex validation logic
- **Nested models**: Use nested Pydantic models for complex data structures
- **Response models**: Always specify response models in route decorators

### Additional FastAPI Best Practices
- **Type hints**: Use type hints everywhere (Python 3.10+ syntax: `str | None` instead of `Optional[str]`)
- **Async/await**: Use async functions for I/O operations (database, HTTP calls)
- **Status codes**: Use appropriate HTTP status codes
- **Error responses**: Use consistent error response formats
- **OpenAPI documentation**: Leverage FastAPI's automatic OpenAPI generation
- **Dependency organization**: Keep dependencies in `dependencies.py` files
- **Service layer**: Business logic belongs in service classes, not routers
- **Database models**: Use SQLModel for database models (combines SQLAlchemy + Pydantic)
- **Configuration**: Use Pydantic Settings for configuration management
- **Testing**: Write tests for all endpoints using TestClient

### Project Structure
- **Module organization**: Each app module should have: `router.py`, `schema.py`, `models.py`, `service.py`, `dependencies.py`, `exceptions.py`, `config.py`, `constants.py`, `utils.py`
- **Import organization**: Group imports: standard library, third-party, local imports
- **Circular dependencies**: Avoid circular dependencies between modules
