"""
Testes da API: autenticação via CMS (401/403/200/502/503), CORS e rota pública.

O CMS é simulado com httpx.MockTransport: nenhum teste faz rede.
"""
import importlib

import httpx
import pytest
from fastapi.testclient import TestClient

import auth

URL_CMS = "http://cms.test"
ROTA = "/registros-observacao"
CABECALHO = {"Authorization": "JWT token-de-teste"}


@pytest.fixture(autouse=True)
def ambiente(monkeypatch):
    monkeypatch.setenv("CMS_URL", URL_CMS)
    monkeypatch.setenv("ALLOWED_ORIGINS", "http://site.test, https://www.site.test/")


def _cliente(monkeypatch, handler) -> TestClient:
    """Cria o app e troca o httpx.AsyncClient usado em auth.py por um com transporte falso."""
    # Os testes não podem depender de um api_python/.env local: sem isto o reload recarregaria o arquivo
    monkeypatch.setattr("dotenv.load_dotenv", lambda *args, **kwargs: False)

    import main

    importlib.reload(main)  # relê ALLOWED_ORIGINS

    original = httpx.AsyncClient

    def cliente_falso(*args, **kwargs):
        kwargs["transport"] = httpx.MockTransport(handler)
        return original(*args, **kwargs)

    monkeypatch.setattr(auth.httpx, "AsyncClient", cliente_falso)
    return TestClient(main.app)


def _cms_responde(usuario, status=200):
    def handler(request: httpx.Request) -> httpx.Response:
        assert request.url.path == "/api/users/me"
        assert request.headers["authorization"] == CABECALHO["Authorization"]
        return httpx.Response(status, json={"user": usuario})

    return handler


def test_sem_authorization_retorna_401(monkeypatch):
    def nao_deve_chamar(request):  # sem cabeçalho, nem chega ao CMS
        raise AssertionError("o CMS não deveria ser chamado")

    resposta = _cliente(monkeypatch, nao_deve_chamar).post(ROTA)
    assert resposta.status_code == 401


def test_cms_sem_usuario_retorna_401(monkeypatch):
    resposta = _cliente(monkeypatch, _cms_responde(None)).post(ROTA, headers=CABECALHO)
    assert resposta.status_code == 401


def test_cms_recusa_token_retorna_401(monkeypatch):
    resposta = _cliente(monkeypatch, _cms_responde(None, status=401)).post(
        ROTA, headers=CABECALHO
    )
    assert resposta.status_code == 401


def test_perfil_editor_retorna_403(monkeypatch):
    usuario = {"id": 7, "perfil": "editor"}
    resposta = _cliente(monkeypatch, _cms_responde(usuario)).post(ROTA, headers=CABECALHO)
    assert resposta.status_code == 403


def test_usuario_sem_perfil_retorna_403(monkeypatch):
    resposta = _cliente(monkeypatch, _cms_responde({"id": 7})).post(ROTA, headers=CABECALHO)
    assert resposta.status_code == 403


@pytest.mark.parametrize("perfil", ["observacao", "coordenador", "administrador"])
def test_perfis_permitidos_retornam_200(monkeypatch, perfil):
    usuario = {"id": 3, "perfil": perfil}
    resposta = _cliente(monkeypatch, _cms_responde(usuario)).post(ROTA, headers=CABECALHO)
    assert resposta.status_code == 200
    assert resposta.json()["perfil"] == perfil
    assert resposta.json()["usuario_id"] == 3


def test_cms_indisponivel_retorna_502(monkeypatch):
    def falha_de_rede(request):
        raise httpx.ConnectError("sem conexão")

    resposta = _cliente(monkeypatch, falha_de_rede).post(ROTA, headers=CABECALHO)
    assert resposta.status_code == 502


def test_cms_com_erro_500_retorna_502(monkeypatch):
    def erro(request):
        return httpx.Response(500, text="erro interno")

    resposta = _cliente(monkeypatch, erro).post(ROTA, headers=CABECALHO)
    assert resposta.status_code == 502


def test_cms_url_ausente_retorna_503(monkeypatch):
    monkeypatch.delenv("CMS_URL")
    resposta = _cliente(monkeypatch, _cms_responde({"perfil": "administrador"})).post(
        ROTA, headers=CABECALHO
    )
    assert resposta.status_code == 503


def test_cors_origem_permitida(monkeypatch):
    cliente = _cliente(monkeypatch, _cms_responde(None))
    resposta = cliente.options(
        "/observar-hoje",
        headers={"Origin": "http://site.test", "Access-Control-Request-Method": "GET"},
    )
    assert resposta.headers.get("access-control-allow-origin") == "http://site.test"


def test_cors_origem_com_barra_final_na_lista(monkeypatch):
    cliente = _cliente(monkeypatch, _cms_responde(None))
    resposta = cliente.options(
        "/observar-hoje",
        headers={"Origin": "https://www.site.test", "Access-Control-Request-Method": "GET"},
    )
    assert resposta.headers.get("access-control-allow-origin") == "https://www.site.test"


def test_cors_origem_nao_permitida(monkeypatch):
    cliente = _cliente(monkeypatch, _cms_responde(None))
    resposta = cliente.options(
        "/observar-hoje",
        headers={"Origin": "http://evil.test", "Access-Control-Request-Method": "GET"},
    )
    assert "access-control-allow-origin" not in resposta.headers


def test_cors_sem_variavel_nao_libera_ninguem(monkeypatch):
    monkeypatch.delenv("ALLOWED_ORIGINS")
    cliente = _cliente(monkeypatch, _cms_responde(None))
    resposta = cliente.options(
        "/observar-hoje",
        headers={"Origin": "http://site.test", "Access-Control-Request-Method": "GET"},
    )
    assert "access-control-allow-origin" not in resposta.headers


def test_observar_hoje_le_efemerides_de_data(monkeypatch):
    resposta = _cliente(monkeypatch, _cms_responde(None)).get("/observar-hoje")
    assert resposta.status_code == 200
    corpo = resposta.json()
    # "degraded" significaria que o de421.bsp não carregou de api_python/data/
    assert corpo["status"] == "ok"
    assert "fase_lua_nome" in corpo


def test_health(monkeypatch):
    resposta = _cliente(monkeypatch, _cms_responde(None)).get("/health")
    assert resposta.json() == {"status": "ok"}
