'''
ARQUIVO CONTROLER
'''
from fastapi import APIRouter, Depends

from astronomia import o_que_observar_hoje#arquivo de service
from auth import usuario_autenticado

router = APIRouter()


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
    usuario: dict = Depends(usuario_autenticado),
):
    """
    Exemplo de rota protegida por JWT emitido pelo Strapi.
    """
    return {"mensagem": "Endpoint a implementar", "usuario_id": usuario.get("id")}
