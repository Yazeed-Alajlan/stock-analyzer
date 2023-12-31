import talib
import yfinance as yf
import pandas as pd
import numpy as np
import ta
import matplotlib.pyplot as plt 
import plotly.graph_objects as go
from plotly.subplots import make_subplots
from datetime import datetime


def rsi():
    df=yf.download("2222.SR", start="2023-01-1", end="2023-10-17")
    # yf.Ticker("2222.SR").history(period="max").reset_index()[["Date","Close"]]
    df["rsi"]=ta.momentum.RSIIndicator(df["Close"],window=14).rsi()

    # print(ta.momentum.RSIIndicator(df["Close"],window=14).rsi())
    # plt.plot(df["Date"],df["rsi"])
    # plt.show()
    return df["rsi"]


def prepData():
    df=yf.download("2222.SR", start="2023-01-1", end="2023-10-17")
    df["rsi"]=rsi()
    df.reset_index(inplace=True)
    ## Start index with 1
    # df.index = np.arange(1, len(df) + 1)
    print(df)
    return df




# RSI Divergence ------------------------------------------------------------------------------------------------------------------------
def rsiDiverPlot(df):
    dfpl = df
    #pivotid(df,28145,5,5)
    df['pivot'] = df.apply(lambda x: pivotid(df, x.name,6,6), axis=1)
    df['RSIpivot'] = df.apply(lambda x: RSIpivotid(df, x.name, 6, 6), axis=1)
    df['pointpos'] = df.apply(lambda row: pointpos(row), axis=1)
    df['RSIpointpos'] = df.apply(lambda row: RSIpointpos(row), axis=1)

    backcandles= 60
    #candleid = 8800
    candleid = 85

    maxim = np.array([])
    minim = np.array([])
    xxmin = np.array([])
    xxmax = np.array([])

    maximRSI = np.array([])
    minimRSI = np.array([])
    xxminRSI = np.array([])
    xxmaxRSI = np.array([])

    for i in range(candleid-backcandles, candleid+1):
        if df.iloc[i].pivot == 1:
            minim = np.append(minim, df.iloc[i].Low)
            xxmin = np.append(xxmin, i) #could be i instead df.iloc[i].name
        if df.iloc[i].pivot == 2:
            maxim = np.append(maxim, df.iloc[i].High)
            xxmax = np.append(xxmax, i) # df.iloc[i].name
        if df.iloc[i].RSIpivot == 1:
            minimRSI = np.append(minimRSI, df.iloc[i].rsi)
            xxminRSI = np.append(xxminRSI, df.iloc[i].name)
        if df.iloc[i].RSIpivot == 2:
            maximRSI = np.append(maximRSI, df.iloc[i].rsi)
            xxmaxRSI = np.append(xxmaxRSI, df.iloc[i].name)
            
    slmin, intercmin = np.polyfit(xxmin, minim,1)
    slmax, intercmax = np.polyfit(xxmax, maxim,1)
    slminRSI, intercminRSI = np.polyfit(xxminRSI, minimRSI,1)
    slmaxRSI, intercmaxRSI = np.polyfit(xxmaxRSI, maximRSI,1)

    print(slmin, slmax, slminRSI, slmaxRSI)


    dfpl = df[candleid-backcandles-5:candleid+backcandles]
    fig = make_subplots(rows=2, cols=1)
    fig.append_trace(go.Candlestick(x=dfpl.index,
                    open=dfpl['Open'],
                    high=dfpl['High'],
                    low=dfpl['Low'],
                    close=dfpl['Close']), row=1, col=1)
    fig.add_scatter(x=dfpl.index, y=dfpl['pointpos'], mode="markers",
                    marker=dict(size=4, color="MediumPurple"),
                    name="pivot", row=1, col=1)
    fig.add_trace(go.Scatter(x=xxmin, y=slmin*xxmin + intercmin, mode='lines', name='min slope'), row=1, col=1)
    fig.add_trace(go.Scatter(x=xxmax, y=slmax*xxmax + intercmax, mode='lines', name='max slope'), row=1, col=1)

    fig.append_trace(go.Scatter(x=dfpl.index, y=dfpl['rsi']), row=2, col=1)
    fig.add_scatter(x=dfpl.index, y=dfpl['RSIpointpos'], mode="markers",
                    marker=dict(size=2, color="MediumPurple"),
                    name="pivot", row=2, col=1)
    fig.add_trace(go.Scatter(x=xxminRSI, y=slminRSI*xxminRSI + intercminRSI, mode='lines', name='min slope'), row=2, col=1)
    fig.add_trace(go.Scatter(x=xxmaxRSI, y=slmaxRSI*xxmaxRSI + intercmaxRSI, mode='lines', name='max slope'), row=2, col=1)

    fig.update_layout(xaxis_rangeslider_visible=False)
    fig.show()

def pivotid(df1, l, n1, n2): #n1 n2 before and after candle l
    if l-n1 < 0 or l+n2 >= len(df1):
        return 0
    
    pividlow=1
    pividhigh=1
    for i in range(l-n1, l+n2+1):
        if(df1.Low[l]>df1.Low[i]):
            pividlow=0
        if(df1.High[l]<df1.High[i]):
            pividhigh=0
    if pividlow and pividhigh:
        return 3
    elif pividlow:
        return 1
    elif pividhigh:
        return 2
    else:
        return 0

def RSIpivotid(df1, l, n1, n2): #n1 n2 before and after candle l
    if l-n1 < 0 or l+n2 >= len(df1):
        return 0

    pividlow=1
    pividhigh=1
    for i in range(l-n1, l+n2+1):
        if(df1.rsi[l]>df1.rsi[i]):
            pividlow=0
        if(df1.rsi[l]<df1.rsi[i]):
            pividhigh=0
    if pividlow and pividhigh:
        return 3
    elif pividlow:
        return 1
    elif pividhigh:
        return 2
    else:
        return 0 


def pointpos(x):
    if x['pivot']==1:
        return x['Low']-1e-3
    elif x['pivot']==2:
        return x['High']+1e-3
    else:
        return np.nan

def RSIpointpos(x):
    if x['RSIpivot']==1:
        return x['rsi']-1
    elif x['RSIpivot']==2:
        return x['rsi']+1
    else:
        return np.nan

#--------------------------------------------------------------------------------------------------------------------------------
df=prepData()

rsiDiverPlot(df)
# print(is_consolidating(df,percentage=5))




