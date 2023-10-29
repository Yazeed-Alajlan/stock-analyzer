import pandas as pd
import flask 
from price_summary import calculate_monthly_returns
import yfinance as yf

def fetch_stock_data(stock_symbol, start_date, end_date):
    # Fetch stock data from Yahoo Finance
    df = yf.download(stock_symbol, start=start_date, end=end_date)
    return df

app = flask.Flask(__name__)

@app.route("/api/get_price_summary")
def get_price_summary():
    stock_symbol = '2222.SR'
    start_date = '2020-01-01'
    end_date = '2022-12-31'
    df = fetch_stock_data(stock_symbol, start_date, end_date)
    price_summary = calculate_monthly_returns(df)

    # Convert the date index to ISO 8601 format
    price_summary.index = price_summary.index.strftime('%Y-%m')

    return price_summary.to_json()

if __name__=="__main__":
    app.run(debug=True,port=4000)


