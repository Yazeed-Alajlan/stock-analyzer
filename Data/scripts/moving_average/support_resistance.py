import yfinance as yf
import pandas as pd
import ta
import matplotlib.pyplot as plt

# Fetching stock data
stock_symbol = 'AAPL'  # Change to any stock symbol
start_date = '2022-01-01'
end_date = '2023-12-31'
stock_data = yf.download(stock_symbol, start=start_date, end=end_date)

# Define parameters
ma_length = 50
atr_length = 14
band_multiplier = 0.5

# Calculate moving averages
stock_data['SMA'] = stock_data['Close'].rolling(window=ma_length).mean()

# Calculate ATR
stock_data['ATR'] = ta.volatility.average_true_range(stock_data['High'], stock_data['Low'], stock_data['Close'], window=atr_length)

# Calculate upper and lower bands
stock_data['Upper_Band'] = stock_data['SMA'] + (stock_data['ATR'] * band_multiplier)
stock_data['Lower_Band'] = stock_data['SMA'] - (stock_data['ATR'] * band_multiplier)

# Identify price movements and interactions with bands
stock_data['Above_MA'] = stock_data['Close'] > stock_data['SMA']
stock_data['Inside_Bands'] = (stock_data['Close'] < stock_data['Upper_Band']) & (stock_data['Close'] > stock_data['Lower_Band'])
stock_data['Above_Upper_Band'] = stock_data['Close'] > stock_data['Upper_Band']
stock_data['Below_Lower_Band'] = stock_data['Close'] < stock_data['Lower_Band']

# Initialize flags for bounce and penetration
stock_data['Bounce'] = 0
stock_data['Penetration'] = 0

# Identify bounces and penetrations
for i in range(1, len(stock_data)):
    if stock_data['Above_MA'].iloc[i] and stock_data['Inside_Bands'].iloc[i]:
        if stock_data['Above_Upper_Band'].iloc[i - 1] and not stock_data['Above_Upper_Band'].iloc[i]:
            stock_data.at[stock_data.index[i], 'Bounce'] = 1
    elif not stock_data['Above_MA'].iloc[i] and stock_data['Inside_Bands'].iloc[i]:
        if stock_data['Below_Lower_Band'].iloc[i - 1] and not stock_data['Below_Lower_Band'].iloc[i]:
            stock_data.at[stock_data.index[i], 'Bounce'] = 1

    if stock_data['Above_MA'].iloc[i] and not stock_data['Inside_Bands'].iloc[i]:
        if not stock_data['Above_Upper_Band'].iloc[i]:
            stock_data.at[stock_data.index[i], 'Penetration'] = 1
    elif not stock_data['Above_MA'].iloc[i] and not stock_data['Inside_Bands'].iloc[i]:
        if not stock_data['Below_Lower_Band'].iloc[i]:
            stock_data.at[stock_data.index[i], 'Penetration'] = 1

# Count bounces and penetrations
num_bounces = stock_data['Bounce'].sum()
num_penetrations = stock_data['Penetration'].sum()

print(f"Number of Bounces: {num_bounces}")
print(f"Number of Penetrations: {num_penetrations}")

# Get indices of bounces and penetrations
bounce_indices = stock_data[stock_data['Bounce'] == 1].index.tolist()
penetration_indices = stock_data[stock_data['Penetration'] == 1].index.tolist()

print("Bounce Indices:", bounce_indices)
print("Penetration Indices:", penetration_indices)

# Plotting the graph
plt.figure(figsize=(12, 6))
plt.plot(stock_data['Close'], label='Close Price')
plt.plot(stock_data['SMA'], label=f'SMA {ma_length}', linestyle='--')
plt.plot(stock_data['Upper_Band'], label='Upper Band', linestyle='--', color='red')
plt.plot(stock_data['Lower_Band'], label='Lower Band', linestyle='--', color='green')

plt.scatter(bounce_indices, stock_data.loc[bounce_indices]['Close'], marker='^', color='blue', label='Bounces')
plt.scatter(penetration_indices, stock_data.loc[penetration_indices]['Close'], marker='v', color='orange', label='Penetrations')

plt.legend()
plt.title(f'{stock_symbol} Stock Price with Support/Resistance Analysis')
plt.xlabel('Date')
plt.ylabel('Price')
plt.show()
