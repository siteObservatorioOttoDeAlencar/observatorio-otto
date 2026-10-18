"""Consultas do conteúdo da página inicial armazenado pelo Strapi."""

from fastapi import HTTPException, status
from sqlalchemy import text
from sqlalchemy.orm import Session

_PAGINA_INICIAL_QUERY = text(
    """
    SELECT id, titulo, texto_apresentacao
    FROM inicios
    WHERE published_at IS NOT NULL
    ORDER BY published_at DESC
    LIMIT 1
    """
)

_ARQUIVOS_QUERY = text(
    """
    SELECT
        files.id,
        files.name,
        files.alternative_text,
        files.caption,
        files.width,
        files.height,
        files.formats,
        files.hash,
        files.ext,
        files.mime,
        files.size,
        files.url,
        files.preview_url
    FROM files
    INNER JOIN files_related_morphs AS relation
        ON relation.file_id = files.id
    WHERE relation.related_id = :inicio_id
        AND relation.related_type = 'api::inicio.inicio'
        AND relation.field = 'imagem_destaque'
    ORDER BY relation."order", files.id
    """
)


def obter_pagina_inicial(db: Session) -> dict[str, object]:
    """Busca o conteúdo publicado e suas imagens relacionadas no Strapi."""
    pagina = db.execute(_PAGINA_INICIAL_QUERY).mappings().first()
    if pagina is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conteúdo publicado da página inicial não encontrado.",
        )

    arquivos = (
        db.execute(_ARQUIVOS_QUERY, {"inicio_id": pagina["id"]})
        .mappings()
        .all()
    )

    return {
        "id": pagina["id"],
        "titulo": pagina["titulo"],
        "texto_apresentacao": pagina["texto_apresentacao"],
        "imagem_destaque": [dict(arquivo) for arquivo in arquivos],
    }
