import yfinance as yf
import talib
import matplotlib.pyplot as plt

def prepData(sma_period):
    df = yf.download("2222.SR", start="2020-01-1", end="2023-10-19")
    df.reset_index(inplace=True)

    atr_period = 14
    df['ATR'] = talib.ATR(df['High'], df['Low'], df['Close'], timeperiod=atr_period)
    df[f'SMA_{sma_period}'] = talib.SMA(df['Close'], timeperiod=sma_period)

    # Calculate upper and lower bounds
    df['Upper_Bound'] = df[f'SMA_{sma_period}'] + 0.5 * df['ATR']
    df['Lower_Bound'] = df[f'SMA_{sma_period}'] - 0.5 * df['ATR']

    return df

def calculateBreakouts(df, sma_period):
    breakout_count = 0
    breakout_indices = []
    is_in_breakout = False
    
    for i in range(1, len(df)):
        if df['Close'][i] < df['Lower_Bound'][i] and not is_in_breakout:
            breakout_count += 1
            is_in_breakout = True
            breakout_indices.append(i)
        elif df['Close'][i] > df[f'SMA_{sma_period}'][i]:
            is_in_breakout = False
            
    return breakout_count, breakout_indices

def calculatePenetrations(df, sma_period):
    penetration_count = 0
    penetration_indices = []
    is_in_penetration = False
    
    for i in range(1, len(df)):
        if df['Close'][i] > df['Upper_Bound'][i] and not is_in_penetration:
            penetration_count += 1
            is_in_penetration = True
            penetration_indices.append(i)
        elif df['Close'][i] < df[f'SMA_{sma_period}'][i]:
            is_in_penetration = False
            
    return penetration_count, penetration_indices

def calculateBounces(df, sma_period):
    bounce_count = 0
    bounce_indices = []
    is_in_bounce = False
    bounce_possibility=False

    for i in range(1, len(df)):
        in_downtrend = df['Close'][i] < df[f'SMA_{sma_period}'][i]
        if in_downtrend:
            if  df['Upper_Bound'][i] >= df['Close'][i] >= df['Lower_Bound'][i]:
                bounce_possibility=True
            elif df['Close'][i] < df['Lower_Bound'][i] and bounce_possibility:
                bounce_count += 1
                bounce_possibility=False
                bounce_indices.append(i)
            else:
                bounce_possibility=False

        else:
            if  df['Upper_Bound'][i] >= df['Close'][i] >= df['Lower_Bound'][i]:
                bounce_possibility=True
            elif df['Close'][i] > df['Upper_Bound'][i] and bounce_possibility:
                bounce_count += 1
                bounce_possibility=False
                bounce_indices.append(i)
            else:
                bounce_possibility=False
            
    return bounce_count, bounce_indices


def findBestSMA(max_period):
    best_sma = 0
    best_count = 0

    for sma_period in range(19, max_period):
        data = prepData(sma_period)
        breakout_count, _ = calculateBreakouts(data, sma_period)
        penetration_count, _ = calculatePenetrations(data, sma_period)
        total_count = breakout_count + penetration_count 
        print(f"SMA_{sma_period} Breakouts: {breakout_count}, Penetrations: {penetration_count}")
        if total_count > best_count:
            best_count = total_count
            best_sma = sma_period

    return best_sma, best_count


max_sma_period = 20
best_sma, best_count = findBestSMA(max_sma_period)

data = prepData(best_sma)


# Create a Matplotlib figure and axis
fig, ax = plt.subplots(figsize=(12, 6))

# Plot the Close price
ax.plot(data['Date'], data['Close'], label='Close Price', color='blue')

# Plot the best SMA
ax.plot(data['Date'], data[f'SMA_{best_sma}'], label=f'Best SMA ({best_sma}-period)', color='red')

# Fill the area between upper and lower bounds
ax.fill_between(data['Date'], data['Lower_Bound'], data['Upper_Bound'], color='yellow', alpha=0.5, label='Upper/Lower Bounds')

# Add markers for breakouts
# breakout_count, breakout_indices = calculateBreakouts(data, best_sma)
# breakout_dates = data['Date'][breakout_indices]
# breakout_prices = data['Close'][breakout_indices]
# ax.scatter(breakout_dates, breakout_prices, marker='^', color='green', label='Breakout')

# Add markers for penetrations
# penetration_count, penetration_indices = calculatePenetrations(data, best_sma)
# penetration_dates = data['Date'][penetration_indices]
# penetration_prices = data['Close'][penetration_indices]
# ax.scatter(penetration_dates, penetration_prices, marker='v', color='red', label='Penetration')

# Add markers for bounces
bounce_count, bounce_indices = calculateBounces(data, best_sma)
bounce_dates = data['Date'][bounce_indices]
bounce_prices = data['Close'][bounce_indices]
ax.scatter(bounce_dates, bounce_prices, marker='v', color='black', label='Bounce')

# Annotate points with close prices
# for i in range(len(breakout_indices)):
#     ax.annotate(f'{breakout_prices.iloc[i]:.2f}', (breakout_dates.iloc[i], breakout_prices.iloc[i]), textcoords="offset points", xytext=(0, 10), ha='center')

# Add circles for the close price without displaying the value
ax.scatter(data['Date'], data['Close'], s=20, marker='o', color='black')

# for i in range(len(data)):
#     ax.annotate(f'{data["Close"].iloc[i]:.2f}', (data["Date"].iloc[i], data["Close"].iloc[i]), textcoords="offset points", xytext=(0, 10), ha='center')

for i in range(len(bounce_indices)):
    ax.annotate(f'{bounce_prices.iloc[i]:.2f}', (bounce_dates.iloc[i], bounce_prices.iloc[i]), textcoords="offset points", xytext=(0, 10), ha='center')

# Set labels and title
ax.set_xlabel('Date')
ax.set_ylabel('Price')
ax.set_title(f'Stock Price and {best_sma}-period SMA with 2.5% Bounds')

# Add a legend
ax.legend()

# Show the plot
plt.show()

print(f"The best SMA period is {best_sma} with a total count of {best_count} breakouts, {penetration_count} penetrations, and {bounce_count} bounces.")