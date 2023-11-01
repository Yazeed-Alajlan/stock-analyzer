import talib
from database.database_functions import get_price_data

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

