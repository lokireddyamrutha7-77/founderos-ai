from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from database.db import Base, engine
import database.base  # noqa: F401 - registers User and Memory models on Base
from api.auth import router as auth_router
from api.memory import router as memory_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Altora API",
    version="1.0.0"
)

# Allow the frontend dev server to call this backend during development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(memory_router)


# These three handlers make sure EVERY error response - not just the ones we
# write ourselves - follows the team-wide contract: {success, data, error}.
# Without this, invalid input (e.g. importance=99) or an auth failure would
# return FastAPI's default error shape instead, which breaks the frontend's
# unwrap() logic.
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    first_error = exc.errors()[0]
    field = ".".join(str(loc) for loc in first_error["loc"] if loc != "body")
    message = f"{field}: {first_error['msg']}" if field else first_error["msg"]
    return JSONResponse(
        status_code=422,
        content={"success": False, "data": None, "error": message},
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"success": False, "data": None, "error": exc.detail},
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"success": False, "data": None, "error": "Something went wrong. Please try again."},
    )


@app.get("/")
def root():
    return {
        "success": True,
        "data": {
            "message": "Altora Backend Running"
        },
        "error": None
    }