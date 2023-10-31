import sys

sys.path.insert(1, 'C:/Users/Yazee/Desktop/stock-analyzer/Data/vsa')
# sys.path.insert(1, 'C:/Users/Yazeed/Desktop/react/stock-analyzer/Data/vsa')
# sys.path.insert(1, 'C:/Users/Yazeed/Desktop/react/stock-analyzer/Data/patterns')
import pandas as pd
import flask 
import yfinance as yf
from Volume_Seasonality_daily  import  volume_seasonality_daily
from price_summary import calculate_monthly_returns
from patterns.pattern_detect import analyze_patterns
from pymongo import MongoClient
from database_functions import *

def fetch_stock_data(stock_symbol, start_date, end_date):
    # Fetch stock data from Yahoo Finance
    df = yf.download(stock_symbol, start=start_date, end=end_date)
    return df

app = flask.Flask(__name__)

@app.route("/api/price_summary")
def get_price_summary():
    stock_symbol = '2222.SR'
    start_date = '2020-01-01'
    end_date = '2022-12-31'
    df = fetch_stock_data(stock_symbol, start_date, end_date)
    price_summary = calculate_monthly_returns(df)

    # Convert the date index to ISO 8601 format
    price_summary.index = price_summary.index.strftime('%Y-%m')

    return price_summary.to_json()
##api/volume_seasonality_daily
@app.route("/api/volume_seasonality_daily")
def get_volume_seasonality_daily():
    stock_symbol = '2222.SR'
    start_date = '2020-01-01'
    end_date = '2022-12-31'
    df = fetch_stock_data(stock_symbol, start_date, end_date)
    result,annual_avg_volume_norm,daily_avg_volume_per_day =  volume_seasonality_daily(df)
    result.index = result.index.strftime('%Y-%m-%d')
    annual_avg_volume_norm.index = annual_avg_volume_norm.index.strftime('%Y-%m-%d')
    result_dict = {
        "result": result.to_json(),
        "annual_avg_volume_norm": annual_avg_volume_norm.to_dict(),
        "daily_avg_volume_per_day": daily_avg_volume_per_day.to_dict()
    } 
    return result_dict

@app.route("/api/japanese_candlestick_patterns/<pattern>")
def japanese_candlestick_patterns(pattern):
    stock_data=get_all_stocks_symbols()  # Replace "mycollection" with your collection name
    data=analyze_patterns(stock_data,pattern)
    # Remove all 'None' values from the nested dictionary
    data = {
        pattern: {key: value for key, value in pattern_data.items() if value is not None}
        for pattern, pattern_data in data.items()
    }
    print(data)

    return data
if __name__=="__main__":
    app.run(debug=True,port=4000)


