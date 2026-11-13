# Implementação do backend — Observatório Otto de Alencar

**Data de corte:** 31/10/2026  
**Escopo:** API própria (FastAPI), PostgreSQL e CMS/API Strapi. O frontend não faz parte deste documento.

Este documento descreve o código presente no backend nesta data e registra marcos identificáveis no histórico do Git. Quando um recurso aparece em um commit antigo, mas não existe na árvore atual, isso é indicado para não confundir histórico com funcionalidade disponível hoje.

## Visão geral

O backend é composto por três serviços definidos em `docker-compose.yml`:

| Serviço | Tecnologia | Responsabilidade |
| --- | --- | --- |
| `api-python` | Python 3.12, FastAPI e Uvicorn | Endpoints próprios, cálculo astronômico, validação de JWT e acesso auxiliar ao banco |
| `strapi` | Node.js 20 e Strapi | CMS, painel administrativo e API de conteúdo |
| `postgres` | PostgreSQL 16 | Persistência do CMS e fonte de dados para consultas auxiliares da API própria |

O Compose aguarda a verificação de saúde do PostgreSQL antes de iniciar os serviços que dependem dele. As portas publicadas são `8000` (FastAPI), `1337` (Strapi) e `5432` (PostgreSQL). Os dados do banco e os uploads têm volumes Docker próprios.

## API própria (FastAPI)

### Endpoints presentes no código atual

- **`GET /health`** — retorna `{"status": "ok"}` para verificação básica do serviço.
- **`GET /observar-hoje`** — chama o serviço astronômico local. O cálculo usa Skyfield e as efemérides JPL DE421 para os planetas Mercúrio, Vênus, Marte, Júpiter e Saturno, observados a partir das coordenadas de Fortaleza. Latitude e longitude podem ser configuradas pelas variáveis `OBSERVATORIO_LAT` e `OBSERVATORIO_LON`.
- **`POST /registros-observacao`** — exige autenticação JWT do Strapi. No estado atual é somente um esqueleto: devolve uma mensagem de implementação pendente e o identificador do usuário; não cria nem persiste registros.

O retorno de `/observar-hoje` inclui os planetas acima do horizonte, altitude e azimute, direção cardeal, indicação de visibilidade a olho nu, dificuldade e equipamento recomendado, destaque do planeta mais alto, fase lunar, horário recomendado, resumo das condições e coordenadas do observatório. O arquivo DE421 é carregado sob demanda e reutilizado em memória. O serviço também contém uma resposta degradada para falhas de cálculo.

### Autenticação

`auth.py` valida tokens Bearer JWT assinados com HS256 e com o segredo compartilhado `STRAPI_JWT_SECRET`. A API própria não implementa login ou emissão de tokens: confia nos tokens do Strapi. A dependência de autenticação é usada atualmente apenas pelo endpoint-esqueleto de registros.

### Acesso ao PostgreSQL

`database.py` configura uma conexão SQLAlchemy usando `DATABASE_URL` e fornece uma dependência para abrir e encerrar sessões por requisição. `inicio_service.py` contém consultas parametrizadas para buscar o conteúdo publicado da página inicial na tabela `inicios` e suas mídias relacionadas nas tabelas de arquivos do Strapi.

**Limite do estado atual:** o roteador presente hoje não importa nem registra `get_db` ou `obter_pagina_inicial`; portanto, essas consultas existem como serviço de acesso a dados, mas não há atualmente uma rota FastAPI para a página inicial. Também não há implementação de gravação de registros de observação.

### Configuração operacional

- CORS está habilitado para todas as origens, métodos e cabeçalhos. O próprio código marca a restrição ao domínio de produção como pendente.
- Dependências principais estão fixadas em `requirements.txt`: FastAPI, Uvicorn, SQLAlchemy, psycopg2, Skyfield, python-jose e python-dotenv.
- A imagem da API usa `python:3.12-slim` e inicia o Uvicorn na porta `8000`.

## Strapi

### CMS e API de conteúdo

O tipo de conteúdo que existe na árvore atual é **Início**, um single type com:

- `titulo` (texto);
- `texto_apresentacao` (blocos de conteúdo);
- `imagem_destaque` (múltiplos arquivos de mídia).

O tipo permite rascunhos e publicação. Controller, router e service usam as factories padrão do Strapi, que fornecem o comportamento CRUD da API de conteúdo conforme as permissões configuradas no CMS.

### Banco de dados e mídia

- O Strapi usa PostgreSQL, configurado pelo ambiente (`DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_NAME`, `DATABASE_USERNAME` e `DATABASE_PASSWORD`) e pelo schema `strapi`.
- A configuração do plugin de upload utiliza Cloudinary, com credenciais fornecidas pelas variáveis `CLOUDINARY_NAME`, `CLOUDINARY_KEY` e `CLOUDINARY_SECRET`; os uploads são organizados na pasta `observatorio-otto_imgs`.
- O Compose também mantém um volume para `public/uploads`.
- A pasta de migrations está presente, mas contém apenas um `.gitkeep`; não há scripts de migração próprios versionados.

### Painel administrativo

O painel está configurado em português brasileiro, com a identidade “Observatório Otto de Alencar — Painel de Conteúdo”. A logo e o favicon do Strapi foram substituídos pela identidade visual da UECE.

## PostgreSQL e persistência

O serviço `postgres` usa a imagem `postgres:16-alpine`. Nome do banco, usuário e senha são configuráveis por variáveis de ambiente. O volume `postgres_data` preserva os dados entre reinicializações dos containers; a verificação de saúde usa `pg_isready`.

O Strapi é o responsável pelo modelo e pela persistência do conteúdo editorial. A API própria tem a conexão SQLAlchemy e consultas para leitura do conteúdo da página inicial, mas essa leitura não está conectada a uma rota na versão atual do roteador. Não há modelos SQLAlchemy próprios nem fluxo implementado de gravação de observações.

## Marcos registrados no histórico

As datas abaixo são as datas dos commits disponíveis no histórico local:

| Data | Marco |
| --- | --- |
| **24/09/2026** | Inclusão da infraestrutura Docker para PostgreSQL, API Python e Strapi, com configuração inicial por variáveis de ambiente. |
| **29/09/2026** | Conexão Strapi–PostgreSQL e persistência dos conteúdos criados no CMS. |
| **11/10/2026** | Reorganização do projeto em diretórios `frontend/` e `backend/`. |
| **18/10/2026** | Commit de melhorias no endpoint astronômico, conexão Python–PostgreSQL e leitura do conteúdo da página inicial do Strapi. O histórico dessa data também registra tipos de conteúdo para eventos e categorias de eventos. |
| **18/10/2026** | Personalização do painel do Strapi com logo e favicon da UECE. |
| **28/10/2026** | Atualização da documentação de execução e configuração do backend. |

### Diferenças entre o histórico e o código atual

- Em **18/10/2026**, o commit `e5fd0bb` incluía a rota `GET /pagina-inicial`, que consultava o conteúdo publicado e suas mídias. O serviço de consulta ainda existe, mas essa rota não está no roteador atual.
- O mesmo commit registrava os content-types `Evento` e `Categoria de evento`, com publicação, dados de evento e relação muitos-para-muitos entre eventos e categorias. Esses schemas não estão presentes na árvore atual do Strapi; portanto, não são listados como APIs disponíveis hoje.
- Embora a descrição do commit de 18/10 mencione a data da próxima fase lunar, o retorno do cálculo astronômico na árvore atual não contém essa data. O que está presente hoje é a fase lunar atual.

## Variáveis de ambiente e execução

O Compose recebe configurações de banco, segredos JWT do Strapi e credenciais do Cloudinary por variáveis de ambiente. O guia de instalação está em [`README.md`](./README.md). Endereços locais previstos:

| Componente | Endereço |
| --- | --- |
| FastAPI | `http://localhost:8000` |
| Documentação interativa da FastAPI | `http://localhost:8000/docs` |
| Strapi e API de conteúdo | `http://localhost:1337` |
| Painel administrativo Strapi | `http://localhost:1337/admin` |
| PostgreSQL | `localhost:5432` |

