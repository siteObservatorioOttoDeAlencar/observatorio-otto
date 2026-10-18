"""
Cálculos astronômicos locais (sem depender de API externa), usando Skyfield.
Na primeira execução, o Skyfield baixa o arquivo de efemérides 'de421.bsp'
(dados JPL/NASA, ~17MB) e guarda em cache local — depois disso funciona offline.
"""
'''
ARQUIVO SERVICE
'''
import os
from datetime import datetime
from skyfield.api import load, wgs84
from skyfield import almanac

#coordenadas de Fortaleza
LAT = float(os.getenv("OBSERVATORIO_LAT", "-3.7793"))
LON = float(os.getenv("OBSERVATORIO_LON", "-38.5661"))

_ts = None
_eph = None


def _carregar_efemerides():
    """Carrega os dados uma única vez (lazy load) e reaproveita entre requisições."""
    global _ts, _eph
    if _ts is None:
        _ts = load.timescale()
        _eph = load("de421.bsp")
    return _ts, _eph


def o_que_observar_hoje() -> dict:
    ts, eph = _carregar_efemerides()
    observatorio = eph["earth"] + wgs84.latlon(LAT, LON)

    agora = ts.now()

    planetas = {
        "Mercúrio": "MERCURY",
        "Vênus": "VENUS",
        "Marte": "MARS",
        "Júpiter": "JUPITER BARYCENTER",
        "Saturno": "SATURN BARYCENTER",
    }

    visiveis = []
    for nome, chave in planetas.items():
        corpo = eph[chave]
        astrometrico = observatorio.at(agora).observe(corpo)
        alt, az, _ = astrometrico.apparent().altaz()
        if alt.degrees > 0:  # acima do horizonte
            visiveis.append({
                "nome": nome,
                "altitude_graus": round(alt.degrees, 1),
                "azimute_graus": round(az.degrees, 1),
            })

    # Fase da lua
    fase = almanac.moon_phase(eph, agora)
    # Use the four phase names; Skyfield codes the principal events as 0 to 3.
    if fase.degrees < 45 or fase.degrees >= 315:
        fase_codigo_atual = 0
    elif fase.degrees < 135:
        fase_codigo_atual = 1
    elif fase.degrees < 225:
        fase_codigo_atual = 2
    else:
        fase_codigo_atual = 3

    iluminacao_percentual = almanac.fraction_illuminated(eph, "moon", agora) * 100
    fases_principais = almanac.moon_phases(eph)
    proximas_fases, codigos_fase = almanac.find_discrete(
        agora,
        ts.tt_jd(agora.tt + 35),
        fases_principais,
    )
    nomes_fases = {
        0: "Nova",
        1: "Crescente",
        2: "Cheia",
        3: "Minguante",
    }
    proxima_fase_indice = next(
        indice
        for indice, codigo in enumerate(codigos_fase)
        if int(codigo) != fase_codigo_atual
    )
    proxima_fase = {
        "nome": nomes_fases[int(codigos_fase[proxima_fase_indice])],
        "data_hora_utc": proximas_fases[proxima_fase_indice].utc_iso(),
    }

    return {
        "data_hora_utc": agora.utc_iso(),
        "planetas_visiveis_agora": visiveis,
        "fase_lua_graus": round(fase.degrees, 1),
        "fase_lua_nome": nomes_fases[fase_codigo_atual],
        "fase_lua_iluminacao_percentual": round(iluminacao_percentual, 1),
        "proxima_fase_lua": proxima_fase,
        "observatorio": {"latitude": LAT, "longitude": LON},
    }
