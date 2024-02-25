import talib
import pandas as pd
import yfinance as yf
import matplotlib.pyplot as plt




def moving_average_bounce_penetration_percentage(df):
    closing_prices = df['close']
    # Calculate bounce percentage for different SMA periods
    results = []

    sma_periods = list(range(2, 201))  # Modify the range from 2 to 200
    atr_period = 14

    for sma_period in sma_periods:
        sma = talib.SMA(closing_prices, timeperiod=sma_period)
        atr = talib.ATR(df['high'], df['low'], closing_prices, timeperiod=atr_period)

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
        bounce_percentage = ((len(support_bounces) + len(resistance_bounces)) / total_intersections) * 100
        penetration_percentage = ((len(resistance_penetrations) + len(support_penetrations)) / total_intersections) * 100
        support_bounces_percentage = (len(support_bounces)) / (len(support_bounces) + len(support_penetrations))
        resistance_bounces_percentage = (len(resistance_bounces)) / (len(resistance_bounces) + len(resistance_penetrations))

        result = {
            "period": sma_period,
            'total_intersections': total_intersections,
            'bounce_percentage': bounce_percentage,
            'penetration_percentage': penetration_percentage,
            'support_bounces_percentage': support_bounces_percentage,
            'resistance_bounces_percentage': resistance_bounces_percentage,
            'resistance_penetrations': resistance_penetrations,
            'resistance_bounces': resistance_bounces,
            'support_penetrations': support_penetrations,
            'support_bounces': support_bounces
        }

        results.append(result)

    return results
