'''
ARQUIVO CONTROLLER / ROUTER (FastAPI)

Centraliza os endpoints da API própria do Observatório Otto de Alencar.
Organiza as rotas públicas (como efemérides astronômicas) e rotas protegidas
(que exigem login no CMS Payload e um perfil permitido).

O conteúdo editorial (início, eventos, notícias...) NÃO passa por aqui: o
frontend lê direto do CMS (/api/<coleção> e /api/globals/<global>).
'''
from typing import Annotated

from fastapi import APIRouter, Depends

from astronomia import o_que_observar_hoje  # Módulo de serviço astronômico local
from auth import exige_perfil

router = APIRouter()

# Perfis (definidos no CMS) que podem registrar observações.
PERFIS_REGISTRO_OBSERVACAO = ("observacao", "coordenador", "administrador")


@router.get("/health")
async def health():
    """
    Endpoint simples de verificação de integridade ('health check').
    Usado pelo monitoramento e pelo Front-End para saber se a API está ativa.
    """
    return {"status": "ok"}


@router.get("/observar-hoje")
async def observar_hoje():
    """
    Recurso interativo principal: 'O que observar no céu de Fortaleza hoje?'.

    Esta rota é pública e consumida diretamente:
    1. Pelo Cockpit dos 5 segundos na Home do Front-End.
    2. Pelo Radar Polar interativo na página '/ceu-hoje'.

    Retorna os planetas visíveis com direções cardeais humanas,
    fase da lua calculada e resumo de condições de observação.
    """
    return o_que_observar_hoje()


@router.post("/registros-observacao")
async def criar_registro_observacao(
    usuario: Annotated[dict, Depends(exige_perfil(*PERFIS_REGISTRO_OBSERVACAO))],
):
    """
    Rota protegida: exige login no CMS (o cabeçalho Authorization é repassado
    ao Payload) e perfil observacao, coordenador ou administrador.
    Sem login → 401; perfil não permitido → 403.
    """
    return {
        "mensagem": "Endpoint a implementar",
        "usuario_id": usuario.get("id"),
        "perfil": usuario.get("perfil"),
    }
