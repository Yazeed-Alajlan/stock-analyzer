import numpy as np
import yfinance
import pandas_ta as ta


def normlizeVolume():
    return 1


def normlizeRange(df,norm_lookback=336):
    ## 366 two weeks if df is H
    df['atr'] = ta.atr(np.log(df['high']), np.log(df['low']), np.log(df['close']), norm_lookback) 
    df['norm_range'] = (np.log(df['high']) - np.log(df['low'])) / df['atr']
    return df


def prepData():
    df = yfinance.download('USDT-BTC', start='2018-01-01', end='2022-12-31')
    df = df[df["Volume"] > 0]
    df["vol_norm"] = np.log(df["Volume"] / df["Volume"].rolling(30).median())
    return df