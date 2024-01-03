import talib
import pandas as pd
import yfinance as yf
import matplotlib.pyplot as plt
import numpy as np
from database.main import *




# Fetching historical data for two stocks
stock1 = yf.download('AAPL', start='2022-01-01', end='2022-12-31')
stock2 = yf.download('MSFT', start='2022-01-01', end='2022-12-31')

# Extracting the close prices for each stock
close_price_stock1 = stock1['Close']
close_price_stock2 = stock2['Close']

# Aligning the two series to ensure the same length
close_price_stock1, close_price_stock2 = close_price_stock1.align(close_price_stock2, join='inner')

#TSF - Time Series Forecast

Forecast = talib.TSF(close_price_stock1,timeperiod=14)
print(Forecast)


# Calculating Pearson correlation coefficient using talib.CORREL
correlation = talib.CORREL(close_price_stock1, close_price_stock2)

corr_coef = np.corrcoef(close_price_stock1, close_price_stock2)
print(corr_coef)

covariance = close_price_stock1.cov(close_price_stock2)
std_dev_stock1 = close_price_stock1.std()
std_dev_stock2 = close_price_stock2.std()
correlation_coefficient = covariance / (std_dev_stock1 * std_dev_stock2)
print(correlation_coefficient)



# Plotting the correlation values and stock prices
fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 8), sharex=True)

# Plotting stock prices
ax1.plot(close_price_stock1.index, close_price_stock1.values, label='AAPL')
ax1.plot(close_price_stock2.index, close_price_stock2.values, label='MSFT')
ax1.set_ylabel('Stock Prices')
ax1.legend()

# Plotting correlation
ax2.plot(correlation.index, correlation.values)
ax2.set_ylabel('Correlation')
ax2.set_xlabel('Date')

plt.suptitle('Stock Prices and Correlation between AAPL and MSFT')
plt.show()
