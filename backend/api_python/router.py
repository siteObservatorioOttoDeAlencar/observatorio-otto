'''
ARQUIVO CONTROLLER / ROUTER (FastAPI)

Centraliza os endpoints da API própria do Observatório Otto de Alencar.
Organiza as rotas públicas (como efemérides astronômicas) e rotas protegidas
(que exigem o token JWT de usuários logados via Strapi).
'''
import logging

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from astronomia import o_que_observar_hoje  # Módulo de serviço astronômico local
from auth import get_db, usuario_autenticado

logger = logging.getLogger(__name__)

router = APIRouter()

_EVENTOS_QUERY = text(
    """
    SELECT
        eventos.*,
        COALESCE(
            (
                SELECT array_agg(files.url ORDER BY relation."order", files.id)
                FROM files_related_morphs AS relation
                INNER JOIN files ON files.id = relation.file_id
                WHERE relation.related_id = eventos.id
                    AND relation.related_type = 'api::evento.evento'
                    AND relation.field = 'Imagem'
            ),
            ARRAY[]::text[]
        ) AS imagem_urls
    FROM eventos
    """
)


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
    usuario: dict = Depends(usuario_autenticado),
):
    """
    Exemplo de rota protegida.
    Exige o cabeçalho 'Authorization: Bearer <token_do_strapi>'.
    Se o token for válido, o parâmetro 'usuario' contém o ID e dados do autor.
    """
    return {"mensagem": "Endpoint a implementar", "usuario_id": usuario.get("id")}

@router.get("/eventos", dependencies=[Depends(usuario_autenticado)])
def listar_eventos(banco: Session = Depends(get_db)) -> list[dict[str, object]]:
    """
    Endpoint protegido para listar eventos astronômicos.
    Exige autenticação via token JWT.
    """
    try:
        eventos = banco.execute(_EVENTOS_QUERY).mappings().all()
        resposta = []
        for evento in eventos:
            registro = dict(evento)
            urls = registro.pop("imagem_urls") or []
            registro["imagem_url"] = urls[0] if urls else None
            registro["imagem_urls"] = urls
            resposta.append(registro)
        return resposta
    except SQLAlchemyError as exc:
        logger.exception("Falha ao consultar eventos no banco de dados")
        raise HTTPException(
            status_code=500,
            detail="Erro ao consultar eventos.",
        ) from exc
