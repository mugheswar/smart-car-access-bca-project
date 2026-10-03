import os
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent

class Settings(BaseSettings):
    APP_NAME: str = "AI-Powered Smart Car Access and Keyless Assistance System"
    VERSION: str = "2.0.0 (BCA Final Year)"
    SIMULATION_MODE: bool = True
    SIMULATION_DISCLAIMER: str = "Simulation Mode — No real vehicle control"
    
    STORAGE_DIR: str = str((BASE_DIR / "data").resolve())
    DATABASE_NAME: str = "smart_car_access"
    
    JWT_SECRET: str = "super_secret_local_dev_key_smart_car_2026_bca"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 1440
    
    FRONTEND_URL: str = "http://localhost:5173"
    
    model_config = SettingsConfigDict(
        env_file=str(BASE_DIR / ".env"),
        extra="allow"
    )

settings = Settings()
