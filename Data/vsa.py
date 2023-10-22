import pandas as pd
import pandas_ta as ta
import numpy as np
import scipy.stats as stats
import matplotlib.pyplot as plt
import mplfinance as mpf
import yfinance as yf


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
        
    return pd.Series(range_dev, index=data.index)


def plot_around(data: pd.DataFrame, i: int, above: bool, threshold: float = 0.90):
    if above:
        extremes = data[data['dev'] > threshold]
    else:
        extremes = data[data['dev'] < -threshold]
    if i >= len(extremes):
        raise ValueError(f"i is too big, use less than {len(extremes)}")
    t =  extremes.index[i]
    td = pd.Timedelta(hours=24)
    surrounding = data.loc[t - td: t + td]
    
    plt.style.use('dark_background')
    fig, axs = plt.subplots(3, sharex=True, height_ratios=[3, 1, 1])
    add = mpf.make_addplot(surrounding['dev'], ax=axs[2], title='VSA Indicator')
    axs[1].set_title('Volume')
    mco = [None] * len(surrounding)
    mpf.plot(surrounding, volume=axs[1], type='candle', style='charles', ax=axs[0], addplot=[add], marketcolor_overrides=mco,mco_faceonly=False)
    plt.show()


# data = pd.read_csv('BTCUSDT3600.csv')
# data = data.rename(columns={'open': 'Open', 'high': 'High', 'low': 'Low', 'close': 'Close', 'volume': 'Volume'})
# data['date'] = data['date'].astype('datetime64[s]')
# data = data.set_index('date')

data = yf.download('2222.SR', start='2023-01-01', end='2023-10-01', interval='1h')
data['Datetime'] = data.index  # Create a new column with the datetime index
data['Datetime'] = pd.to_datetime(data['Datetime'])  # Convert the 'Datetime' column to a datetime data type

data = data.set_index('Datetime')
print(data)
data['dev'] = vsa_indicator(data, 168)

plot_around(data, 3, False, 1.0)


