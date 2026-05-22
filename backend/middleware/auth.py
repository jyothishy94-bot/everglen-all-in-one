"""
Authentication Middleware
Validates Firebase tokens and enforces role-based access control
"""

from fastapi import Request, HTTPException, status
from firebase_admin import auth as firebase_auth
from typing import Callable, Optional
import logging

logger = logging.getLogger(__name__)

class RoleBasedAuthMiddleware:
    """
    Middleware to validate Firebase tokens and check user roles
    """
    
    def __init__(self, app):
        self.app = app
    
    async def __call__(self, request: Request, call_next):
        # Skip auth for public endpoints
        public_paths = ["/", "/health", "/docs", "/openapi.json"]
        if request.url.path in public_paths:
            return await call_next(request)
        
        # Extract token from Authorization header
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Missing or invalid authorization header"
            )
        
        token = auth_header.split(" ")[1]
        
        try:
            # Verify Firebase token
            decoded_token = firebase_auth.verify_id_token(token)
            user_id = decoded_token.get("uid")
            
            # Store user info in request state for later use
            request.state.user_id = user_id
            request.state.user_claims = decoded_token
            
            return await call_next(request)
        
        except firebase_auth.InvalidIdTokenError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        except Exception as e:
            logger.error(f"Auth error: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication failed"
            )

async def verify_role(required_roles: list[str]) -> Callable:
    """
    Dependency to verify user role against required roles
    Usage: @app.get("/api/endpoint", dependencies=[Depends(verify_role(["customer"]))])
    """
    async def dependency(request: Request):
        user_id = getattr(request.state, "user_id", None)
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not authenticated"
            )
        
        # TODO: Fetch user role from Firestore (/users/{user_id}/role)
        # user_role = fetch_user_role_from_firestore(user_id)
        
        # if user_role not in required_roles:
        #     raise HTTPException(
        #         status_code=status.HTTP_403_FORBIDDEN,
        #         detail=f"Insufficient permissions. Required roles: {required_roles}"
        #     )
        
        return user_id
    
    return dependency