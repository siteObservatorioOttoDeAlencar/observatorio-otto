'''
ARQUIVO CONTROLLER / ROUTER (FastAPI)

Centraliza os endpoints da API própria do Observatório Otto de Alencar.
Organiza as rotas públicas (como efemérides astronômicas) e rotas protegidas
(que exigem login no CMS Payload e um perfil permitido).

O conteúdo editorial (início, eventos, notícias...) NÃO passa por aqui: o
frontend lê direto do CMS (/api/<coleção> e /api/globals/<global>).
'''
import logging
from datetime import datetime
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, Response

from astronomia import (  # Módulo de serviço astronômico local
    FUSO,
    MomentoForaDoLimite,
    o_que_observar_hoje,
    validar_momento,
)
from auth import exige_perfil

logger = logging.getLogger(__name__)

router = APIRouter()

# Resposta sem parâmetro de data: o CDN da Vercel guarda por 5 min (poupa a cota gratuita).
CACHE_AGORA = "public, s-maxage=300, stale-while-revalidate=60"

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
async def observar_hoje(
    response: Response,
    data_hora: Annotated[
        datetime | None,
        Query(
            description=(
                "Opcional. Data e hora (ISO 8601) para calcular em vez de agora, ex.: "
                "2026-12-05T21:00:00-03:00 (sem fuso = horário de Fortaleza; use %2B para '+' na URL). "
                "Aceita até 1 ano antes ou depois de hoje; fora disso, 422."
            ),
        ),
    ] = None,
):
    """
    Recurso interativo principal: 'O que observar no céu de Fortaleza hoje?'.

    Esta rota é pública e consumida diretamente:
    1. Pelo Cockpit dos 5 segundos na Home do Front-End.
    2. Pelo Radar Polar interativo na página '/ceu-hoje'.

    Retorna os planetas visíveis (só à noite, com o Sol abaixo de -6°) com direção e altura
    em linguagem humana, a fase da Lua (8 fases, % iluminada, próximas luas cheia e nova),
    nascer/pôr do Sol e da Lua no fuso de Fortaleza e um resumo das condições de observação.
    Durante o dia nenhum planeta é listado e a resposta traz a mensagem do pôr do Sol.
    """
    if data_hora is None:
        momento = datetime.now(FUSO)
    else:
        try:
            momento = validar_momento(data_hora)
        except MomentoForaDoLimite as erro:
            raise HTTPException(status_code=422, detail=str(erro))

    try:
        resultado = o_que_observar_hoje(momento)
    except Exception as erro:  # efemérides ausentes/corrompidas, etc.
        logger.exception("Falha no cálculo astronômico")
        raise HTTPException(status_code=503, detail="Falha no cálculo astronômico.") from erro

    if data_hora is None:
        response.headers["Cache-Control"] = CACHE_AGORA
    return resultado


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
