from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from router import router

app = FastAPI(
    title="Observatório Otto de Alencar — API própria",
    description="Lógica específica que não cabe no modelo de conteúdo do Strapi.",
    version="0.1.0",
)

# Ajustar origins conforme o domínio real do frontend em produção
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: restringir ao domínio do frontend em produção
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)