import yfinance as yf
import talib
import matplotlib.pyplot as plt

def prepData(sma_period):
    df = yf.download("2222.SR", start="2020-01-01", end="2023-10-19")
    df.reset_index(inplace=True)

    atr_period = 14
    df['ATR'] = talib.ATR(df['High'], df['Low'], df['Close'], timeperiod=atr_period)
    df[f'SMA_{sma_period}'] = talib.SMA(df['Close'], timeperiod=sma_period)

    # Calculate upper and lower bounds
    df['Upper_Bound'] = df[f'SMA_{sma_period}'] + 0.5 * df['ATR']
    df['Lower_Bound'] = df[f'SMA_{sma_period}'] - 0.5 * df['ATR']

    return df

def calculate_bounces(df, sma_period):
    bounce_count = 0
    bounce_indices = []
    in_downtrend = df['Close'] < df[f'SMA_{sma_period}']

    for i in range(1, len(df)):
        in_downtrend = df['Close'][i] < df[f'SMA_{sma_period}'][i]
        if in_downtrend:
            if df['Close'][i] < df['Lower_Bound'][i]:
                bounce_count += 1
                bounce_indices.append(i)
        elif df['Close'][i] > df[f'SMA_{sma_period}'][i]:
            bounce_count += 1
            bounce_indices.append(i)

    return bounce_count, bounce_indices

# Call your functions to prepare data and calculate bounces
sma_period = 50  # You can set this to your desired SMA period
df = prepData(sma_period)
bounce_count, bounce_indices = calculate_bounces(df, sma_period)

# Plot the data
plt.figure(figsize=(12, 6))
plt.plot(df['Date'], df['Close'], label='Price')
plt.plot(df['Date'], df[f'SMA_{sma_period}'], label=f'SMA {sma_period}')
plt.plot(df['Date'][bounce_indices], df['Close'][bounce_indices], 'ro', label='Bounces')
plt.fill_between(df['Date'], df['Lower_Bound'], df['Upper_Bound'], alpha=0.3, color='gray', label='Bollinger Bands')
plt.title(f'SMA {sma_period} Bounce Analysis')
plt.xlabel('Date')
plt.ylabel('Price')
plt.legend()
plt.grid(True)
plt.show()
