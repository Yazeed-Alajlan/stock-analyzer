import pandas as pd
import numpy as np
import pandas_ta as ta
import matplotlib.pyplot as plt
import scipy 
import yfinance as yf
import seaborn as sns


def find_hawkes_process(data, kappa= 0.1,norm_lookback=336,rolling=168):
    # Normalize volume
    data['atr'] = ta.atr(np.log(data['high']), np.log(data['low']), np.log(data['close']), norm_lookback) 
    data['norm_range'] = (np.log(data['high']) - np.log(data['low'])) / data['atr']

    assert(kappa > 0.0)
    alpha = np.exp(-kappa)
    arr = data['norm_range'].to_numpy()
    output = np.zeros(len(data['norm_range']))
    output[:] = np.nan
    for i in range(1, len(data['norm_range'])):
        if np.isnan(output[i - 1]):
            output[i] = arr[i]
        else:
            output[i] = output[i - 1] * alpha + arr[i]

    data['v_hawk']=pd.Series(output, index=data.index) * kappa
    data['q05'] = data['v_hawk'].rolling(rolling).quantile(0.05)
    data['q95'] = data['v_hawk'].rolling(rolling).quantile(0.95)
    return data



def vol_signal(close: pd.Series, vol_hawkes: pd.Series, lookback:int):
    signal = np.zeros(len(close))
    q05 = vol_hawkes.rolling(lookback).quantile(0.05)
    q95 = vol_hawkes.rolling(lookback).quantile(0.95)
    
    last_below = -1
    curr_sig = 0

    for i in range(len(signal)):
        if vol_hawkes.iloc[i] < q05.iloc[i]:
            last_below = i
            curr_sig = 0

        if vol_hawkes.iloc[i] > q95.iloc[i] \
           and vol_hawkes.iloc[i - 1] <= q95.iloc[i - 1] \
           and last_below > 0 :
            
            change = close.iloc[i] - close.iloc[last_below]
            if change > 0.0:
                curr_sig = 1
            else:
                curr_sig = -1
        signal[i] = curr_sig

    return signal

def get_trades_from_signal(data: pd.DataFrame, signal: np.array):
    # Gets trade entry and exit times from a signal
    # that has values of -1, 0, 1. Denoting short,flat,and long.
    # No position sizing.

    long_trades = []
    short_trades = []

    close_arr = data['close'].to_numpy()
    last_sig = 0.0
    open_trade = None
    idx = data.index
    for i in range(len(data)):
        if signal[i] == 1.0 and last_sig != 1.0: # Long entry
            if open_trade is not None:
                open_trade[2] = idx[i]
                open_trade[3] = close_arr[i]
                short_trades.append(open_trade)

            open_trade = [idx[i], close_arr[i], -1, np.nan]
        if signal[i] == -1.0  and last_sig != -1.0: # Short entry
            if open_trade is not None:
                open_trade[2] = idx[i]
                open_trade[3] = close_arr[i]
                long_trades.append(open_trade)

            open_trade = [idx[i], close_arr[i], -1, np.nan]
        
        if signal[i] == 0.0 and last_sig == -1.0: # Short exit
            open_trade[2] = idx[i]
            open_trade[3] = close_arr[i]
            short_trades.append(open_trade)
            open_trade = None

        if signal[i] == 0.0  and last_sig == 1.0: # Long exit
            open_trade[2] = idx[i]
            open_trade[3] = close_arr[i]
            long_trades.append(open_trade)
            open_trade = None

        last_sig = signal[i]

    long_trades = pd.DataFrame(long_trades, columns=['entry_time', 'entry_price', 'exit_time', 'exit_price'])
    short_trades = pd.DataFrame(short_trades, columns=['entry_time', 'entry_price', 'exit_time', 'exit_price'])

    long_trades['percent'] = (long_trades['exit_price'] - long_trades['entry_price']) / long_trades['entry_price']
    short_trades['percent'] = -1 * (short_trades['exit_price'] - short_trades['entry_price']) / short_trades['entry_price']
    long_trades = long_trades.set_index('entry_time')
    short_trades = short_trades.set_index('entry_time')
    return long_trades, short_trades



def plot_price_and_hawkes(data):
    data['q05'] = data['v_hawk'].rolling(168).quantile(0.05)
    data['q95'] = data['v_hawk'].rolling(168).quantile(0.95)
    plt.figure(figsize=(12, 6))

    # data = data['2020-05-01':'2020-11-01']

    # Create the first y-axis for price data
    ax1 = plt.gca()
    ax1.plot(data.index, (data['close']), color='blue', label='Price Data')
    ax1.set_xlabel('Date')
    ax1.set_ylabel('Log Price', color='blue')

    # Create the second y-axis for the Hawkes Process
    ax2 = ax1.twinx()
    ax2.plot(data.index, data['v_hawk'], color='green', label='Hawkes Process')
    ax2.set_ylabel('Hawkes Process Value', color='green')

    # Create the third y-axis for q05 and q95
    # ax1.fill_between(data.index, data['q05'], data['q95'], color='orange', alpha=0.5, label='Q05-Q95 Range')

    # Set a common title
    plt.title('Price Data, Hawkes Process, and Quantiles Chart')
    plt.grid(True)

    # Show a legend for all series
    lines1, labels1 = ax1.get_legend_handles_labels()
    lines2, labels2 = ax2.get_legend_handles_labels()
    ax1.legend(lines1 + lines2, labels1 + labels2, loc='upper left')

    # Show the plot
    plt.show()


# data = pd.read_csv('BTCUSDT3600.csv')
# data['date'] = data['date'].astype('datetime64[s]')
# data = data.set_index('date')

## norm_lookback and rolling for Daily (14, 7) ,Hourly (336, 168) respectively.
# data =hawkes_process(data, kappa=0.1,norm_lookback=14,rolling=7)
# data =hawkes_process(data, kappa=0.1,norm_lookback=336,rolling=168)
# data['sig'] = vol_signal(data['close'], data['v_hawk'], 168)

# print(data)
# plot_price_and_hawkes(data)







