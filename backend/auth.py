# auth.py
import os, requests
from jose import jwt
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.status import HTTP_401_UNAUTHORIZED

AUTH0_DOMAIN = os.getenv("AUTH0_DOMAIN")
API_AUDIENCE = os.getenv("AUTH0_AUDIENCE")
ALGORITHMS = ["RS256"]

class Auth0Bearer(HTTPBearer):
    def __init__(self, auto_error: bool = True):
        super().__init__(auto_error=auto_error)

    async def __call__(self, creds: HTTPAuthorizationCredentials = Depends(HTTPBearer())):
        if not creds or not creds.credentials:
            raise HTTPException(HTTP_401_UNAUTHORIZED, "Missing token")
        token = creds.credentials
        jwks = requests.get(f"https://{AUTH0_DOMAIN}/.well-known/jwks.json").json()
        unverified = jwt.get_unverified_header(token)
        rsa_key = next((k for k in jwks["keys"] if k["kid"] == unverified["kid"]), None)
        if not rsa_key:
            raise HTTPException(HTTP_401_UNAUTHORIZED, "Invalid key")
        try:
            payload = jwt.decode(
                token,
                rsa_key,
                algorithms=ALGORITHMS,
                audience=API_AUDIENCE,
                issuer=f"https://{AUTH0_DOMAIN}/"
            )
        except Exception as e:
            raise HTTPException(HTTP_401_UNAUTHORIZED, str(e))
        return payload
