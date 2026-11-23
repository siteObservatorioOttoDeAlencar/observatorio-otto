"""
Cálculos astronômicos locais (sem depender de API externa), usando Skyfield.

O arquivo de efemérides 'de421.bsp' (dados JPL/NASA, ~17MB) é versionado em
api_python/data/. Na Vercel a função não pode baixar nem gravar arquivos, então
o Skyfield apenas LÊ esse arquivo local (nunca baixa).

Regras de negócio implementadas aqui (backlog do projeto):
- RN001  um planeta só é visível se estiver a mais de 0° do horizonte E o Sol
         estiver abaixo de -6°; de dia, nenhum planeta é listado (MSG020);
- RN002  fase da Lua em 8 faixas de 45° centradas, com % iluminada e próximas
         luas cheia e nova;
- RN003  direção (azimute) em 8 setores de 45° centrados;
- RN004  descrição da altura no céu (perto do horizonte … quase acima da cabeça);
- US034  nascer/pôr do Sol e da Lua do dia, no fuso de Fortaleza;
- US035  data/hora opcional (±1 ano de hoje).
"""
# ARQUIVO SERVICE DE ASTRONOMIA
import os
from datetime import datetime, timedelta, timezone
from pathlib import Path
from zoneinfo import ZoneInfo

from skyfield import almanac
from skyfield.api import Loader, wgs84

# Coordenadas geográficas oficiais de Fortaleza - CE
LAT = float(os.getenv("OBSERVATORIO_LAT", "-3.7793"))
LON = float(os.getenv("OBSERVATORIO_LON", "-38.5661"))

# Fuso de Fortaleza: UTC-3, sem horário de verão (precisa do pacote "tzdata" no runtime)
FUSO_NOME = "America/Fortaleza"
FUSO = ZoneInfo(FUSO_NOME)

# US035: aceita até 1 ano antes ou depois de hoje
LIMITE_DATA = timedelta(days=365)

# RN001: o Sol precisa estar abaixo de -6° (fim do crepúsculo civil)
ALTITUDE_SOL_NOITE = -6.0

MSG020 = "Ainda é dia em Fortaleza. Os planetas começam a aparecer depois do pôr do Sol, às {hora}."

DIRETORIO_DADOS = Path(__file__).resolve().parent / "data"

_ts = None
_eph = None


class MomentoForaDoLimite(ValueError):
    """A data/hora pedida está a mais de 1 ano de hoje."""


def _carregar_efemerides():
    """
    Carrega os dados de efemérides planetárias da NASA (JPL) uma única vez
    na memória (lazy load) e reaproveita entre todas as requisições subsequentes.
    """
    global _ts, _eph
    if _ts is None:
        # expire=False: nunca tenta atualizar/baixar arquivos; só lê de data/.
        loader = Loader(str(DIRETORIO_DADOS), verbose=False, expire=False)
        _ts = loader.timescale()
        _eph = loader("de421.bsp")
    return _ts, _eph


# ---------------------------------------------------------------------------
# Regras puras (sem Skyfield) — fáceis de testar
# ---------------------------------------------------------------------------

_NOMES_FASE = [
    "Nova",  # [337,5 – 22,5)
    "Crescente",  # [22,5 – 67,5)
    "Quarto crescente",  # [67,5 – 112,5)
    "Crescente gibosa",  # [112,5 – 157,5)
    "Cheia",  # [157,5 – 202,5)
    "Minguante gibosa",  # [202,5 – 247,5)
    "Quarto minguante",  # [247,5 – 292,5)
    "Minguante",  # [292,5 – 337,5)
]


def nome_fase_lua(graus: float) -> str:
    """RN002: ângulo de fase (0° a 360°) → nome, em faixas de 45° centradas em 0°, 45°, 90°…"""
    return _NOMES_FASE[int(((graus % 360) + 22.5) % 360 // 45)]


_NOMES_DIRECAO = ["Norte", "Nordeste", "Leste", "Sudeste", "Sul", "Sudoeste", "Oeste", "Noroeste"]


def direcao_cardeal(azimute_graus: float) -> str:
    """RN003: azimute → 8 setores de 45° centrados (Norte = 337,5° a 22,5°)."""
    return _NOMES_DIRECAO[int(((azimute_graus % 360) + 22.5) % 360 // 45)]


def descricao_altura(altitude_graus: float) -> str:
    """RN004: altura aparente no céu em linguagem humana."""
    if altitude_graus < 15:
        return "perto do horizonte"
    if altitude_graus < 45:
        return "a meia altura"
    if altitude_graus <= 75:
        return "alto no céu"
    return "quase acima da cabeça"


def validar_momento(momento: datetime, agora: datetime | None = None) -> datetime:
    """
    US035: devolve o momento no fuso de Fortaleza (data/hora sem fuso é tratada como
    horário de Fortaleza) e levanta MomentoForaDoLimite se estiver a mais de 1 ano de hoje.
    """
    agora = agora or datetime.now(FUSO)
    local = momento.replace(tzinfo=FUSO) if momento.tzinfo is None else momento.astimezone(FUSO)
    if abs(local - agora) > LIMITE_DATA:
        raise MomentoForaDoLimite(
            "A data deve estar a no máximo 1 ano antes ou depois de hoje "
            f"(hoje: {agora.date().isoformat()})."
        )
    return local


def _estimar_dificuldade_e_equipamento(nome: str, altitude: float) -> tuple[str, str, bool, str]:
    """
    Retorna métricas humanas de observação para cada planeta.
    Elimina a necessidade do Front-End deduzir regras astronômicas complexas.
    Retorna: (dificuldade, equipamento, visivel_a_olho_nu, visibilidade_qualitativa)
    """
    # Planetas brilhantes visíveis a olho nu no céu urbano
    if nome in ["Vênus", "Júpiter"]:
        visibilidade = "Excelente" if altitude >= 20 else "Boa"
        return "Muito Fácil", "Apenas seus olhos", True, visibilidade
    elif nome in ["Saturno", "Marte"]:
        visibilidade = "Boa" if altitude >= 25 else "Moderada"
        return "Fácil", "Apenas seus olhos (Binóculo realça detalhes)", True, visibilidade
    elif nome == "Mercúrio":
        visibilidade = "Moderada" if altitude >= 12 else "Baixa"
        return "Moderado", "Olho nu no horizonte (Binóculo recomendado)", bool(altitude > 10), visibilidade
    return "Avançado", "Telescópio recomendado", False, "Baixa"


# ---------------------------------------------------------------------------
# Cálculos com Skyfield
# ---------------------------------------------------------------------------

def _hora_local(t) -> datetime:
    return t.utc_datetime().astimezone(FUSO)


def _hhmm(dt: datetime) -> str:
    return dt.strftime("%H:%M")


def _nascer_e_por(funcao_discreta, ts, inicio: datetime, fim: datetime) -> tuple[datetime | None, datetime | None]:
    """Primeiro nascer (evento 1) e primeiro pôr (evento 0) dentro de [inicio, fim)."""
    tempos, eventos = almanac.find_discrete(ts.from_datetime(inicio), ts.from_datetime(fim), funcao_discreta)
    nascer = por = None
    for tempo, evento in zip(tempos, eventos):
        if int(evento) == 1 and nascer is None:
            nascer = _hora_local(tempo)
        elif int(evento) == 0 and por is None:
            por = _hora_local(tempo)
    return nascer, por


def fase_lua_em(momento: datetime) -> float:
    """Ângulo de fase da Lua em graus (0° a 360°), pelo Skyfield."""
    ts, eph = _carregar_efemerides()
    return float(almanac.moon_phase(eph, ts.from_datetime(momento)).degrees) % 360


def _proximas_fases(ts, eph, momento: datetime) -> tuple[datetime | None, datetime | None]:
    """Próximas luas cheia (evento 2) e nova (evento 0) depois de `momento`."""
    tempos, eventos = almanac.find_discrete(
        ts.from_datetime(momento),
        ts.from_datetime(momento + timedelta(days=40)),
        almanac.moon_phases(eph),
    )
    cheia = nova = None
    for tempo, evento in zip(tempos, eventos):
        if int(evento) == 2 and cheia is None:
            cheia = _hora_local(tempo)
        elif int(evento) == 0 and nova is None:
            nova = _hora_local(tempo)
    return cheia, nova


def _texto_horario(dt: datetime | None, ausente: str) -> str:
    """US034: nunca deixa o campo vazio — mostra o horário ou a explicação."""
    return _hhmm(dt) if dt else ausente


def o_que_observar_hoje(momento: datetime | None = None) -> dict:
    """
    Calcula o que observar no céu de Fortaleza no `momento` (aware, ou agora).

    Consumido pela Home (Cockpit dos 5 segundos) e pela página 'O Céu Hoje'.
    Levanta exceção se o cálculo falhar (a rota converte em 503).
    """
    momento = (momento or datetime.now(FUSO)).astimezone(FUSO)
    ts, eph = _carregar_efemerides()
    topos = wgs84.latlon(LAT, LON)
    observador = eph["earth"] + topos
    t = ts.from_datetime(momento)

    # --- Sol (RN001, US034) ---
    altitude_sol = float(observador.at(t).observe(eph["sun"]).apparent().altaz()[0].degrees)
    inicio_dia = momento.replace(hour=0, minute=0, second=0, microsecond=0)
    fim_dia = inicio_dia + timedelta(days=1)
    sol_nascer, sol_por = _nascer_e_por(almanac.sunrise_sunset(eph, topos), ts, inicio_dia, fim_dia)
    e_noite = altitude_sol < ALTITUDE_SOL_NOITE

    # --- Planetas (RN001, RN003, RN004) ---
    visiveis = []
    if e_noite:
        planetas = {
            "Mercúrio": "MERCURY",
            "Vênus": "VENUS",
            "Marte": "MARS",
            "Júpiter": "JUPITER BARYCENTER",
            "Saturno": "SATURN BARYCENTER",
        }
        maior_altitude = -1.0
        indice_destaque = -1
        for nome, chave in planetas.items():
            alt, az, _ = observador.at(t).observe(eph[chave]).apparent().altaz()
            if alt.degrees <= 0:  # abaixo do horizonte
                continue
            alt_round = round(float(alt.degrees), 1)
            az_round = round(float(az.degrees), 1)
            dificuldade, equipamento, a_olho_nu, visibilidade = _estimar_dificuldade_e_equipamento(nome, alt_round)

            # O astro mais alto no céu (com menos poluição atmosférica) é o destaque da noite
            if alt_round > maior_altitude:
                maior_altitude = alt_round
                indice_destaque = len(visiveis)

            visiveis.append({
                "nome": nome,
                "altitude_graus": alt_round,
                "azimute_graus": az_round,
                "direcao_cardeal": direcao_cardeal(az_round),
                "altura": descricao_altura(alt_round),
                "visivel_a_olho_nu": a_olho_nu,
                "nivel_dificuldade": dificuldade,
                "equipamento_recomendado": equipamento,
                "categoria_observacao": "Planeta",
                "visibilidade": visibilidade,
                "destaque_da_noite": False,
            })
        if 0 <= indice_destaque < len(visiveis):
            visiveis[indice_destaque]["destaque_da_noite"] = True

    # --- Lua (RN002, US034) ---
    fase_graus = float(almanac.moon_phase(eph, t).degrees) % 360
    iluminacao = float(almanac.fraction_illuminated(eph, "moon", t)) * 100
    cheia, nova = _proximas_fases(ts, eph, momento)
    lua_nascer, lua_por = _nascer_e_por(almanac.risings_and_settings(eph, eph["moon"], topos), ts, inicio_dia, fim_dia)

    # --- Mensagens e condições gerais ---
    melhor_horario = "19h30 às 22h00"
    if e_noite:
        total = len(visiveis)
        status_ceu = "favoravel" if total >= 2 else "regular"
        mensagem = (
            f"Condições favoráveis: {total} planetas visíveis esta noite."
            if total >= 2
            else "Observação moderada: poucos astros brilhantes no horizonte agora."
        )
    else:
        status_ceu = "dia"
        mensagem = MSG020.format(hora=_texto_horario(sol_por, "—"))

    return {
        "status": "ok",
        "calculado_em": momento.isoformat(timespec="seconds"),
        "fuso": FUSO_NOME,
        "data_hora_utc": momento.astimezone(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "melhor_horario": melhor_horario,
        "mensagem": mensagem,
        "periodo": "noite" if e_noite else "dia",
        "planetas_visiveis_agora": visiveis,
        # Compatível com o formato anterior; detalhes completos em "lua"
        "fase_lua_graus": round(fase_graus, 1),
        "fase_lua_nome": nome_fase_lua(fase_graus),
        "lua": {
            "fase_nome": nome_fase_lua(fase_graus),
            "fase_graus": round(fase_graus, 1),
            "iluminacao_percentual": round(iluminacao),
            "proxima_lua_cheia": cheia.isoformat(timespec="minutes") if cheia else None,
            "proxima_lua_nova": nova.isoformat(timespec="minutes") if nova else None,
            "nascer": _texto_horario(lua_nascer, "A Lua não nasce neste dia."),
            "por": _texto_horario(lua_por, "A Lua não se põe neste dia."),
            "nascer_iso": lua_nascer.isoformat(timespec="minutes") if lua_nascer else None,
            "por_iso": lua_por.isoformat(timespec="minutes") if lua_por else None,
        },
        "sol": {
            "altitude_graus": round(altitude_sol, 1),
            "nascer": _texto_horario(sol_nascer, "O Sol não nasce neste dia."),
            "por": _texto_horario(sol_por, "O Sol não se põe neste dia."),
            "nascer_iso": sol_nascer.isoformat(timespec="minutes") if sol_nascer else None,
            "por_iso": sol_por.isoformat(timespec="minutes") if sol_por else None,
        },
        "condicoes_gerais": {
            "status": status_ceu,
            "mensagem": mensagem,
            "melhor_horario": melhor_horario,
        },
        "observatorio": {"latitude": LAT, "longitude": LON},
    }
