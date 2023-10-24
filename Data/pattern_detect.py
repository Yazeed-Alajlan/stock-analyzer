import talib
import yfinance as yf
import pandas as pd
import numpy as np
import ta
import matplotlib.pyplot as plt 
import plotly.graph_objects as go
from plotly.subplots import make_subplots
from datetime import datetime
import stumpy
import matplotlib.pyplot as plt

def is_consolidating(df, percentage=2):
    # Get last "n" candlesticks closes
    recent_candlesticks = df[-15:]
    # print(recent_candlesticks)
    max_close = recent_candlesticks['Close'].max()
    min_close = recent_candlesticks['Close'].min()

    threshold = 1 - (percentage / 100)
    if min_close > (max_close * threshold):
        return True        

    return False

def is_breaking_out(df, percentage=2.5):
    last_close = df[-1:]['Close'].values[0]
    print(last_close)
    if is_consolidating(df[:-1], percentage=percentage):
        recent_closes = df[-16:-1]

        if last_close > recent_closes['Close'].max():
            return True

    return False

def pattern_recognition(df,m,k):
    # Assuming you already have your stock price data in a DataFrame named 'df'
    # Extract the 'Close' prices as a numpy array
    stock_prices = df['Close'].to_numpy()
    # K is Number of motifs to display, adjust as needed
    # M is Set the motif length (adjust as needed)

    # Compute the matrix profile
    matrix_profile = stumpy.stump(stock_prices, m=m)

    # Identify motifs based on the matrix profile values
    motif_indices = np.argsort(matrix_profile[:, 0])[:k]

    # Create a plot to visualize the motifs
    plt.figure(figsize=(12, 6))
    plt.plot(stock_prices, label='Stock Prices', color='b')

    # Define colors for the motifs
    colors = ['g', 'r', 'c', 'm', 'y']

    for i, idx in enumerate(motif_indices):
        motif_start = idx
        motif_end = idx + m
        motif_values = stock_prices[motif_start:motif_end]

        # Plot each motif in a different color
        plt.plot(range(motif_start, motif_end), motif_values, label=f'Motif {i + 1}', color=colors[i])

    plt.xlabel('Time')
    plt.ylabel('Stock Price')
    plt.legend()
    plt.title('Stock Price with Motifs')
    plt.show()

def prepData():
    df=yf.download("2222.SR", start="2020-01-1", end="2023-07-7")
    df.reset_index(inplace=True)
    ## Start index with 1
    # df.index = np.arange(1, len(df) + 1)
    return df

df=prepData()
print(is_consolidating(df, percentage=3))
print(is_breaking_out(df, percentage=3))
