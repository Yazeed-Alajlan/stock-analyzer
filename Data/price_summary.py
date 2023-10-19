import yfinance as yf
import pandas as pd
import numpy as np

# Define the stock symbol and date range
stock_symbol = '2222.SR'  
start_date = '2022-06-01'
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


# df['Day_Name'] = df.index.day_name()
# historical_data=df
# # Add a new column for the day names

# # Group the data by both month and day of the week and calculate the average close price
# monthly_daily_avg = historical_data.groupby([historical_data.index.year, historical_data.index.month, historical_data['Day_Name']])['Close'].mean()

# # Print the average close price for each day of the week for every month
# print(monthly_daily_avg)


# # Calculate the percentage change
# historical_data['Percentage_Change'] = ((historical_data['Close'] - historical_data['Open']) / historical_data['Open']) * 100

# # Calculate the average percentage change
# average_percentage_change = historical_data['Percentage_Change'].mean()

# # Print the average percentage change
# print(f"The average percentage change is {average_percentage_change:.2f}%")

# # Group the data by both month and day of the week and calculate the average percentage change
# monthly_daily_avg_percentage_change = historical_data.groupby([historical_data.index.year, historical_data.index.month, historical_data['Day_Name']])['Percentage_Change'].mean()

# # Print the average percentage change for each day of the week within each month
# print(monthly_daily_avg_percentage_change)