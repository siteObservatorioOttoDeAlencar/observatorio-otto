import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Carrega api_python/.env no desenvolvimento local (na Vercel as variáveis já vêm do projeto).
load_dotenv()

from router import router  # noqa: E402  (precisa vir depois do load_dotenv)


def _origens_permitidas() -> list[str]:
    """Lê ALLOWED_ORIGINS (lista separada por vírgulas). Vazia = nenhuma origem liberada."""
    bruto = os.getenv("ALLOWED_ORIGINS", "")
    return [o.strip().rstrip("/") for o in bruto.split(",") if o.strip()]


app = FastAPI(
    title="Observatório Otto de Alencar — API própria",
    description="Lógica específica que não cabe no modelo de conteúdo do CMS (Payload).",
    version="0.2.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=_origens_permitidas(),
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
