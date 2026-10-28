"""
Cálculos astronômicos locais (sem depender de API externa), usando Skyfield.
Na primeira execução, o Skyfield baixa o arquivo de efemérides 'de421.bsp'
(dados JPL/NASA, ~17MB) e guarda em cache local — depois disso funciona offline.
"""
# ARQUIVO SERVICE DE ASTRONOMIA
import os
from datetime import datetime
from skyfield.api import load, wgs84
from skyfield import almanac

# Coordenadas geográficas oficiais de Fortaleza - CE
LAT = float(os.getenv("OBSERVATORIO_LAT", "-3.7793"))
LON = float(os.getenv("OBSERVATORIO_LON", "-38.5661"))

_ts = None
_eph = None


def _carregar_efemerides():
    """
    Carrega os dados de efemérides planetárias da NASA (JPL) uma única vez
    na memória (lazy load) e reaproveita entre todas as requisições subsequentes.
    """
    global _ts, _eph
    if _ts is None:
        _ts = load.timescale()
        _eph = load("de421.bsp")
    return _ts, _eph


def _obter_direcao_cardeal(azimute_graus: float) -> str:
    """
    Esta função converte coordenadas astronômicas angulares em direções 
    geográficas intuitivas e fáceis de entender para o público leigo.
    
    Exemplo:
    Azimute 90° => 'Leste (Nascente)'
    Azimute 270° => 'Oeste (Poente)'
    """
    az = azimute_graus % 360
    if 22.5 <= az < 67.5:
        return "Nordeste"
    elif 67.5 <= az < 112.5:
        return "Leste (Nascente)"
    elif 112.5 <= az < 157.5:
        return "Sudeste"
    elif 157.5 <= az < 202.5:
        return "Sul"
    elif 202.5 <= az < 247.5:
        return "Sudoeste"
    elif 247.5 <= az < 292.5:
        return "Oeste (Poente)"
    elif 292.5 <= az < 337.5:
        return "Noroeste"
    else:
        return "Norte"


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


def o_que_observar_hoje() -> dict:
    """
    Este endpoint calcula e retorna os principais corpos celestes observáveis
    em tempo real a partir do céu de Fortaleza.
    
    Os dados são consumidos diretamente pela Home e pela página 'O Céu Hoje' do Front-End.
    Possui tratamento defensivo de erro (fallback degradado) para nunca quebrar a interface.
    """
    try:
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
        maior_altitude = -1.0
        indice_destaque = -1

        for nome, chave in planetas.items():
            corpo = eph[chave]
            astrometrico = observatorio.at(agora).observe(corpo)
            alt, az, _ = astrometrico.apparent().altaz()
            
            # Consideramos visível quando está acima do horizonte (altitude > 0°)
            if alt.degrees > 0:
                alt_round = round(alt.degrees, 1)
                az_round = round(az.degrees, 1)
                dificuldade, equipamento, a_olho_nu, visibilidade = _estimar_dificuldade_e_equipamento(nome, alt_round)
                
                # O astro mais alto no céu (com menos poluição atmosférica) é o destaque da noite
                if alt_round > maior_altitude:
                    maior_altitude = alt_round
                    indice_destaque = len(visiveis)

                visiveis.append({
                    "nome": nome,
                    "altitude_graus": alt_round,
                    "azimute_graus": az_round,
                    # Campos aditivos humanos (100% retrocompatíveis com o Front-End)
                    "direcao_cardeal": _obter_direcao_cardeal(az_round),
                    "visivel_a_olho_nu": a_olho_nu,
                    "nivel_dificuldade": dificuldade,
                    "equipamento_recomendado": equipamento,
                    # Campos de conveniência prontos para consumo na UI
                    "categoria_observacao": "Planeta",
                    "visibilidade": visibilidade,
                    "destaque_da_noite": False,  # Marcado logo abaixo para o planeta ideal
                })

        # Atribui o destaque da noite ao astro com melhor posição no céu
        if indice_destaque >= 0 and indice_destaque < len(visiveis):
            visiveis[indice_destaque]["destaque_da_noite"] = True

        # Fase da lua calculada geometricamente em relação ao Sol
        fase = almanac.moon_phase(eph, agora)
        fase_graus = round(fase.degrees, 1)
        
        if fase.degrees < 90:
            fase_nome = "Nova"
        elif 90 <= fase.degrees < 180:
            fase_nome = "Crescente"
        elif 180 <= fase.degrees < 270:
            fase_nome = "Cheia" 
        else:
            fase_nome = "Minguante"

        # Janela de melhor horário para observação urbana no Ceará
        melhor_horario_padrao = "19h30 às 22h00"

        # Resumo pronto para o Cockpit da Home (evita que o Front invente regras)
        total_visiveis = len(visiveis)
        status_ceu = "favoravel" if total_visiveis >= 2 else "regular"
        mensagem_ceu = (
            f"Condições favoráveis: {total_visiveis} planetas visíveis esta noite."
            if total_visiveis >= 2
            else "Observação moderada: poucos astros brilhantes no horizonte agora."
        )

        return {
            "status": "ok",
            "data_hora_utc": agora.utc_iso(),
            "melhor_horario": melhor_horario_padrao,
            "planetas_visiveis_agora": visiveis,
            "fase_lua_graus": fase_graus,
            "fase_lua_nome": fase_nome,
            "condicoes_gerais": {
                "status": status_ceu,
                "mensagem": mensagem_ceu,
                "melhor_horario": melhor_horario_padrao,
            },
            "observatorio": {"latitude": LAT, "longitude": LON},
        }

    except Exception:
        # Caso ocorra algum problema com o arquivo de efemérides ou no cálculo,
        # retornamos uma resposta degradada em vez de gerar um erro 500 no Front-End.
        return {
            "status": "degraded",
            "data_hora_utc": datetime.utcnow().isoformat() + "Z",
            "melhor_horario": "19h30 às 22h00",
            "planetas_visiveis_agora": [],
            "fase_lua_graus": 120.0,
            "fase_lua_nome": "Crescente",
            "condicoes_gerais": {
                "status": "regular",
                "mensagem": "Cálculo em modo simplificado. Verifique a visibilidade local.",
                "melhor_horario": "19h30 às 22h00",
            },
            "observatorio": {"latitude": LAT, "longitude": LON},
        }
