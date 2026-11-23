"""
Testes das regras do "O que observar no céu": RN001–RN004, US034 e US035.

- Unitários: funções puras (fase, direção, altura, validação de data).
- Integração: o cálculo completo com Skyfield lendo api_python/data/de421.bsp.
- Fases reais: confere o cálculo contra eclipses catalogados pela NASA.
"""
import re
from datetime import datetime, timedelta, timezone

import pytest

from astronomia import (
    FUSO,
    MomentoForaDoLimite,
    descricao_altura,
    direcao_cardeal,
    fase_lua_em,
    nome_fase_lua,
    o_que_observar_hoje,
    validar_momento,
)


# --------------------------------------------------------------------------
# RN002 — fase da Lua (faixas de 45° centradas)
# --------------------------------------------------------------------------
@pytest.mark.parametrize(
    "graus, esperado",
    [
        (170, "Cheia"),
        (200, "Cheia"),
        (230, "Minguante gibosa"),
        (0, "Nova"),
        (359, "Nova"),
        (90, "Quarto crescente"),
        # um ponto no centro de cada uma das 8 faixas
        (45, "Crescente"),
        (135, "Crescente gibosa"),
        (180, "Cheia"),
        (225, "Minguante gibosa"),
        (270, "Quarto minguante"),
        (315, "Minguante"),
        # limites: cada faixa começa (inclusive) no valor inicial indicado na regra
        (22.5, "Crescente"),
        (67.5, "Quarto crescente"),
        (112.5, "Crescente gibosa"),
        (157.5, "Cheia"),
        (202.5, "Minguante gibosa"),
        (247.5, "Quarto minguante"),
        (292.5, "Minguante"),
        (337.5, "Nova"),
        (22.49, "Nova"),
        (360, "Nova"),
    ],
)
def test_nome_fase_lua(graus, esperado):
    assert nome_fase_lua(graus) == esperado


# --------------------------------------------------------------------------
# RN003 — direção (8 setores de 45° centrados)
# --------------------------------------------------------------------------
@pytest.mark.parametrize(
    "azimute, esperado",
    [
        (80, "Leste"),
        (350, "Norte"),
        (0, "Norte"),
        (45, "Nordeste"),
        (90, "Leste"),
        (135, "Sudeste"),
        (180, "Sul"),
        (225, "Sudoeste"),
        (270, "Oeste"),
        (315, "Noroeste"),
        (22.5, "Nordeste"),
        (337.5, "Norte"),
        (360, "Norte"),
    ],
)
def test_direcao_cardeal(azimute, esperado):
    assert direcao_cardeal(azimute) == esperado


# --------------------------------------------------------------------------
# RN004 — altura
# --------------------------------------------------------------------------
@pytest.mark.parametrize(
    "altitude, esperado",
    [
        (30, "a meia altura"),
        (10, "perto do horizonte"),
        (0.5, "perto do horizonte"),
        (14.9, "perto do horizonte"),
        (15, "a meia altura"),
        (44.9, "a meia altura"),
        (45, "alto no céu"),
        (75, "alto no céu"),
        (75.1, "quase acima da cabeça"),
        (89, "quase acima da cabeça"),
    ],
)
def test_descricao_altura(altitude, esperado):
    assert descricao_altura(altitude) == esperado


# --------------------------------------------------------------------------
# US035 — validação de data/hora
# --------------------------------------------------------------------------
def test_validar_momento_sem_fuso_vale_como_horario_de_fortaleza():
    agora = datetime(2026, 11, 23, 12, 0, tzinfo=FUSO)
    local = validar_momento(datetime(2026, 12, 1, 21, 0), agora)
    assert local.utcoffset() == timedelta(hours=-3)
    assert local.hour == 21


def test_validar_momento_converte_utc_para_fortaleza():
    agora = datetime(2026, 11, 23, 12, 0, tzinfo=FUSO)
    local = validar_momento(datetime(2026, 12, 1, 21, 0, tzinfo=timezone.utc), agora)
    assert local.hour == 18  # 21:00 UTC = 18:00 em Fortaleza


def test_validar_momento_limites_de_um_ano():
    agora = datetime(2026, 11, 23, 12, 0, tzinfo=FUSO)
    validar_momento(agora + timedelta(days=364), agora)
    validar_momento(agora - timedelta(days=364), agora)
    with pytest.raises(MomentoForaDoLimite):
        validar_momento(agora + timedelta(days=366), agora)
    with pytest.raises(MomentoForaDoLimite):
        validar_momento(agora - timedelta(days=366), agora)


# --------------------------------------------------------------------------
# RN001 + RN003 + RN004 + US034 — integração (Skyfield lendo data/de421.bsp)
# --------------------------------------------------------------------------
def test_meio_dia_nao_lista_planetas_e_traz_msg020():
    r = o_que_observar_hoje(datetime(2026, 11, 23, 12, 0, tzinfo=FUSO))
    assert r["status"] == "ok"
    assert r["periodo"] == "dia"
    assert r["planetas_visiveis_agora"] == []
    # MSG020 com a hora local do pôr do Sol
    assert r["mensagem"] == (
        f"Ainda é dia em Fortaleza. Os planetas começam a aparecer depois do pôr do Sol, às {r['sol']['por']}."
    )
    assert re.search(r"às \d\d:\d\d\.$", r["mensagem"])
    assert r["condicoes_gerais"]["mensagem"] == r["mensagem"]


def test_crepusculo_ainda_nao_lista_planetas():
    # 17h45: o Sol já se pôs (≈17h29) mas ainda está acima de -6° → RN001 não libera planetas
    r = o_que_observar_hoje(datetime(2026, 11, 23, 17, 45, tzinfo=FUSO))
    assert -6 < r["sol"]["altitude_graus"] < 0
    assert r["planetas_visiveis_agora"] == []
    assert r["periodo"] == "dia"


def test_noite_lista_planetas_com_direcao_e_altura():
    r = o_que_observar_hoje(datetime(2026, 11, 23, 21, 0, tzinfo=FUSO))
    assert r["periodo"] == "noite"
    assert r["sol"]["altitude_graus"] < -6
    planetas = r["planetas_visiveis_agora"]
    assert len(planetas) >= 1
    for p in planetas:
        assert p["nome"] in {"Mercúrio", "Vênus", "Marte", "Júpiter", "Saturno"}
        assert p["altitude_graus"] > 0  # RN001
        assert 0 <= p["azimute_graus"] < 360
        assert p["direcao_cardeal"] == direcao_cardeal(p["azimute_graus"])  # RN003
        assert p["altura"] == descricao_altura(p["altitude_graus"])  # RN004
    assert sum(p["destaque_da_noite"] for p in planetas) == 1
    assert "Ainda é dia" not in r["mensagem"]


def test_resposta_informa_data_e_hora_no_fuso_de_fortaleza():
    r = o_que_observar_hoje(datetime(2026, 11, 23, 21, 0, tzinfo=timezone.utc))  # 18:00 em Fortaleza
    assert r["calculado_em"] == "2026-11-23T18:00:00-03:00"
    assert r["fuso"] == "America/Fortaleza"
    assert r["data_hora_utc"] == "2026-11-23T21:00:00Z"


def test_lua_traz_fase_iluminacao_e_proximas_fases():
    r = o_que_observar_hoje(datetime(2026, 11, 23, 21, 0, tzinfo=FUSO))
    lua = r["lua"]
    assert lua["fase_nome"] == nome_fase_lua(lua["fase_graus"]) == r["fase_lua_nome"]
    assert 0 <= lua["iluminacao_percentual"] <= 100
    assert lua["proxima_lua_cheia"] and lua["proxima_lua_nova"]
    assert lua["proxima_lua_cheia"] > "2026-11-23"
    assert lua["proxima_lua_nova"] > "2026-11-23"


def test_sol_e_lua_trazem_horarios_locais_nunca_vazios():
    r = o_que_observar_hoje(datetime(2026, 11, 23, 12, 0, tzinfo=FUSO))
    for campo in (r["sol"]["nascer"], r["sol"]["por"], r["lua"]["nascer"], r["lua"]["por"]):
        assert campo  # US034: nunca vazio
    assert re.fullmatch(r"\d\d:\d\d", r["sol"]["nascer"])
    assert r["sol"]["nascer_iso"].endswith("-03:00")
    assert r["sol"]["nascer"] < r["sol"]["por"]


def test_lua_que_nao_nasce_ou_nao_se_poe_no_dia_e_informada():
    # A cada mês lunar há um dia sem nascer da Lua e outro sem pôr (o horário "passa" da meia-noite).
    sem_nascer = sem_por = None
    for dia in range(1, 32):
        r = o_que_observar_hoje(datetime(2026, 12, dia, 12, 0, tzinfo=FUSO))
        if r["lua"]["nascer_iso"] is None:
            sem_nascer = r
        if r["lua"]["por_iso"] is None:
            sem_por = r
    assert sem_nascer is not None, "esperava um dia sem nascer da Lua em dezembro/2026"
    assert sem_nascer["lua"]["nascer"] == "A Lua não nasce neste dia."
    assert sem_por is not None, "esperava um dia sem pôr da Lua em dezembro/2026"
    assert sem_por["lua"]["por"] == "A Lua não se põe neste dia."


# --------------------------------------------------------------------------
# RN002 — fases REAIS de 2026
#
# Fonte: NASA Eclipse Web Site (GSFC), tabelas de eclipses da década 2021–2030:
#   Solares  https://eclipse.gsfc.nasa.gov/SEdecade/SEdecade2021.html
#   Lunares  https://eclipse.gsfc.nasa.gov/LEdecade/LEdecade2021.html
# Um eclipse solar só ocorre em Lua NOVA e um eclipse lunar só em Lua CHEIA, então o
# instante de máximo do eclipse é um ponto de referência confiável de cada fase.
# A NASA publica em TD (Tempo Dinâmico Terrestre), ~69 s à frente do UT em 2026;
# essa diferença é irrelevante para faixas de 45°.
#   Lua NOVA  — 2026-02-17 12:13:05 TD (eclipse solar anular)
#   Lua NOVA  — 2026-08-12 17:47:05 TD (eclipse solar total)
#   Lua CHEIA — 2026-03-03 11:34:52 TD (eclipse lunar total)
#   Lua CHEIA — 2026-08-28 04:14:04 TD (eclipse lunar parcial)
# --------------------------------------------------------------------------
def _utc(*args):
    return datetime(*args, tzinfo=timezone.utc)


@pytest.mark.parametrize(
    "instante, esperado, graus_aproximados",
    [
        (_utc(2026, 2, 17, 12, 12), "Nova", 0),
        (_utc(2026, 8, 12, 17, 46), "Nova", 0),
        (_utc(2026, 3, 3, 11, 33), "Cheia", 180),
        (_utc(2026, 8, 28, 4, 13), "Cheia", 180),
    ],
)
def test_fases_reais_de_2026_batem_com_a_nasa(instante, esperado, graus_aproximados):
    graus = fase_lua_em(instante)
    assert nome_fase_lua(graus) == esperado
    # no máximo do eclipse a Lua está praticamente em conjunção/oposição com o Sol
    diferenca = abs((graus - graus_aproximados + 180) % 360 - 180)
    assert diferenca < 2


@pytest.mark.parametrize(
    "consulta, campo, data_esperada",
    [
        # as próximas fases calculadas caem no mesmo dia (horário de Fortaleza) dos eclipses da NASA
        (datetime(2026, 2, 10, 12, 0, tzinfo=FUSO), "proxima_lua_nova", "2026-02-17"),
        (datetime(2026, 8, 5, 12, 0, tzinfo=FUSO), "proxima_lua_nova", "2026-08-12"),
        (datetime(2026, 2, 24, 12, 0, tzinfo=FUSO), "proxima_lua_cheia", "2026-03-03"),
        (datetime(2026, 8, 21, 12, 0, tzinfo=FUSO), "proxima_lua_cheia", "2026-08-28"),
    ],
)
def test_proximas_luas_batem_com_as_datas_da_nasa(consulta, campo, data_esperada):
    r = o_que_observar_hoje(consulta)
    assert r["lua"][campo].startswith(data_esperada)
