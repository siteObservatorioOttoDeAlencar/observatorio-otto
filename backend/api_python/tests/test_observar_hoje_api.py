"""Rota GET /observar-hoje: parâmetro data_hora (US035), cache e tratamento de falha."""
from datetime import datetime, timedelta
from urllib.parse import quote

import pytest
from fastapi.testclient import TestClient

import astronomia
import main
import router as modulo_router


@pytest.fixture
def cliente():
    return TestClient(main.app)


def _iso(dt: datetime) -> str:
    # quote: o '+' de "+00:00" precisa ir codificado na URL
    return quote(dt.isoformat(timespec="seconds"), safe="")


def test_sem_parametro_usa_agora_e_define_cache(cliente):
    r = cliente.get("/observar-hoje")
    assert r.status_code == 200
    assert "s-maxage=300" in r.headers["cache-control"]
    assert r.json()["fuso"] == "America/Fortaleza"
    assert r.json()["calculado_em"].endswith("-03:00")


def test_com_parametro_nao_usa_o_cache_de_5_minutos(cliente):
    alvo = datetime.now(astronomia.FUSO) + timedelta(days=10)
    r = cliente.get(f"/observar-hoje?data_hora={_iso(alvo)}")
    assert r.status_code == 200
    assert "s-maxage=300" not in r.headers.get("cache-control", "")


def test_data_hora_calcula_no_momento_pedido(cliente):
    alvo = (datetime.now(astronomia.FUSO) + timedelta(days=30)).replace(hour=21, minute=0, second=0, microsecond=0)
    r = cliente.get(f"/observar-hoje?data_hora={_iso(alvo)}")
    assert r.status_code == 200
    assert r.json()["calculado_em"] == alvo.isoformat(timespec="seconds")


def test_data_hora_sem_fuso_vale_horario_de_fortaleza(cliente):
    alvo = datetime.now(astronomia.FUSO) + timedelta(days=5)
    ingenuo = alvo.replace(hour=12, minute=0, second=0, microsecond=0, tzinfo=None)
    r = cliente.get(f"/observar-hoje?data_hora={ingenuo.isoformat()}")
    assert r.status_code == 200
    assert r.json()["calculado_em"].endswith("12:00:00-03:00")
    assert r.json()["periodo"] == "dia"


@pytest.mark.parametrize("dias", [-364, -1, 0, 1, 364])
def test_data_dentro_do_limite_retorna_200(cliente, dias):
    alvo = datetime.now(astronomia.FUSO) + timedelta(days=dias)
    assert cliente.get(f"/observar-hoje?data_hora={_iso(alvo)}").status_code == 200


@pytest.mark.parametrize("dias", [-400, -367, 367, 400, 3650])
def test_data_fora_do_limite_retorna_422(cliente, dias):
    alvo = datetime.now(astronomia.FUSO) + timedelta(days=dias)
    r = cliente.get(f"/observar-hoje?data_hora={_iso(alvo)}")
    assert r.status_code == 422
    assert "1 ano" in r.json()["detail"]


def test_data_invalida_retorna_422(cliente):
    assert cliente.get("/observar-hoje?data_hora=ontem").status_code == 422


def test_falha_no_calculo_retorna_503_sem_cache(cliente, monkeypatch):
    def quebra(momento=None):
        raise RuntimeError("efemérides indisponíveis")

    monkeypatch.setattr(modulo_router, "o_que_observar_hoje", quebra)
    r = cliente.get("/observar-hoje")
    assert r.status_code == 503
    assert "cache-control" not in r.headers
