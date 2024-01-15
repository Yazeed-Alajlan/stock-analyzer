import talib
import pandas as pd
import yfinance as yf
import matplotlib.pyplot as plt

# Fetch stock data
symbol = '1180.SR'
start_date = '2020-01-01'
end_date = '2024-01-10'
data = yf.download(symbol, start=start_date, end=end_date)

# Extract closing prices
closing_prices = data['Close']

# Calculate SMA and ATR
sma_periods = [50]  # Define a range of SMA values to test
atr_period = 14

# Initialize variables to keep track of best SMA and intersections
best_sma = None
best_sma_intersections = 0
best_sma_indices_above = []
best_sma_indices_below = []

for sma_period in sma_periods:
    sma = talib.SMA(closing_prices, timeperiod=sma_period)
    atr = talib.ATR(data['High'], data['Low'], closing_prices, timeperiod=atr_period)

    upper_bound = sma + 0.5 * atr
    lower_bound = sma - 0.5 * atr

    initially_above = closing_prices.shift(1) <= upper_bound.shift(1)
    initially_below = closing_prices.shift(1) >= lower_bound.shift(1)

    above_bound = closing_prices > upper_bound
    below_bound = closing_prices < lower_bound

    crossed_upper = initially_above & above_bound
    crossed_lower = initially_below & below_bound

    above_bound_indices = crossed_upper[crossed_upper == True].index.tolist()
    below_bound_indices = crossed_lower[crossed_lower == True].index.tolist()

    # Count intersections
    total_intersections = len(above_bound_indices) + len(below_bound_indices)

    # Update best SMA if current SMA has more intersections
    if total_intersections > best_sma_intersections:
        best_sma_intersections = total_intersections
        best_sma = sma_period
        best_sma_indices_above = above_bound_indices
        best_sma_indices_below = below_bound_indices

merged_indices = [(idx, 'above') for idx in best_sma_indices_above] + [(idx, 'below') for idx in best_sma_indices_below]
merged_indices.sort()

# Identify consecutive bounces and penetrations, then mark on the chart
support_penetrations = []
resistance_bounces = []
resistance_penetrations = []
support_bounces = []

# Loop to identify support and resistance
for i in range(1, len(merged_indices)):
    current_idx, current_pos = merged_indices[i]
    prev_idx, prev_pos = merged_indices[i - 1]

    if current_pos == 'above' and prev_pos == 'below':  # Support Penetration
        resistance_penetrations.append(current_idx)
    elif current_pos == 'below' and prev_pos == 'below':  # Resistance Bounce
        resistance_bounces.append(current_idx)
    elif current_pos == 'below' and prev_pos == 'above':  # Resistance Penetration
        support_penetrations.append(current_idx)
    elif current_pos == 'above' and prev_pos == 'above':  # Support Bounce
        support_bounces.append(current_idx)


# Plotting for the best SMA only
plt.figure(figsize=(10, 6))
plt.plot(data.index, closing_prices, label='Price')
plt.plot(data.index, talib.SMA(closing_prices, timeperiod=best_sma), label=f'Best SMA ({best_sma} days)')
plt.plot(data.index, talib.SMA(closing_prices, timeperiod=best_sma) + 0.5 * talib.ATR(data['High'], data['Low'], closing_prices, timeperiod=atr_period), label='Upper Bound', color='green')
plt.plot(data.index, talib.SMA(closing_prices, timeperiod=best_sma) - 0.5 * talib.ATR(data['High'], data['Low'], closing_prices, timeperiod=atr_period), label='Lower Bound', color='red')

# Marking intersections for best SMA
intersection_prices_above = closing_prices.loc[best_sma_indices_above]
plt.scatter(intersection_prices_above.index, intersection_prices_above,
            marker='o', color='green', label='Above Upper Bound')

intersection_prices_below = closing_prices.loc[best_sma_indices_below]
plt.scatter(intersection_prices_below.index, intersection_prices_below,
            marker='o', color='red', label='Below Lower Bound')

# Marking consecutive bounces on the chart
for idx in support_bounces:
    plt.axvline(x=idx, color='green', linestyle='--')  # Marking the index on the plot in yellow

for idx in support_penetrations:
    plt.axvline(x=idx, color='red', linestyle='--')  # Marking penetrations in orange



print(best_sma)
# Printing counts for each category
print(f"Number of Support Penetrations: {len(support_penetrations)}")
print(f"Number of Resistance Bounces: {len(resistance_bounces)}")
print(f"Number of Resistance Penetrations: {len(resistance_penetrations)}")
print(f"Number of Support Bounces: {len(support_bounces)}")

plt.title(f'{symbol} Stock Price and Custom Bounds for Best SMA')
plt.xlabel('Date')
plt.ylabel('Price')
plt.legend()
plt.grid(True)
plt.show()
