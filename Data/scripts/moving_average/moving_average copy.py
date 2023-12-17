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

def calculate_support_resistance(df, sma_period):


    return support_count, resistance_count

# Call your functions to prepare data and calculate bounces
sma_period = 50  # You can set this to your desired SMA period
df = prepData(sma_period)

