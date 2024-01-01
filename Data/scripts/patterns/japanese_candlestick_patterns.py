import talib
from database.main import *





## Currently i get only one pattern ##
def find_japanese_candlestick_patterns(symbols,patterns):
    results = {}
    patterns = [patterns]  # Replace with your list of patterns to test

    for pattern in patterns:
        stocks = {}
        for symbol in symbols:
            data = get_price_data(symbol)
            pattern_function = getattr(talib, pattern)

            try:
                result = pattern_function(data['open'], data['high'], data['low'], data['close'])
                last = result.iloc[-1]
                if last > 0:
                    stocks[symbol] = 'bullish'
                elif last < 0:
                    stocks[symbol] = 'bearish'
                else:
                    stocks[symbol] = None
            except Exception as e:
                print(f"Failed for symbol {symbol}: {e}")

        results[pattern] = stocks

    return results


candlestick_patterns = {
 'CDLENGULFING': 'Engulfing Pattern',
'CDLDOJI': 'Doji',
'CDLHAMMER': 'Hammer',
'CDLHANGINGMAN': 'Hanging Man',
'CDLMORNINGSTAR': 'Morning Star',
'CDLEVENINGSTAR': 'Evening Star',
'CDLDARKCLOUDCOVER': 'Dark Cloud Cover',
'CDLPIERCING': 'Piercing Pattern',
'CDLSHOOTINGSTAR': 'Shooting Star',
'CDL3BLACKCROWS': 'Three Black Crows',
'CDL3WHITESOLDIERS': 'Three White Soldiers',
'CDLHARAMI': 'Harami Pattern',
'CDLHARAMICROSS': 'Harami Cross'
}
#
def get_japanese_candlestick_patterns_markers(symbol):
    data = get_price_data(symbol)

    pattern_results = {}
    for pattern_code, pattern_name in candlestick_patterns.items():
        pattern_function = getattr(talib, pattern_code)
        pattern = pattern_function(data['open'], data['high'], data['low'], data['close'])
        pattern_occurrences = []
        for idx, val in enumerate(pattern):
            if val != 0:
                pattern_date = data.index[idx]
                pattern_occurrences.append((pattern_date, pattern_name))

        pattern_results[pattern_name] = pattern_occurrences
    print(pattern_results)
    return pattern_results



#candlestick_patterns = {
#     'CDL2CROWS':'Two Crows',
#     'CDL3BLACKCROWS':'Three Black Crows',
#     'CDL3INSIDE':'Three Inside Up/Down',
#     'CDL3LINESTRIKE':'Three-Line Strike',
#     'CDL3OUTSIDE':'Three Outside Up/Down',
#     'CDL3STARSINSOUTH':'Three Stars In The South',
#     'CDL3WHITESOLDIERS':'Three Advancing White Soldiers',
#     'CDLABANDONEDBABY':'Abandoned Baby',
#     'CDLADVANCEBLOCK':'Advance Block',
#     'CDLBELTHOLD':'Belt-hold',
#     'CDLBREAKAWAY':'Breakaway',
#     'CDLCLOSINGMARUBOZU':'Closing Marubozu',
#     'CDLCONCEALBABYSWALL':'Concealing Baby Swallow',
#     'CDLCOUNTERATTACK':'Counterattack',
#     'CDLDARKCLOUDCOVER':'Dark Cloud Cover',
#     'CDLDOJI':'Doji',
#     'CDLDOJISTAR':'Doji Star',
#     'CDLDRAGONFLYDOJI':'Dragonfly Doji',
#     'CDLENGULFING':'Engulfing Pattern',
#     'CDLEVENINGDOJISTAR':'Evening Doji Star',
#     'CDLEVENINGSTAR':'Evening Star',
#     'CDLGAPSIDESIDEWHITE':'Up/Down-gap side-by-side white lines',
#     'CDLGRAVESTONEDOJI':'Gravestone Doji',
#     'CDLHAMMER':'Hammer',
#     'CDLHANGINGMAN':'Hanging Man',
#     'CDLHARAMI':'Harami Pattern',
#     'CDLHARAMICROSS':'Harami Cross Pattern',
#     'CDLHIGHWAVE':'High-Wave Candle',
#     'CDLHIKKAKE':'Hikkake Pattern',
#     'CDLHIKKAKEMOD':'Modified Hikkake Pattern',
#     'CDLHOMINGPIGEON':'Homing Pigeon',
#     'CDLIDENTICAL3CROWS':'Identical Three Crows',
#     'CDLINNECK':'In-Neck Pattern',
#     'CDLINVERTEDHAMMER':'Inverted Hammer',
#     'CDLKICKING':'Kicking',
#     'CDLKICKINGBYLENGTH':'Kicking - bull/bear determined by the longer marubozu',
#     'CDLLADDERBOTTOM':'Ladder Bottom',
#     'CDLLONGLEGGEDDOJI':'Long Legged Doji',
#     'CDLLONGLINE':'Long Line Candle',
#     'CDLMARUBOZU':'Marubozu',
#     'CDLMATCHINGLOW':'Matching Low',
#     'CDLMATHOLD':'Mat Hold',
#     'CDLMORNINGDOJISTAR':'Morning Doji Star',
#     'CDLMORNINGSTAR':'Morning Star',
#     'CDLONNECK':'On-Neck Pattern',
#     'CDLPIERCING':'Piercing Pattern',
#     'CDLRICKSHAWMAN':'Rickshaw Man',
#     'CDLRISEFALL3METHODS':'Rising/Falling Three Methods',
#     'CDLSEPARATINGLINES':'Separating Lines',
#     'CDLSHOOTINGSTAR':'Shooting Star',
#     'CDLSHORTLINE':'Short Line Candle',
#     'CDLSPINNINGTOP':'Spinning Top',
#     'CDLSTALLEDPATTERN':'Stalled Pattern',
#     'CDLSTICKSANDWICH':'Stick Sandwich',
#     'CDLTAKURI':'Takuri (Dragonfly Doji with very long lower shadow)',
#     'CDLTASUKIGAP':'Tasuki Gap',
#     'CDLTHRUSTING':'Thrusting Pattern',
#     'CDLTRISTAR':'Tristar Pattern',
#     'CDLUNIQUE3RIVER':'Unique 3 River',
#     'CDLUPSIDEGAP2CROWS':'Upside Gap Two Crows',
#     'CDLXSIDEGAP3METHODS':'Upside/Downside Gap Three Methods'
# }
