import yfinance as yf
import pandas as pd
import numpy as np
import sys
import sys, json


def fetch_stock_data(stock_symbol, start_date, end_date):
    # Fetch stock data from Yahoo Finance
    df = yf.download(stock_symbol, start=start_date, end=end_date)
    return df

def calculate_monthly_price_changes(df):
    # Resample data to calculate monthly price changes
    monthly_data = df['Close'].resample('M').ffill()
    monthly_price_changes = monthly_data.pct_change() * 100
    print(monthly_data)

    return monthly_price_changes

def find_highest_monthly_price_change(monthly_price_changes):
    # Find the month with the highest price change
    highest_monthly_price_change = monthly_price_changes.max()
    best_month_to_trade = monthly_price_changes.idxmax()
    return best_month_to_trade, highest_monthly_price_change

def find_best_month_percentage_changes(monthly_price_changes):
    # Find the best month and its percentage change for each year
    best_months = monthly_price_changes.groupby(monthly_price_changes.index.year).idxmax()
    best_month_percentage_changes = monthly_price_changes.loc[best_months]
    return best_month_percentage_changes

def calculate_average_monthly_changes(monthly_price_changes):
    # Find the average price change for each month
    average_monthly_changes = monthly_price_changes.groupby(monthly_price_changes.index.strftime('%B')).mean().sort_values()
    return average_monthly_changes

def calculate_average_percentage_change(df):
    # Calculate the percentage change
    df['Percentage_Change'] = ((df['Close'] - df['Open']) / df['Open']) * 100

    # Calculate the average percentage change
    average_percentage_change = df['Percentage_Change'].mean()
    return average_percentage_change

def calculate_monthly_daily_avg_percentage_change(df):
    # Group the data by both month and day of the week and calculate the average percentage change
    monthly_daily_avg_percentage_change = df.groupby([df.index.year, df.index.month, df['Day_Name']])['Percentage_Change'].mean()
    return monthly_daily_avg_percentage_change

if __name__ == "__main__":
    stock_symbol = '2222.SR'
    start_date = '2020-01-01'
    end_date = '2022-12-31'

    df = fetch_stock_data(stock_symbol, start_date, end_date)
    print(calculate_monthly_price_changes(df))

    try:
        for arg in sys.argv:
            #print(arg)
                
            if arg == "getMonthSummary":
                print(calculate_monthly_price_changes(df))

            # elif arg == "datetime":
            #     use_datetime()

            else:
                print("An arg passed: ", arg)

    except Exception as error:
        print(f"Error: {str(error)}") 




    # monthly_price_changes = calculate_monthly_price_changes(df)

    # best_month_to_trade, highest_monthly_price_change = find_highest_monthly_price_change(monthly_price_changes)
    # print("\nHighest Monthly Price Change:")
    # print(f"Month: {best_month_to_trade.strftime('%B %Y')}")
    # print(f"Price Change: {highest_monthly_price_change:.2f}%")

    # best_month_percentage_changes = find_best_month_percentage_changes(monthly_price_changes)
    # print("Best Month and Percentage Change for Each Year:")
    # print(best_month_percentage_changes)

    # average_monthly_changes = calculate_average_monthly_changes(monthly_price_changes)
    # print("Average Price Change for Each Month:")
    # print(average_monthly_changes)

    # df['Day_Name'] = df.index.day_name()
    # average_percentage_change = calculate_average_percentage_change(df)
    # print(f"The average percentage change is {average_percentage_change:.2f}%")

    # monthly_daily_avg_percentage_change = calculate_monthly_daily_avg_percentage_change(df)
    # print(monthly_daily_avg_percentage_change)


