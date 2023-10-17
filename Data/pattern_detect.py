
import talib
import yfinance as yf
import pandas as pd
import ta
import matplotlib.pyplot as plt 


def is_consolidating(df, percentage=2):
    # Get last "n" candlesticks closes
    recent_candlesticks = df[-15:]
    print(recent_candlesticks)
    max_close = recent_candlesticks['Close'].max()
    min_close = recent_candlesticks['Close'].min()

    threshold = 1 - (percentage / 100)
    if min_close > (max_close * threshold):
        return True        

    return False

def is_breaking_out(df, percentage=2.5):
    last_close = df[-1:]['Close'].values[0]

    if is_consolidating(df[:-1], percentage=percentage):
        recent_closes = df[-16:-1]

        if last_close > recent_closes['Close'].max():
            return True

    return False


# def rsi_divergence(data, lookback_period=10):
#     rsi_values = rsi() # Extracting the RSI values
#     divergence_points = []
#     for i in range (lookback_period, len(data)-1):
#         recent_rsi_values = rsi_values [i-lookback_period:i]
#         recent_price_values= data['closel' ].iloc [i-lookback_period:i]
#         if (data['close'].iloc [i]< min (recent_price_values) and rsi_values[i] >= min (recent_rsi_values)) or (data['close'].iloc[i] > max(recent_price_values) and rsi_values[i] <= max(recent_rsi_values)):
#             divergence_points.append (i)
    
#     data['Divergence'] = False
#     data.loc[divergence_points, 'Divergence'] = True
#     return data

def rsi_divergence(data, lookback_period=10):
    rsi_values = data["rsi"] # Extracting the RSI values
    divergence_points = []
    for i in range (lookback_period, len(data)-1):
        recent_rsi_values = rsi_values [i-lookback_period:i]
        recent_price_values= data['Close' ].iloc [i-lookback_period:i]
        if (data['Close'].iloc [i]< min (recent_price_values) and rsi_values[i] >= min (recent_rsi_values)+2) or (data['Close'].iloc[i] > max(recent_price_values) and rsi_values[i] <= max(recent_rsi_values)-2):
            divergence_points.append (i)
    
    data['Divergence'] = False
    data.loc[divergence_points, 'Divergence'] = True
    return data


def rsi():
    df=yf.download("2222.SR", start="2023-01-1", end="2023-10-17")
    # yf.Ticker("2222.SR").history(period="max").reset_index()[["Date","Close"]]
    df["rsi"]=ta.momentum.RSIIndicator(df["Close"],window=14).rsi()

    # print(ta.momentum.RSIIndicator(df["Close"],window=14).rsi())
    # plt.plot(df["Date"],df["rsi"])
    # plt.show()
    return df["rsi"]

df = yf.download("2222.SR", start="2023-01-1", end="2023-10-17")


df["rsi"]=rsi()
print(df)
df["Date"]=df.index
# Create a new index for your DataFrame
df.insert(0, 'Index', range(1, 1 + len(df)))
df.set_index('Index', inplace=True)
df=rsi_divergence(df)
print(df)


print(df)

# print(is_consolidating(df,percentage=5))

close_prices = df['Close']
rsi_values = df['rsi']
divergence_points = df.loc[df['Divergence'] == True]

# Creating the figure and subplots
fig, (ax1, ax2) = plt.subplots(2, 1, sharex=True, figsize =(10,7))

# Plotting the closing prices
ax1.plot(df ['Date'], close_prices)
ax1.set_ylabel('Close Prices')
ax1.tick_params (axis='y')

# Plotting the RSI
ax2.plot(df['Date'], rsi_values, color='red')
ax2.set_ylabel('RSI', color='red')
ax2.tick_params (axis='y', color='red')

# Marking the RSI divergence with red dots
x_values = divergence_points['Date']
y_values = divergence_points['rsi']
ax2.scatter(x_values, y_values, color='black', marker='o')

# Setting labels and title
plt.xlabel('Date')
fig.suptitle('Close Prices and RSI')

# Adjusting the layout
plt.tight_layout()

plt.show()