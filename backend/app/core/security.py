import re
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)

def hash_security_key(security_key: str) -> str:
    """Hash a security key using bcrypt (same as password)"""
    return pwd_context.hash(security_key)

def verify_security_key(plain_security_key: str, hashed_security_key: str) -> bool:
    """Verify a security key against its hash"""
    return pwd_context.verify(plain_security_key, hashed_security_key)

def is_strong_password(password: str) -> bool:
    """Check if password meets strength requirements"""
    return bool(re.match(r'^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$', password))

def is_valid_security_key(security_key: str) -> bool:
    """Validate security key format (16 chars, alphanumeric)"""
    return bool(security_key and len(security_key) == 16 and security_key.isalnum())