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
    fase_nome=""
    if fase.degrees < 90:
        fase_nome = "Nova"
    elif fase.degrees < 180 and fase.degrees >= 90:
        fase_nome = "Crescente"
    elif fase.degrees < 270 and fase.degrees >= 180:
        fase_nome = "Cheia" 
    elif fase.degrees < 360 and fase.degrees >= 270:
        fase_nome = "Minguante"

    return {
        "data_hora_utc": agora.utc_iso(),
        "planetas_visiveis_agora": visiveis,
        "fase_lua_graus": round(fase.degrees, 1),
        "fase_lua_nome": fase_nome,
        "observatorio": {"latitude": LAT, "longitude": LON},
    }
