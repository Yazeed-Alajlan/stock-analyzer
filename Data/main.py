import sys

# sys.path.insert(1, 'C:/Users/Yazee/Desktop/stock-analyzer/Data/vsa')
sys.path.insert(1, 'C:/Users/Yazeed/Desktop/react/stock-analyzer/Data/vsa')
# sys.path.insert(1, 'C:/Users/Yazeed/Desktop/react/stock-analyzer/Data/patterns')
import pandas as pd
import flask 
import yfinance as yf
from Volume_Seasonality_daily  import  volume_seasonality_daily
from price_summary import calculate_monthly_returns
from patterns.pattern_detect import analyze_patterns
from pymongo import MongoClient


def fetch_stock_data(stock_symbol, start_date, end_date):
    # Fetch stock data from Yahoo Finance
    df = yf.download(stock_symbol, start=start_date, end=end_date)
    return df

def database_connect():
    # Database connection parameters
    host  = "127.0.0.1"
    port  = 27017
    database_name  = "stockDB"

    # Connect to the MongoDB server
    client = MongoClient(host, port)

    # Access the specified database
    db = client[database_name]
    return db,client

def getAllStocksInformation():
    db,client = database_connect()
    collection = db["stockinformations"]

    # Example: Query all documents in the collection
    documents = list(collection.find({}))
    print("Documents in the collection:", documents)

    # Close the MongoDB client when done
    client.close()
    return documents

def getStockPriceData(symbol):
    db,client = database_connect()
    collection = db["stockprices"]

    # Example: Query all documents in the collection
    document = list(collection.find({"symbol": symbol}))
    print("Document is:", document)

    # Close the MongoDB client when done
    client.close()
    return document



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

@app.route("/api/japanese_candlestick_patterns")
def japanese_candlestick_patterns():
    stock_data=getAllStocksInformation()  # Replace "mycollection" with your collection name
    analyze_patterns(stock_data)
 
    return "Heelo"
if __name__=="__main__":
    app.run(debug=True,port=4000)


