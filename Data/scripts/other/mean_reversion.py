import yfinance as yf
import pandas as pd 
import numpy as np
import matplotlib.pyplot as plt
import talib 

df =yf.download ('SQ', start='2019-01-01', end="2022-08-13")
df ['ma_20'] = df.Close.rolling (20).mean()
df ['close_std'] = df.Close.rolling (20).std()
df ['upper_bb'] = df.ma_20 + (2 * df.close_std)
df ['lower_bb'] = df.ma_20 - (2 * df.close_std)

df['rsi'] = talib.RSI(df['Close'], timeperiod=6)
conditions=[(df.rsi < 30)& (df.Close < df.lower_bb),(df.rsi > 70) & (df.Close > df.upper_bb)]
choices=["Buy","Sell"]
df["signal"] = np.select(conditions,choices)
df["signal_shifted"] = df.signal.shift()
df.dropna(inplace=True)


position=False
buy_dates, sell_dates=[] ,[]
buy_prices, sell_prices=[] ,[]

df["shifted_Close"]=df.Close.shift()
for index,row in df.iterrows():
    if not position and row["signal_shifted"]=="Buy":
        buy_dates.append(index)
        buy_prices.append(row.Open)
        position= True
    if  position:
        if  row["signal_shifted"]=="Sell" or row.shifted_Close < 0.95 * buy_prices[-1]:
            sell_dates.append(index)
            sell_prices.append(row.Open)
            position= False

# Calculating the returns using list comprehension
returns = [(sell - buy) / buy for sell, buy in zip(sell_prices, buy_prices)]

# Adding 1 to each return, calculating the cumulative product, and subtracting 1 at the end
result = pd.Series(returns).add(1).prod() - 1

print(result)

# print(df.tail(50))

# Plotting
plt.figure(figsize=(10, 6))
plt.plot(df['Close'], label='Close Price')
plt.scatter(df.loc[buy_dates].index,df.loc[buy_dates].Close,marker="^",c="g")
plt.scatter(df.loc[sell_dates].index,df.loc[sell_dates].Close,marker="v",c="r")
# plt.plot(df['ma_20'], label='20-day MA')
# plt.plot(df['upper_bb'], label='Upper Bollinger Band')
# plt.plot(df['lower_bb'], label='Lower Bollinger Band')
# plt.plot(df['rsi'], label='Lower Bollinger Band')
plt.legend()
plt.show()