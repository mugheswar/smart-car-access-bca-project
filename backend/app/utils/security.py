import os
import hashlib
import hmac
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
import jwt
from app.config import settings

def hash_password(password: str) -> str:
    """Secure password hashing using PBKDF2-HMAC-SHA256 (compatible with Python 3.13+)."""
    salt = os.urandom(16).hex()
    iterations = 100_000
    derived = hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        salt.encode('utf-8'),
        iterations
    ).hex()
    return f"pbkdf2:sha256:{iterations}${salt}${derived}"

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against stored PBKDF2 hash."""
    try:
        if not hashed_password or not hashed_password.startswith("pbkdf2:sha256:"):
            return False
        parts = hashed_password.split("$")
        if len(parts) != 3:
            return False
        header, salt, original_hash = parts
        iterations = int(header.split(":")[2])
        new_derived = hashlib.pbkdf2_hmac(
            'sha256',
            plain_password.encode('utf-8'),
            salt.encode('utf-8'),
            iterations
        ).hex()
        return hmac.compare_digest(original_hash, new_derived)
    except Exception:
        return False

def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """Create signed JWT access token."""
    to_encode = data.copy()
    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=settings.JWT_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "iat": now})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """Decode and validate JWT access token."""
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except jwt.PyJWTError:
        return None
