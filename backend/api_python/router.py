'''
ARQUIVO CONTROLLER / ROUTER (FastAPI)

Centraliza os endpoints da API própria do Observatório Otto de Alencar.
Organiza as rotas públicas (como efemérides astronômicas) e rotas protegidas
(que exigem o token JWT de usuários logados via Strapi).
'''
from fastapi import APIRouter, Depends

from astronomia import o_que_observar_hoje  # Módulo de serviço astronômico local
from auth import usuario_autenticado

router = APIRouter()


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

