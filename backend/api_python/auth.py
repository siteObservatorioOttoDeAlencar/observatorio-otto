"""
Autenticação via Payload CMS.

A API própria não tem login nem segredo de JWT: ela repassa o cabeçalho
`Authorization` recebido para `GET {CMS_URL}/api/users/me`. Se o CMS devolver
um `user`, a requisição está autenticada e o perfil vem em `user.perfil`.

O frontend deve enviar o mesmo cabeçalho que usaria com o CMS
(no Payload, `Authorization: JWT <token>`).
"""
import os
from typing import Annotated

import httpx
from fastapi import Depends, Header, HTTPException, status

TIMEOUT_CMS_SEGUNDOS = 5.0


def _cms_url() -> str:
    url = os.getenv("CMS_URL", "").strip().rstrip("/")
    if not url:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Autenticação indisponível: CMS_URL não configurada.",
        )
    return url


async def usuario_autenticado(
    authorization: Annotated[str | None, Header()] = None,
) -> dict:
    """
    Dependência para rotas que exigem login. Devolve o usuário do CMS
    (com `id`, `email` e `perfil`). Sem usuário válido → 401.
    """
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Cabeçalho Authorization não fornecido.",
        )

    url = f"{_cms_url()}/api/users/me"
    try:
        async with httpx.AsyncClient(timeout=TIMEOUT_CMS_SEGUNDOS) as client:
            resposta = await client.get(url, headers={"Authorization": authorization})
    except httpx.HTTPError:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Não foi possível validar o login no CMS.",
        )

    if resposta.status_code >= 500:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="O CMS falhou ao validar o login.",
        )

    try:
        usuario = resposta.json().get("user") if resposta.status_code == 200 else None
    except ValueError:
        usuario = None

    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido ou expirado.",
        )
    return usuario


def exige_perfil(*perfis_permitidos: str):
    """
    Fábrica de dependência: exige login e um dos perfis informados.
    Usuário autenticado com outro perfil → 403.

    Uso: Depends(exige_perfil("coordenador", "administrador"))
    """

    async def dependencia(
        usuario: Annotated[dict, Depends(usuario_autenticado)],
    ) -> dict:
        if usuario.get("perfil") not in perfis_permitidos:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Seu perfil não tem permissão para esta ação.",
            )
        return usuario

    return dependencia
