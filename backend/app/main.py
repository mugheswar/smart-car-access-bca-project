from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
from app.config import settings
from app.database import db
from app.routes import auth, vehicles, access, ai, security, admin
from pathlib import Path
import os

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Auto-seed if database is empty on initial run
    if db.users.count_documents() == 0:
        try:
            from database.seed import seed_database
            seed_database(reset=False)
            print("[INFO] Auto-seeded initial demo database.")
        except Exception as e:
            print(f"[WARN] Auto-seed failed or seed module not found: {e}")
    yield

app = FastAPI(
    title=settings.APP_NAME,
    description="Local Software Simulation for BCA Final Year Project. Features AI-based identity verification and intelligent risk assessment.",
    version=settings.VERSION,
    lifespan=lifespan
)

# CORS configuration for local React Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount REST API Routers
app.include_router(auth.router)
app.include_router(vehicles.router)
app.include_router(access.router)
app.include_router(ai.router)
app.include_router(security.router)
app.include_router(admin.router)

# Health check & API metadata endpoints
@app.get("/api")
def api_root():
    return {
        "app": settings.APP_NAME,
        "version": settings.VERSION,
        "status": "online",
        "simulationDisclaimer": settings.SIMULATION_DISCLAIMER,
        "docs": "/docs",
        "mode": "100% Local Simulation (No real vehicle control)"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "simulation": True,
        "localDatabase": "connected",
        "activeUsers": db.users.count_documents(),
        "registeredVehicles": db.vehicles.count_documents(),
        "totalAccessLogs": db.access_logs.count_documents(),
        "disclaimer": settings.SIMULATION_DISCLAIMER
    }

# Frontend Static Files & SPA Fallback Hosting
frontend_dist = Path(__file__).resolve().parent.parent.parent / "frontend" / "dist"

if (frontend_dist / "assets").exists():
    app.mount("/assets", StaticFiles(directory=str(frontend_dist / "assets")), name="assets")

@app.get("/")
def serve_root(request: Request):
    accept_header = request.headers.get("accept", "")
    index_file = frontend_dist / "index.html"
    
    # If a browser requests HTML, serve the React single page application
    if "text/html" in accept_header and index_file.is_file():
        return FileResponse(index_file)
    
    # Otherwise (API client, curl, test runner), return the API metadata & simulation disclaimer
    return {
        "app": settings.APP_NAME,
        "version": settings.VERSION,
        "status": "online",
        "simulationDisclaimer": settings.SIMULATION_DISCLAIMER,
        "docs": "/docs",
        "mode": "100% Local Simulation (No real vehicle control)"
    }

@app.get("/{full_path:path}")
def serve_spa_or_static(full_path: str):
    # Do not intercept API routes, OpenAPI schemas, or Swagger docs
    if full_path.startswith("api") or full_path.startswith("docs") or full_path == "openapi.json":
        raise HTTPException(status_code=404, detail="API resource not found")

    # Check if a static file in dist matches (e.g. favicon, vite.svg)
    requested_file = frontend_dist / full_path
    if requested_file.is_file():
        return FileResponse(requested_file)

    # SPA Fallback: serve index.html for all React router routes
    index_file = frontend_dist / "index.html"
    if index_file.is_file():
        return FileResponse(index_file)

    return {
        "app": settings.APP_NAME,
        "status": "online",
        "disclaimer": settings.SIMULATION_DISCLAIMER,
        "docs": "/docs"
    }
