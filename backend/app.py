import MetaTrader5 as mt5
import time
import logging
from flask import Flask, jsonify
from flask_cors import CORS
from threading import Thread
from datetime import datetime, timedelta
import pandas as pd
import numpy as np
import os

# --- Configuração de Logging ---
# Remove o logger antigo se existir para evitar duplicação
if os.path.exists('backend/mt5_errors.log'):
    os.remove('backend/mt5_errors.log')
if os.path.exists('backend/mt5_data.log'):
    os.remove('backend/mt5_data.log')

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler() # Log para o console
    ]
)
# Logger específico para erros de símbolo
error_logger = logging.getLogger('mt5_errors')
error_handler = logging.FileHandler('backend/mt5_errors.log')
error_handler.setFormatter(logging.Formatter('%(asctime)s - %(message)s'))
error_logger.addHandler(error_handler)
error_logger.setLevel(logging.WARNING)


# --- Inicialização do Flask ---
app = Flask(__name__)
CORS(app)

# --- Listas de Ativos ---
IBOV_SYMBOLS = [
    'VALE3', 'ITUB4', 'PETR4', 'PETR3', 'ELET3', 'BBDC4', 'B3SA3', 'ITSA4',
    'BPAC11', 'BBAS3', 'EMBR3', 'WEGE3', 'ABEV3', 'EQTL3', 'RDOR3', 'RENT3',
    'SUZB3', 'ENEV3', 'PRIO3', 'VBBR3', 'VIVT3', 'TOTS3', 'RADL3', 'UGPA3',
    'BBDC3', 'CMIG4', 'GGBR4', 'CPLE6', 'BBSE3', 'TIMS3', 'RAIL3', 'LREN3',
    'ENGI11', 'KLBN11', 'ELET6', 'ASAI3', 'HAPV3', 'BRFS3', 'ALOS3',
    'SMFT3', 'SANB11', 'EGIE3', 'ISAE4', 'PSSA3', 'MULT3', 'CSAN3',
    'NATU3', 'CMIN3', 'CYRE3', 'TAEE11', 'CPFE3', 'HYPE3', 'FLRY3',
    'POMO4', 'GOAU4', 'CSNA3', 'COGN3', 'IGTI11', 'DIRR3', 'CURY3', 'MRFG3',
    'BRAP4', 'MGLU3', 'IRBR3', 'VIVA3', 'RECV3', 'YDUQ3', 'AURE3',
    'SLCE3', 'MRVE3', 'BEEF3', 'CEAB3', 'BRKM5', 'USIM5', 'VAMO3', 'PCAR3',
    'RAIZ4', 'CVCB3', 'SBSP3', 'CXSE3'
]
DI_SYMBOLS = [
    'DI1F26', 'DI1F27', 'DI1F28', 'DI1F29', 'DI1F30', 'DI1F31', 'DI1F32',
    'DI1F33', 'DI1F34', 'DI1F35', 'DI1F36', 'DI1F37', 'DI1F38', 'DI1F39', 'DI1F40'
]
FUTURES_SYMBOLS = ['WIN@', 'WDO@']
IBOV_INDEX_SYMBOLS = ['IBOV', 'BVMF.IBOV', 'IBOVESPA']
ALL_SYMBOLS = list(set(IBOV_SYMBOLS + DI_SYMBOLS + FUTURES_SYMBOLS + IBOV_INDEX_SYMBOLS))

# --- Estado Global ---
mt5_connected = False
market_data_cache = {}
ibov_symbol_in_use = None

# --- Funções de Conexão e Dados ---
def initialize_mt5():
    global mt5_connected, ibov_symbol_in_use
    if not mt5.initialize():
        logging.error("Falha na inicialização do MT5.")
        mt5_connected = False
        return False
    
    # Tenta encontrar o símbolo do IBOV correto
    for symbol in IBOV_INDEX_SYMBOLS:
        if mt5.symbol_select(symbol, True):
            info = mt5.symbol_info(symbol)
            if info and info.visible:
                ibov_symbol_in_use = symbol
                logging.info(f"Símbolo do IBOV encontrado e em uso: {ibov_symbol_in_use}")
                break
    
    if not ibov_symbol_in_use:
        error_logger.warning("Nenhum símbolo para o IBOV (IBOV, BVMF.IBOV, IBOVESPA) foi encontrado na sua plataforma MT5.")

    logging.info("MetaTrader 5 inicializado com sucesso.")
    mt5_connected = True
    return True

def get_daily_data(symbol):
    """Função robusta para pegar dados diários (OHLC) de um símbolo."""
    rates = mt5.copy_rates_from_pos(symbol, mt5.TIMEFRAME_D1, 0, 1)
    if rates is None or len(rates) == 0:
        return None
    return rates[0]

def update_data_thread():
    global market_data_cache, mt5_connected
    
    if not mt5_connected and not initialize_mt5():
        return # Não continua se não conseguir conectar

    while True:
        try:
            temp_cache = {}
            for symbol in ALL_SYMBOLS:
                if not mt5.symbol_select(symbol, True):
                    error_logger.warning(f"Não foi possível selecionar o símbolo {symbol}, pode não estar disponível.")
                    continue

                tick = mt5.symbol_info_tick(symbol)
                daily_data = get_daily_data(symbol)

                if tick and daily_data is not None:
                    open_price = float(daily_data['open'])
                    change = tick.last - open_price
                    change_percent = (change / open_price) * 100 if open_price != 0 else 0
                    
                    temp_cache[symbol] = {
                        'price': tick.last,
                        'open': open_price,
                        'high': float(daily_data['high']),
                        'low': float(daily_data['low']),
                        'change': change,
                        'change_percent': change_percent,
                        'volume': int(tick.volume),
                        'time': datetime.fromtimestamp(tick.time).isoformat()
                    }
                else:
                    error_logger.warning(f"Dados de tick ou diários indisponíveis para {symbol}.")
            
            market_data_cache = temp_cache
            time.sleep(1) # ATUALIZAÇÃO A CADA 1 SEGUNDO
        except Exception as e:
            logging.error(f"Erro na thread de atualização: {e}")
            mt5_connected = False
            time.sleep(10) # Espera mais tempo antes de tentar reconectar
            initialize_mt5()

# --- Endpoints da API ---
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'mt5_connected': mt5_connected})

def get_simulated_pulse():
    return {
        "positiveCount": 50, "negativeCount": 30, "neutralCount": 3,
        "positivePercent": 60.2, "negativePercent": 36.1, "pressure": 62.1,
        "topGainers": [{"symbol": "MGLU3", "price": 2.50, "changePercent": 5.2}],
        "topLosers": [{"symbol": "CVCB3", "price": 3.10, "changePercent": -4.1}],
        "totalMonitored": 80, "totalPossible": 83, "source": "simulated"
    }

@app.route('/api/ibov-pulse', methods=['GET'])
def get_ibov_pulse():
    if not mt5_connected or not market_data_cache:
        return jsonify(get_simulated_pulse())

    positive_count, negative_count, neutral_count = 0, 0, 0
    movers = []

    for symbol in IBOV_SYMBOLS:
        data = market_data_cache.get(symbol)
        if data:
            if data['change_percent'] > 0.05:
                positive_count += 1
            elif data['change_percent'] < -0.05:
                negative_count += 1
            else:
                neutral_count += 1
            movers.append({'symbol': symbol, 'price': data['price'], 'changePercent': data['change_percent']})

    total_valid = positive_count + negative_count + neutral_count
    if total_valid == 0: return jsonify(get_simulated_pulse())

    movers.sort(key=lambda x: x['changePercent'], reverse=True)
    
    response = {
        "positiveCount": positive_count,
        "negativeCount": negative_count,
        "neutralCount": neutral_count,
        "positivePercent": (positive_count / total_valid) * 100,
        "negativePercent": (negative_count / total_valid) * 100,
        "pressure": (positive_count / total_valid) * 100,
        "topGainers": movers[:10],
        "topLosers": sorted(movers, key=lambda x: x['changePercent'])[:10],
        "totalMonitored": total_valid,
        "totalPossible": len(IBOV_SYMBOLS),
        "source": "real"
    }
    return jsonify(response)

@app.route('/api/di-curve', methods=['GET'])
def get_di_curve():
    contracts = []
    if mt5_connected and market_data_cache:
        for symbol in DI_SYMBOLS:
            data = market_data_cache.get(symbol)
            if data:
                try:
                    # Extrai ano do símbolo DI1F<YY>
                    year = int(f"20{symbol[-2:]}")
                    # Assume vencimento em Janeiro
                    maturity_date = f"{year}-01-01"
                    contracts.append({
                        "symbol": symbol,
                        "rate": data['price'],
                        "maturityDate": maturity_date
                    })
                except Exception as e:
                    logging.error(f"Erro ao processar vencimento do DI {symbol}: {e}")
        return jsonify({"contracts": contracts, "source": "real"})
    else: # Simulação
        return jsonify({
            "contracts": [{"symbol": "DI1F28", "rate": 11.5, "maturityDate": "2028-01-01"}],
            "source": "simulated"
        })

@app.route('/api/tradable-stocks', methods=['GET'])
def get_tradable_stocks():
    stocks = []
    if mt5_connected and market_data_cache:
        for symbol in IBOV_SYMBOLS:
            data = market_data_cache.get(symbol)
            if data:
                stocks.append({
                    "symbol": symbol, "name": symbol, "price": data['price'],
                    "change": data['change'], "changePercent": data['change_percent'], "volume": data['volume']
                })
        return jsonify(stocks)
    return jsonify([])

@app.route('/api/candlestick/<symbol>/<timeframe>', methods=['GET'])
def get_candlestick(symbol, timeframe):
    TIMEFRAME_MAP = {
        'M1': mt5.TIMEFRAME_M1, 'M5': mt5.TIMEFRAME_M5, 'M15': mt5.TIMEFRAME_M15,
        'M30': mt5.TIMEFRAME_M30, 'H1': mt5.TIMEFRAME_H1, 'H4': mt5.TIMEFRAME_H4, 'D1': mt5.TIMEFRAME_D1
    }
    mt5_timeframe = TIMEFRAME_MAP.get(timeframe.upper(), mt5.TIMEFRAME_D1)
    
    effective_symbol = symbol
    if symbol == 'IBOV' and ibov_symbol_in_use:
        effective_symbol = ibov_symbol_in_use

    rates = mt5.copy_rates_from_pos(effective_symbol, mt5_timeframe, 0, 200)
    if rates is None: return jsonify([])
    
    return jsonify([{
        "time": datetime.fromtimestamp(r['time']).isoformat(),
        "open": r['open'], "high": r['high'], "low": r['low'], "close": r['close'], "volume": int(r['tick_volume'])
    } for r in rates])

@app.route('/api/symbol-info/<symbol>', methods=['GET'])
def get_symbol_info(symbol):
    effective_symbol = symbol
    if symbol == 'IBOV' and ibov_symbol_in_use:
        effective_symbol = ibov_symbol_in_use

    data = market_data_cache.get(effective_symbol)
    if data:
        return jsonify({
            "symbol": symbol, "name": "Índice Bovespa" if symbol == 'IBOV' else symbol,
            "price": data['price'], "change": data['change'], "changePercent": data['change_percent'],
            "volume": data['volume'], "high": data['high'], "low": data['low'], "source": "real"
        })
    return jsonify({"error": "Data not found"}), 404

def get_normalized_series(symbol, count=100):
    rates = mt5.copy_rates_from_pos(symbol, mt5.TIMEFRAME_M1, 0, count)
    if rates is None: return None
    df = pd.DataFrame(rates)
    # Normalização Min-Max
    df['normalized'] = (df['close'] - df['close'].min()) / (df['close'].max() - df['close'].min())
    return df[['time', 'normalized']]

@app.route('/api/correlation/<instrument>', methods=['GET'])
def get_correlation(instrument):
    di_series = get_normalized_series('DI1F29', 100) # Usando um DI curto como proxy
    instrument_symbol = 'WIN@' if instrument == 'WIN' else 'WDO@'
    instrument_series = get_normalized_series(instrument_symbol, 100)

    if di_series is None or instrument_series is None:
        return jsonify({"error": "Could not fetch data for correlation"}), 500

    merged = pd.merge(di_series, instrument_series, on='time', suffixes=('_di', '_inst'))
    if len(merged) < 2:
        return jsonify({"error": "Not enough overlapping data"}), 500
        
    correlation = merged['normalized_di'].corr(merged['normalized_inst'])
    
    suggestion = "Neutro"
    if correlation > 0.3: suggestion = "Viés de Alta"
    elif correlation < -0.3: suggestion = "Viés de Baixa"

    return jsonify({
        "seriesDI": {"name": "Curva de Juros (DI1F29)", "data": merged[['time', 'normalized_di']].values.tolist()},
        "seriesInstrument": {"name": instrument_symbol, "data": merged[['time', 'normalized_inst']].values.tolist()},
        "correlation": correlation,
        "suggestion": suggestion,
        "source": "real"
    })

# NOVO ENDPOINT PARA CORRELAÇÃO WIN vs WDO
@app.route('/api/win-wdo-correlation', methods=['GET'])
def get_win_wdo_correlation():
    win_series = get_normalized_series('WIN@', 100)
    wdo_series = get_normalized_series('WDO@', 100)

    if win_series is None or wdo_series is None:
        return jsonify({"error": "Não foi possível buscar dados para WIN@ ou WDO@"}), 500

    merged = pd.merge(win_series.rename(columns={'normalized': 'win'}), 
                      wdo_series.rename(columns={'normalized': 'wdo'}), 
                      on='time')
    
    if len(merged) < 20: # Precisa de dados suficientes
        return jsonify({"error": "Dados insuficientes para calcular correlação"}), 500

    correlation = merged['win'].corr(merged['wdo'])
    
    # Lógica de Sugestão
    suggestion = "Aguardar"
    logic = "Correlação fraca ou neutra. Sem sinal claro."
    
    last_win_change = merged['win'].iloc[-1] - merged['win'].iloc[-2]
    last_wdo_change = merged['wdo'].iloc[-1] - merged['wdo'].iloc[-2]

    if correlation < -0.5: # Correlação negativa forte (ideal para pairs trading)
        logic = "Correlação negativa forte: ativos se movem em direções opostas."
        if last_win_change > 0 and last_wdo_change < 0: # WIN subiu, WDO caiu (movimento esperado)
            suggestion = "Manter Posições"
        else: # Divergência
            suggestion = "Comprar Ativo em Baixa / Vender Ativo em Alta"
    elif correlation > 0.5: # Correlação positiva forte
        logic = "Correlação positiva forte: ativos se movem na mesma direção."
        if (last_win_change > 0 and last_wdo_change < 0) or (last_win_change < 0 and last_wdo_change > 0):
             suggestion = "Comprar Ativo em Alta / Vender Ativo em Baixa"
        else:
            suggestion = "Manter Posições"

    # Força do Sinal
    signal_strength = "Baixa"
    if abs(correlation) > 0.7:
        signal_strength = "Alta"
    elif abs(correlation) > 0.4:
        signal_strength = "Média"

    return jsonify({
        "seriesWin": {"name": "WIN@", "data": merged[['time', 'win']].values.tolist()},
        "seriesWdo": {"name": "WDO@", "data": merged[['time', 'wdo']].values.tolist()},
        "correlation": correlation,
        "suggestion": suggestion,
        "logic": logic,
        "signalStrength": signal_strength,
        "source": "real"
    })


if __name__ == '__main__':
    # Inicia a thread de atualização de dados
    data_thread = Thread(target=update_data_thread, daemon=True)
    data_thread.start()
    
    logging.info("🚀 Iniciando servidor Flask...")
    app.run(host='0.0.0.0', port=5000, debug=True, use_reloader=False)
