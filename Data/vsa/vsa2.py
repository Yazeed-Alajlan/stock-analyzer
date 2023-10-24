import yfinance as yf
import pandas as pd
import talib
import matplotlib.pyplot as plt
import numpy as np
import pandas_ta as ta
import scipy.stats as stats
import mplfinance as mpf

def prepData():
    # Fetch historical data from Yahoo Finance
    df = yf.download("2222.SR", start="2020-01-1", end="2023-10-19")
    df.reset_index(inplace=True)

    # Calculate VSA indicators
    close_prices = df['Adj Close']
    volume = df['Volume']

    # Calculate On Balance Volume (OBV)
    df['OBV'] = talib.OBV(close_prices, volume)
    
    # Calculate Candle Range to Volume Ratio (VAS)
    # df['VAS'] = calculateCandleRangeToVolumeRatio(df)
    df['VAS'] = vsa_indicator(df)
    return df


def vsa_indicator(data: pd.DataFrame, norm_lookback: int = 168):
    # Norm lookback should be fairly large

    atr = ta.atr(data['High'], data['Low'], data['Close'], norm_lookback)
    vol_med = data['Volume'].rolling(norm_lookback).median()

    data['norm_range'] = (data['High'] - data['Low']) / atr 
    data['norm_volume'] = data['Volume'] / vol_med 

    norm_vol = data['norm_volume'].to_numpy()
    norm_range = data['norm_range'].to_numpy()

    range_dev = np.zeros(len(data))
    range_dev[:] = np.nan

    for i in range(norm_lookback * 2, len(data)):
        window = data.iloc[i - norm_lookback + 1: i+ 1]
        slope, intercept, r_val,_,_ = stats.linregress(window['norm_volume'], window['norm_range'])

        if slope <= 0.0 or r_val < 0.2:
            range_dev[i] = 0.0
            continue
       
        pred_range = intercept + slope * norm_vol[i]
        range_dev[i] = norm_range[i] - pred_range
    print(range_dev)
    return pd.Series(range_dev, index=data.index)


def calculateCandleRangeToVolumeRatio(df):
    # Calculate the candle's price range (high - low)
    candle_range = df['High'] - df['Low']
    
    # Calculate the ratio of candle range to trading volume (Candle Range to Volume Ratio)
    range_to_volume_ratio = candle_range / df['Volume']
    
    return range_to_volume_ratio

import matplotlib.pyplot as plt

def plotVSAIndicators(df):
    # Create a single figure for all VSA indicators
    plt.figure(figsize=(12, 6))

    # Plot Price on the first subplot
    plt.subplot(3, 1, 1)
    plt.plot(df['Date'], df['Close'], label='Price')
    plt.title('Price')
    plt.legend()

    # Plot On Balance Volume (OBV) on the second subplot
    plt.subplot(3, 1, 2)
    plt.plot(df['Date'], df['OBV'], label='OBV')
    plt.title('On Balance Volume (OBV)')
    plt.legend()

    # Plot Candle Range to Volume Ratio (VAS) on the third subplot
    plt.subplot(3, 1, 3)
    plt.plot(df['Date'], df['VAS'], label='VAS')
    plt.title('Candle Range to Volume Ratio (VAS)')
    plt.legend()

    plt.tight_layout()
    plt.show()


# Example usage
data = prepData()
plotVSAIndicators(data)
