import numpy as np
import yfinance as yf
import pandas_ta as ta


def normlizeVolume():
    return 1


def normlizeRange(df,norm_lookback=336):
    ## 366 two weeks if df is H
    df['atr'] = ta.atr(np.log(df['high']), np.log(df['low']), np.log(df['close']), norm_lookback) 
    df['norm_range'] = (np.log(df['high']) - np.log(df['low'])) / df['atr']
    return df


def fetch_stock_data(symbol, start_date, end_date):
    df = yf.download(symbol, start=start_date, end=end_date)
    # df = df[df["Volume"] > 0]
    # df["vol_norm"] = np.log(df["Volume"] / df["Volume"].rolling(30).median())
    return df



