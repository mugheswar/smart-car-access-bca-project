from fastapi import APIRouter, HTTPException, status, Depends
from datetime import datetime, timezone
from typing import List, Optional
from app.database import db
from app.schemas.vehicle import VehicleCreate, VehicleUpdate, VehicleResponse
from app.middleware.auth import get_current_user

router = APIRouter(prefix="/api/vehicles", tags=["Vehicles"])

def format_vehicle(doc: dict) -> VehicleResponse:
    return VehicleResponse(
        id=doc["_id"],
        ownerId=doc.get("ownerId", ""),
        registrationNumber=doc.get("registrationNumber", ""),
        brand=doc.get("brand", ""),
        model=doc.get("model", ""),
        type=doc.get("type", "SUV"),
        year=int(doc.get("year", 2025)),
        color=doc.get("color", "White"),
        status=doc.get("status", "locked"),
        createdAt=doc.get("createdAt", datetime.now(timezone.utc).isoformat()),
        securityScore=int(doc.get("securityScore", 92)),
        lastAccess=doc.get("lastAccess")
    )

@router.get("", response_model=List[VehicleResponse])
def get_vehicles(current_user: dict = Depends(get_current_user)):
    # If admin, return all vehicles or user's vehicles; if user, return their vehicles
    if current_user.get("role") == "admin":
        docs = db.vehicles.find()
    else:
        docs = db.vehicles.find({"ownerId": current_user["_id"]})
    return [format_vehicle(d) for d in docs]

@router.post("", response_model=VehicleResponse, status_code=status.HTTP_201_CREATED)
def create_vehicle(vehicle_in: VehicleCreate, current_user: dict = Depends(get_current_user)):
    reg_clean = vehicle_in.registrationNumber.strip().upper()
    
    existing = db.vehicles.find_one({"registrationNumber": reg_clean})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Vehicle with registration number {reg_clean} already registered."
        )

    now_iso = datetime.now(timezone.utc).isoformat()
    new_doc = {
        "ownerId": current_user["_id"],
        "registrationNumber": reg_clean,
        "brand": vehicle_in.brand.strip(),
        "model": vehicle_in.model.strip(),
        "type": vehicle_in.type.strip(),
        "year": vehicle_in.year,
        "color": vehicle_in.color.strip(),
        "status": "locked",
        "createdAt": now_iso,
        "securityScore": 92,
        "lastAccess": None
    }
    created = db.vehicles.insert_one(new_doc)
    return format_vehicle(created)

@router.get("/{vehicle_id}", response_model=VehicleResponse)
def get_vehicle_by_id(vehicle_id: str, current_user: dict = Depends(get_current_user)):
    vehicle = db.vehicles.find_one({"_id": vehicle_id})
    if not vehicle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found.")
    return format_vehicle(vehicle)

@router.put("/{vehicle_id}", response_model=VehicleResponse)
def update_vehicle(vehicle_id: str, vehicle_in: VehicleUpdate, current_user: dict = Depends(get_current_user)):
    vehicle = db.vehicles.find_one({"_id": vehicle_id})
    if not vehicle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found.")
    
    if current_user.get("role") != "admin" and vehicle.get("ownerId") != current_user["_id"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to modify this vehicle.")

    update_fields = {}
    for k, v in vehicle_in.model_dump(exclude_unset=True).items():
        if v is not None:
            if k == "registrationNumber":
                v = v.strip().upper()
            update_fields[k] = v

    if update_fields:
        db.vehicles.update_one({"_id": vehicle_id}, update_fields)
        vehicle.update(update_fields)

    return format_vehicle(vehicle)

@router.delete("/{vehicle_id}")
def delete_vehicle(vehicle_id: str, current_user: dict = Depends(get_current_user)):
    vehicle = db.vehicles.find_one({"_id": vehicle_id})
    if not vehicle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found.")
    
    if current_user.get("role") != "admin" and vehicle.get("ownerId") != current_user["_id"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to delete this vehicle.")

    db.vehicles.delete_one({"_id": vehicle_id})
    return {"message": "Vehicle removed successfully."}
