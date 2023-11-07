from scripts.price_analysis.main import *
from scripts.patterns.main import *
from scripts.vsa.main import *
from scripts.trends.main import *
# from scripts.moving_average.main import *
from database.main import *
#------------------------------------------------------------------------------#
import pandas as pd
import flask 
import yfinance as yf




app = flask.Flask(__name__)


@app.route("/api/stocks/<symbol>/price-summary")
def get_price_summary(symbol):
    df=get_price_data(symbol) 
    price_summary = calculate_monthly_returns(df)

    # Convert the date index to ISO 8601 format
    price_summary.index = price_summary.index.strftime('%Y-%m')

    return price_summary.to_json()
##api/volume_seasonality_daily
@app.route("/api/stocks/<symbol>/volume-seasonality-daily")
def get_volume_seasonality_daily(symbol):
    df=get_price_data(symbol) 
    result,annual_avg_volume_norm,daily_avg_volume_per_day =  volume_seasonality_daily(df)
    result.index = result.index.strftime('%Y-%m-%d')
    annual_avg_volume_norm.index = annual_avg_volume_norm.index.strftime('%Y-%m-%d')
    result_dict = {
        "result": result.to_json(),
        "annual_avg_volume_norm": annual_avg_volume_norm.to_dict(),
        "daily_avg_volume_per_day": daily_avg_volume_per_day.to_dict()
    } 
    return result_dict

@app.route("/api/stocks/japanese-candlestick-patterns/<pattern>")
def japanese_candlestick_patterns(pattern):
    stock_data=get_all_stocks_symbols()  
    data=find_japanese_candlestick_patterns(stock_data,pattern)
    # Remove all 'None' values from the nested dictionary
    data = {
        pattern: {key: value for key, value in pattern_data.items() if value is not None}
        for pattern, pattern_data in data.items()
    }
    print(data)

    return data

@app.route("/api/stocks/<symbol>/hawkes-process")
def hawkes_process(symbol):
    stock_data=get_price_data(symbol) 
    data =find_hawkes_process(stock_data, kappa=0.1,norm_lookback=14,rolling=7)
    data.index = data.index.strftime('%Y-%m-%d')

    return data.to_json()

@app.route("/api/stocks/consolidating-stocks")
def consolidating():
    numberOfCandles = flask.request.args.get("numberOfCandles")
    percentageRange = flask.request.args.get("percentageRange")
    stock_data=get_all_stocks_symbols()  
    data=find_consolidating_stocks(stock_data,candles=numberOfCandles,percentage=percentageRange)
    return data










if __name__=="__main__":
    app.run(debug=True,port=4000)


