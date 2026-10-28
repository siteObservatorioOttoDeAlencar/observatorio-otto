"""
Valida o JWT emitido pelo Strapi. A API própria não tem sistema de login
próprio — ela confia no mesmo segredo (STRAPI_JWT_SECRET) usado pelo Strapi
para assinar os tokens.
"""
import os
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt

STRAPI_JWT_SECRET = os.getenv("STRAPI_JWT_SECRET", "troque_este_segredo")
ALGORITHM = "HS256"

bearer_scheme = HTTPBearer(auto_error=False)


async def usuario_autenticado(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> dict:
    """
    Dependency do FastAPI para proteger rotas que exigem login.
    Uso: @app.post("/algo", dependencies=[Depends(usuario_autenticado)])
    ou capturando o payload: user = Depends(usuario_autenticado)
    """
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token não fornecido",
        )
    try:
        payload = jwt.decode(
            credentials.credentials, STRAPI_JWT_SECRET, algorithms=[ALGORITHM]
        )
        return payload  # contém id do usuário no Strapi
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido ou expirado",
        )
