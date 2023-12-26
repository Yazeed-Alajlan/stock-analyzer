import talib
import pandas as pd
import yfinance as yf
import matplotlib.pyplot as plt

# Fetch stock data
symbol = 'AAPL'
start_date = '2022-01-01'
end_date = '2023-01-01'
data = yf.download(symbol, start=start_date, end=end_date)

# Extract closing prices
closing_prices = data['Close']

# Calculate bounce percentage for different SMA periods
bounce_percentages = []
penetration_percentages = []
# sma_periods = list(range(2, 201))  # Modify the range from 2 to 200
sma_periods = [50] 

atr_period = 14

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

    above_bound_indices = crossed_upper[crossed_upper].index.tolist()
    below_bound_indices = crossed_lower[crossed_lower].index.tolist()

    merged_indices = [(idx, 'above') for idx in above_bound_indices] + [(idx, 'below') for idx in below_bound_indices]
    merged_indices.sort()

    support_penetrations = []
    resistance_bounces = []
    resistance_penetrations = []
    support_bounces = []

    for i in range(1, len(merged_indices)):
        current_idx, current_pos = merged_indices[i]
        prev_idx, prev_pos = merged_indices[i - 1]

        if current_pos == 'above' and prev_pos == 'below':
            resistance_penetrations.append(current_idx)
        elif current_pos == 'below' and prev_pos == 'below':
            resistance_bounces.append(current_idx)
        elif current_pos == 'below' and prev_pos == 'above':
            support_penetrations.append(current_idx)
        elif current_pos == 'above' and prev_pos == 'above':
            support_bounces.append(current_idx)

    total_intersections = len(support_penetrations) + len(resistance_bounces) + len(resistance_penetrations) + len(support_bounces)
    print(total_intersections)
    # Calculate bounce percentage
    bounce_percentage = ((len(support_bounces) + len(resistance_bounces)) / total_intersections) * 100
    bounce_percentages.append(bounce_percentage)

    penetration_percentage = ((len(resistance_penetrations) + len(support_penetrations)) / total_intersections) * 100
    penetration_percentages.append(penetration_percentage)
print(len(support_bounces))
print(len(support_penetrations))
print(len(resistance_bounces))
print(len(resistance_penetrations))
# Plotting bounce percentage against SMA periods
plt.figure(figsize=(10, 6))
plt.plot(sma_periods, bounce_percentages, linestyle='-', color='blue')
plt.plot(sma_periods, penetration_percentages, linestyle='-', color='yellow')
plt.title('Bounce Percentage for Different SMA Periods')
plt.xlabel('SMA Period')
plt.ylabel('Bounce Percentage')
plt.grid(True)
plt.show()
