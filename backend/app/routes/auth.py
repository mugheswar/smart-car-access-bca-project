from fastapi import APIRouter, HTTPException, status, Depends
from datetime import datetime, timezone
from app.database import db
from app.schemas.user import UserRegister, UserLogin, UserResponse, TokenResponse
from app.utils.security import hash_password, verify_password, create_access_token
from app.middleware.auth import get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse)
def register(user_in: UserRegister):
    if user_in.password != user_in.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match."
        )
    
    existing = db.users.find_one({"email": user_in.email.lower()})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists."
        )

    now_iso = datetime.now(timezone.utc).isoformat()
    user_doc = {
        "name": user_in.name.strip(),
        "email": user_in.email.lower().strip(),
        "phone": user_in.phone.strip(),
        "passwordHash": hash_password(user_in.password),
        "role": "user",
        "status": "active",
        "createdAt": now_iso
    }
    created_user = db.users.insert_one(user_doc)
    
    token = create_access_token(data={"sub": created_user["_id"], "email": created_user["email"], "role": created_user["role"]})
    user_resp = UserResponse(
        id=created_user["_id"],
        name=created_user["name"],
        email=created_user["email"],
        phone=created_user["phone"],
        role=created_user["role"],
        status=created_user["status"],
        createdAt=created_user["createdAt"]
    )
    return TokenResponse(access_token=token, user=user_resp)

@router.post("/login", response_model=TokenResponse)
def login(login_in: UserLogin):
    email = login_in.email.lower().strip()
    user = db.users.find_one({"email": email})
    
    if not user or not verify_password(login_in.password, user.get("passwordHash", "")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password credentials."
        )

    if user.get("status") == "disabled":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account has been deactivated. Please contact an Administrator."
        )

    token = create_access_token(data={"sub": user["_id"], "email": user["email"], "role": user["role"]})
    user_resp = UserResponse(
        id=user["_id"],
        name=user["name"],
        email=user["email"],
        phone=user["phone"],
        role=user["role"],
        status=user["status"],
        createdAt=user["createdAt"]
    )
    return TokenResponse(access_token=token, user=user_resp)

@router.get("/me", response_model=UserResponse)
def get_current_user_profile(current_user: dict = Depends(get_current_user)):
    return UserResponse(
        id=current_user["_id"],
        name=current_user["name"],
        email=current_user["email"],
        phone=current_user.get("phone", ""),
        role=current_user["role"],
        status=current_user["status"],
        createdAt=current_user["createdAt"]
    )
