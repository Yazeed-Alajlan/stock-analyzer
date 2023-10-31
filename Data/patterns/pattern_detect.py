import talib
import yfinance as yf
import pandas as pd
import sys
sys.path.append('C:/Users/Yazee/Desktop/stock-analyzer/Data/')
from database_functions import get_price_data
def find_patterns(pattern,symbols):
    stocks = {}
    # print(symbols)
    for symbol in symbols:
        data = get_price_data(symbol)
        # yf.download(symbol, start="2020-01-01", end="2020-03-24")
        pattern_function = getattr(talib, pattern)
        try:
            results = pattern_function(data['open'], data['high'], data['low'], data['close'])
            last = results.iloc[-1]
            if last > 0:
                stocks[symbol] = 'bullish'
            elif last < 0:
                stocks[symbol] = 'bearish'
            else:
                stocks[symbol] = None
        except Exception as e:
            print('Failed for symbol: ', e)

    return stocks

# def find_patterns(pattern,symbols):
#     patter_days = {}
#     for symbol in symbols:
#         data = yf.download(symbol, start="2020-01-01", end="2020-08-01")
#         pattern_function = getattr(talib, pattern)

#         try:
#             results = pattern_function(data['Open'], data['High'], data['Low'], data['Close'])
#             patter_days[symbol] = results[results !=0]
#         except Exception as e:
#             print('Failed for symbol: ', symbol)

#     return patter_days


def analyze_patterns(symbols,pattern):
    # patterns = ["CDLDOJI", "CDLENGULFING", "CDLHAMMER"] 
    # patterns = ["CDLDOJI"] 
    patterns = [pattern]  # Replace with your list of patterns to test
    print("----------------------------------------------------")
    # print(patterns)
    results={}
    # print(f"Results for the following patterns:")
    for pattern in patterns:
        result = find_patterns(pattern,symbols)
        results[pattern]=result
    # print(results)
    return results





candlestick_patterns = {
    'CDL2CROWS':'Two Crows',
    'CDL3BLACKCROWS':'Three Black Crows',
    'CDL3INSIDE':'Three Inside Up/Down',
    'CDL3LINESTRIKE':'Three-Line Strike',
    'CDL3OUTSIDE':'Three Outside Up/Down',
    'CDL3STARSINSOUTH':'Three Stars In The South',
    'CDL3WHITESOLDIERS':'Three Advancing White Soldiers',
    'CDLABANDONEDBABY':'Abandoned Baby',
    'CDLADVANCEBLOCK':'Advance Block',
    'CDLBELTHOLD':'Belt-hold',
    'CDLBREAKAWAY':'Breakaway',
    'CDLCLOSINGMARUBOZU':'Closing Marubozu',
    'CDLCONCEALBABYSWALL':'Concealing Baby Swallow',
    'CDLCOUNTERATTACK':'Counterattack',
    'CDLDARKCLOUDCOVER':'Dark Cloud Cover',
    'CDLDOJI':'Doji',
    'CDLDOJISTAR':'Doji Star',
    'CDLDRAGONFLYDOJI':'Dragonfly Doji',
    'CDLENGULFING':'Engulfing Pattern',
    'CDLEVENINGDOJISTAR':'Evening Doji Star',
    'CDLEVENINGSTAR':'Evening Star',
    'CDLGAPSIDESIDEWHITE':'Up/Down-gap side-by-side white lines',
    'CDLGRAVESTONEDOJI':'Gravestone Doji',
    'CDLHAMMER':'Hammer',
    'CDLHANGINGMAN':'Hanging Man',
    'CDLHARAMI':'Harami Pattern',
    'CDLHARAMICROSS':'Harami Cross Pattern',
    'CDLHIGHWAVE':'High-Wave Candle',
    'CDLHIKKAKE':'Hikkake Pattern',
    'CDLHIKKAKEMOD':'Modified Hikkake Pattern',
    'CDLHOMINGPIGEON':'Homing Pigeon',
    'CDLIDENTICAL3CROWS':'Identical Three Crows',
    'CDLINNECK':'In-Neck Pattern',
    'CDLINVERTEDHAMMER':'Inverted Hammer',
    'CDLKICKING':'Kicking',
    'CDLKICKINGBYLENGTH':'Kicking - bull/bear determined by the longer marubozu',
    'CDLLADDERBOTTOM':'Ladder Bottom',
    'CDLLONGLEGGEDDOJI':'Long Legged Doji',
    'CDLLONGLINE':'Long Line Candle',
    'CDLMARUBOZU':'Marubozu',
    'CDLMATCHINGLOW':'Matching Low',
    'CDLMATHOLD':'Mat Hold',
    'CDLMORNINGDOJISTAR':'Morning Doji Star',
    'CDLMORNINGSTAR':'Morning Star',
    'CDLONNECK':'On-Neck Pattern',
    'CDLPIERCING':'Piercing Pattern',
    'CDLRICKSHAWMAN':'Rickshaw Man',
    'CDLRISEFALL3METHODS':'Rising/Falling Three Methods',
    'CDLSEPARATINGLINES':'Separating Lines',
    'CDLSHOOTINGSTAR':'Shooting Star',
    'CDLSHORTLINE':'Short Line Candle',
    'CDLSPINNINGTOP':'Spinning Top',
    'CDLSTALLEDPATTERN':'Stalled Pattern',
    'CDLSTICKSANDWICH':'Stick Sandwich',
    'CDLTAKURI':'Takuri (Dragonfly Doji with very long lower shadow)',
    'CDLTASUKIGAP':'Tasuki Gap',
    'CDLTHRUSTING':'Thrusting Pattern',
    'CDLTRISTAR':'Tristar Pattern',
    'CDLUNIQUE3RIVER':'Unique 3 River',
    'CDLUPSIDEGAP2CROWS':'Upside Gap Two Crows',
    'CDLXSIDEGAP3METHODS':'Upside/Downside Gap Three Methods'
}