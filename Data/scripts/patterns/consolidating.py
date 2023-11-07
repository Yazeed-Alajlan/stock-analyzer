from database.main import *

def is_consolidating(df, candles=14,percentage=2.5):
    # Get last "n" candlesticks closes
    
    recent_candlesticks = df[-candles:]
    # print(recent_candlesticks)
    max_close = recent_candlesticks['close'].max()
    min_close = recent_candlesticks['close'].min()

    threshold = 1 - (percentage / 100)
    if min_close > (max_close * threshold):
        return True        

    return False

def is_breaking_out(df, candles=14,percentage=2.5):
    last_close = df[-1:]['close'].values[0]
    if is_consolidating(df[:-1], candles=candles,percentage=percentage):
        recent_closes = df[-candles-1:-1]
        if last_close > recent_closes['close'].max():
            return True

    return False

def find_consolidating_stocks(data, candles=14,percentage=2.5):
    stocks = {}
    print(percentage)
    print(candles)
    for symbol in data:
        stock_data = get_price_data(symbol)
        try:
            if(is_consolidating(stock_data,candles=int(candles),percentage=float(percentage))):
                if(is_breaking_out(stock_data,candles=int(candles),percentage=float(percentage))):
                    stocks[symbol]="true"
                else:
                    stocks[symbol]="flase"
        except Exception as e:
            print(f"Failed for symbol {symbol}: {e}")
    return stocks


