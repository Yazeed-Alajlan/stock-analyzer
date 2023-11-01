import numpy as np
import yfinance


def normlizeVolume():
    return 1


def prepData():
    df = yfinance.download('USDT-BTC', start='2018-01-01', end='2022-12-31')
    df = df[df["Volume"] > 0]
    df["vol_norm"] = np.log(df["Volume"] / df["Volume"].rolling(30).median())
    return df