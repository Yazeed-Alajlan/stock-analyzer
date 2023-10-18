import yfinance as yf
import pandas as pd
import numpy as np

# Define the stock symbol and date range
stock_symbol = '2222.SR'  
start_date = '2020-01-01'
end_date = '2022-12-31'  

# Fetch stock data from Yahoo Finance
df = yf.download(stock_symbol, start=start_date, end=end_date)

# Resample data to calculate monthly price changes
monthly_data = df['Close'].resample('M').ffill()
monthly_price_changes = monthly_data.pct_change()*100
print(monthly_price_changes)

# Find the month with the highest price change
highest_monthly_price_change = monthly_price_changes.max()
best_month_to_trade = monthly_price_changes.idxmax()
print("\nHighest Monthly Price Change:")
print(f"Month: {best_month_to_trade.strftime('%B %Y')}")
print(f"Price Change: {highest_monthly_price_change:.2f}%")
#------------------------------------------------------------------------------------------------------------------------

# Find the best month and its percentage change for each year
# Group the data by year and find the best month for each year
best_months = monthly_price_changes.groupby(monthly_price_changes.index.year).idxmax()
# Extract the percentage change for the best month in each year
best_month_percentage_changes = monthly_price_changes.loc[best_months]
print("Best Month and Percentage Change for Each Year:")
# print(best_months.dt.strftime('%B %Y'))
print(best_month_percentage_changes)
#------------------------------------------------------------------------------------------------------------------------

# Find the average price change for each month
# Group the data by month and calculate the average price change for each month
average_monthly_changes = monthly_price_changes.groupby(monthly_price_changes.index.strftime('%B')).mean().sort_values()

print("Average Price Change for Each Month:")
print(average_monthly_changes)
#------------------------------------------------------------------------------------------------------------------------


# Extract the year and day of the week from the Date index
df['Year'] = df.index.year
df['DayOfWeek'] = df.index.dayofweek  # 0 = Monday, 1 = Tuesday, ..., 6 = Sunday

# Filter out data for Fridays (dayofweek == 4) and Saturdays (dayofweek == 5)
df = df[(df['DayOfWeek'] != 4) & (df['DayOfWeek'] != 5)]

# Calculate the average close price for each day of the week for each year
average_prices = df.groupby(['Year', 'DayOfWeek'])['Close'].mean().reset_index()

# Define a dictionary to map day numbers to day names
day_names = {0: 'Monday', 1: 'Tuesday', 2: 'Wednesday', 3: 'Thursday', 6: 'Sunday'}

# Iterate through each year and day of the week to print the average close price
for _, row in average_prices.iterrows():
    year, day_of_week, avg_price = int(row['Year']), int(row['DayOfWeek']), row['Close']
    day_name = day_names.get(day_of_week, 'Unknown')
    print(f"Year: {year}, Day: {day_name}, Average Close Price: {avg_price:.2f}")