import yfinance as yf
import pandas as pd
import talib
import matplotlib.pyplot as plt

# Fetch data using yfinance
stock_data = yf.download('AAPL', start='2021-01-01', end='2022-01-01')

# Extract the 'Close' prices
closing_prices = stock_data['Close']

# Calculate Time Series Forecast using TA-Lib
time_period = 50
tsf_values = talib.TSF(closing_prices, timeperiod=time_period)

# Plotting
plt.figure(figsize=(10, 6))
plt.plot(stock_data.index, closing_prices, label='Closing Prices')
plt.plot(stock_data.index, tsf_values, label=f'TSF ({time_period})', color='red')
plt.title('AAPL Stock Price with Time Series Forecast (TSF)')
plt.xlabel('Date')
plt.ylabel('Price')
plt.legend()
plt.show()
