import yfinance

def is_consolidating(df, candles=14,percentage=2.5):
    # Get last "n" candlesticks closes
    
    recent_candlesticks = df[-candles:]
    # print(recent_candlesticks)
    max_close = recent_candlesticks['Close'].max()
    min_close = recent_candlesticks['Close'].min()

    threshold = 1 - (percentage / 100)
    if min_close > (max_close * threshold):
        return True        

    return False

def is_breaking_out(df, candles=14,percentage=2.5):
    last_close = df[-1:]['Close'].values[0]
    if is_consolidating(df[:-1], candles=candles,percentage=percentage):
        recent_closes = df[-candles-1:-1]
        if last_close > recent_closes['Close'].max():
            return True

    return False




def prepData():
    df=yfinance.download("2222.SR", start="2021-01-1", end="2023-08-08")
    df.reset_index(inplace=True)
    ## Start index with 1
    # df.index = np.arange(1, len(df) + 1)
    return df

df=prepData()
print(is_breaking_out(df))
