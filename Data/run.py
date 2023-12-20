from scripts.price_analysis.main import *
from scripts.patterns.main import *
from scripts.vsa.main import *
from scripts.trends.main import *
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



indicator_info = {
    'SMA': {'name': 'Simple Moving Average', 'default_period': 20},
    'EMA': {'name': 'Exponential Moving Average', 'default_period': 14},
    'WMA': {'name': 'Weighted Moving Average', 'default_period': None},  # No default period specified
    'RSI': {'name': 'Relative Strength Index', 'default_period': 14},
    'MACD': {'name': 'Moving Average Convergence Divergence', 'default_period': None},  # No default period specified
    'STOCH': {'name': 'Stochastic Oscillator', 'default_period': None},  # No default period specified
    'ADX': {'name': 'Average Directional Movement Index', 'default_period': 14},
    'ATR': {'name': 'Average True Range', 'default_period': 14},
    # Add more indicators with names and default periods
    'CUSTOM_INDICATOR_1': {'name': 'Custom Indicator 1', 'default_period': None},
    'CUSTOM_INDICATOR_2': {'name': 'Custom Indicator 2', 'default_period': None},
    'DEFAULT_INDICATOR': {'name': 'Default Indicator Name', 'default_period': None},
}



import talib

def calculate_requested_indicators(stock_data, indicators_list, period=None):
    # Fetch historical data for the symbol (assuming stock_data contains 'close' prices)
    close_prices = stock_data['close']

    indicator_info = {
        'SMA': {'name': 'Simple Moving Average', 'default_period': 4},
        'EMA': {'name': 'Exponential Moving Average', 'default_period': 10},
        'WMA': {'name': 'Weighted Moving Average', 'default_period': None},  # No default period specified
        'RSI': {'name': 'Relative Strength Index', 'default_period': 14},
        'MACD': {'name': 'Moving Average Convergence Divergence', 'default_period': None},  # No default period specified
        'STOCH': {'name': 'Stochastic Oscillator', 'default_period': None},  # No default period specified
        'ADX': {'name': 'Average Directional Movement Index', 'default_period': 14},
        'ATR': {'name': 'Average True Range', 'default_period': 14},
        # Add more indicators with names and default periods
    }
    
    # Calculate the requested indicators based on the user input
    for indicator_name in indicators_list:
            indicator_func = getattr(talib, indicator_name)
            indicator_info_data = indicator_info.get(indicator_name, {})
            
            # Set the default period if not provided by the user
            if period is None:
                indicator_default_period = indicator_info_data.get('default_period')
                if indicator_default_period is None:
                    indicator_values = indicator_func(close_prices)
                else:
                    indicator_values = indicator_func(close_prices,indicator_default_period)

            else:
                indicator_values = indicator_func(close_prices,indicator_default_period)

    return indicator_values


def calculate_macd(data):
    close_prices = data['close'].values
    macd, signal, x = talib.MACD(close_prices, fastperiod=12, slowperiod=26, signalperiod=9)
    data['MACD'] = macd
    data['Signal Line'] = signal

    return data

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



@app.route("/api/stocks/<symbol>/indicators/<indicator>")
def indicators(symbol,indicator):
    params = flask.request.args.get("params")
    stock_data = get_price_data(symbol)
    print(params)

    parsed_data = json.loads(params)
    indicator_name = list(parsed_data.keys())[0]  # Get the indicator name (e.g., RSI)
    kwargs = parsed_data[indicator_name]["kwargs"]  # Get the kwargs for the indicator
    indicator_params = {
    'indicator_name': indicator_name,
    'data': stock_data["close"],  # Replace this with your actual stock data
    'kwargs': kwargs
    }

    data = calculate_ta_indicator_with_params(indicator_params)
    print(params)
    print("------------------------------------------------------")
    print(data)
    data = data.dropna(how='any',axis=0) 
    data.index = data.index.strftime('%Y-%m-%d')
    



    # if isinstance(data, tuple):  # Check if data is a tuple
    #     result_dict = {}
    #     for index, series in enumerate(data):
    #         series = series.dropna(how='any',axis=0) 
    #         series.index = series.index.strftime('%Y-%m-%d')
    #         result_dict[f"series_{index + 1}"] = series
    #     return result_dict["series_1"].to_json()
    # else:
    #     data = data.dropna(how='any',axis=0) 

    #     data.index = data.index.strftime('%Y-%m-%d')
    return data.to_json()








if __name__=="__main__":
    app.run(debug=True,port=4000)


