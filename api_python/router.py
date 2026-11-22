'''
ARQUIVO CONTROLER
'''
from typing import Annotated

from fastapi import APIRouter, Depends

from astronomia import o_que_observar_hoje  # arquivo de service
from auth import exige_perfil

router = APIRouter()

# Perfis (definidos no CMS) que podem registrar observações.
PERFIS_REGISTRO_OBSERVACAO = ("observacao", "coordenador", "administrador")


@router.get("/health")
async def health():
    """Endpoint simples de verificação da API."""
    return {"status": "ok"}


@router.get("/observar-hoje")
async def observar_hoje():
    """
    Recurso interativo 'O que observar no céu?' — rota pública.
    """
    return o_que_observar_hoje()


@router.post("/registros-observacao")
async def criar_registro_observacao(
    usuario: Annotated[dict, Depends(exige_perfil(*PERFIS_REGISTRO_OBSERVACAO))],
):
    """
    Rota protegida: exige login no CMS (Authorization repassado ao Payload)
    e perfil observacao, coordenador ou administrador.
    """
    return {
        "mensagem": "Endpoint a implementar",
        "usuario_id": usuario.get("id"),
        "perfil": usuario.get("perfil"),
    }
