from scripts.price_analysis.main import *
from scripts.patterns.main import *
from scripts.vsa.main import *
from scripts.trends.main import *
from scripts.correlation.main import *
from scripts.Files.TechnicalAnalysisAutomation.flags_pennants import *
# from scripts.moving_average.main import *
from database.main import *
#------------------------------------------------------------------------------#
import talib
import flask 
import json


app = flask.Flask(__name__)

@app.route("/api/stocks/<symbol>/price-summary")
def get_price_summary(symbol):
    df=get_price_data(symbol) 
    monthly_returns = calculate_monthly_returns(df)
    monthly_returns_average=calculate_monthly_average_returns(df)

    # Convert the date index to ISO 8601 format
    monthly_returns.index = monthly_returns.index.strftime('%Y-%m')
    result_dict = {
        "monthly_returns": monthly_returns.to_dict(),
        "monthly_returns_average": monthly_returns_average.to_dict(),
        "price_change":count_price_change(df)
    } 
    print(result_dict)
    return result_dict

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

@app.route("/api/stocks/flags-pennants")
def flags_pennants():
    # symbol = flask.request.args.get("symbol")
    # order = flask.request.args.get("order")
    symbol = flask.request.args.get("symbol")
    order=12
    data=find_flags_pennants(symbol,order)

    # data["data"].index = data["data"].index.strftime('%Y-%m-%d')
    result_dict = {
        # "data": data["data"].to_dict(),
        "bull_flags": data["bull_flags"],
        "bear_flags": data["bear_flags"],
        "bull_pennants": data["bull_pennants"],
        "bear_pennants": data["bear_pennants"]
    } 
    print(result_dict)
    return result_dict

@app.route("/api/stocks/vsa")
def vsa():
    symbol = flask.request.args.get("symbol")
    print(symbol)
    print("---------------------------------------------------")
    stock_data=get_price_data(symbol) 

    data=vsa_indicator(stock_data,norm_lookback=10)
    
    data.index = data.index.strftime('%Y-%m-%d')
    data=data.fillna(0)
    return data.to_json()

@app.route("/api/stocks/japanese-candlestick-patterns-markers")
def japanese_candlestick_patterns_markers():
    symbol = flask.request.args.get("symbol")
    print(symbol)
    print("---------------------------------------------------")
    data=get_japanese_candlestick_patterns_markers(symbol)

    print(data)
    return data


@app.route("/api/stocks/<symbol>/indicators/<indicator>")
def indicators(symbol,indicator):
    correlation_matrix(["2222","4321","2030","4030"])
    params = flask.request.args.get("params")
    stock_data = get_price_data(symbol)
    parsed_data = json.loads(params)
    indicator_name = list(parsed_data.keys())[0]  # Get the indicator name (e.g., RSI)
    kwargs = parsed_data[indicator_name]["kwargs"]  # Get the kwargs for the indicator
    result_dict = {}

    if(indicator_name=="VSA"):
        stock_data=get_price_data(symbol) 
        data=vsa_indicator(stock_data,norm_lookback=10)
        data.index = data.index.strftime('%Y-%m-%d')
        data=data.fillna(0)
        result_dict["value"]=data.to_dict()
        return result_dict
    
    indicator_params = {
    'indicator_name': indicator_name,
    'data': stock_data["close"],  # Replace this with your actual stock data
    'kwargs': kwargs
    }
    data = calculate_ta_indicator_with_params(indicator_params)
    if isinstance(data, tuple):  # Check if data is a tuple
        for index, series in enumerate(data):
            series = series.dropna(how='any',axis=0) 
            series.index = series.index.strftime('%Y-%m-%d')
            result_dict[list(kwargs.keys())[index]] = series.to_dict()
    else:
        data = data.dropna(how='any',axis=0) 
        data.index = data.index.strftime('%Y-%m-%d')
        result_dict[list(kwargs.keys())[0]] = data.to_dict()
    return result_dict
    # return data.to_json()



def calculate_ta_indicator_with_params(params):
    try:
        indicator_name = params.get('indicator_name')
        data = params.get('data')
        args = params.get('args', [])
        kwargs = params.get('kwargs', {})

        # Convert DataFrame to NumPy array if data is a DataFrame
        if isinstance(data, pd.DataFrame):
            data = data.to_numpy()

        indicator_func = getattr(talib, indicator_name)
        result = indicator_func(data, *args, **kwargs)
        return result
    except AttributeError:
        return None




if __name__=="__main__":
    app.run(debug=True,port=4000)


