import yfinance as yf
import plotly.graph_objs as go
from plotly.subplots import make_subplots
import numpy as np

def prepData():
    df = yf.download('USDT-BTC', start='2018-01-01', end='2022-12-31')
    df = df[df["Volume"] > 0]
    df["vol_norm"] = np.log(df["Volume"] / df["Volume"].rolling(30).median())
    return df



def normalize_data(df,rolling=30):
    df = df[df["Volume"] > 0]
    df["vol_norm"] = np.log(df["Volume"] / df["Volume"].rolling(rolling).median())
    return df

def volume_seasonality_daily(df):
    normalize_data(df)
    annual_avg_volume_norm = df['vol_norm'].resample('Y').mean()
    daily_avg_volume_norm = df['vol_norm'].resample('D').mean()
    day_names = df.index.strftime('%A')

    print(annual_avg_volume_norm)
    print("--------------------------------------")
    print(daily_avg_volume_norm)
    print("--------------------------------------")

    print(day_names)
    return daily_avg_volume_norm, annual_avg_volume_norm, day_names

df = prepData()
daily_avg_volume_norm, annual_avg_volume_norm, day_names = volume_seasonality_daily(df)

# Create subplots
fig = make_subplots(rows=2, cols=1, shared_xaxes=True, subplot_titles=["Daily Volume Seasonality", "Annual Volume Seasonality"])

# Daily Volume Seasonality
trace_daily = go.Scatter(x=daily_avg_volume_norm.index, y=daily_avg_volume_norm, mode='lines', name='Daily Volume Seasonality')
fig.add_trace(trace_daily, row=1, col=1)

# Annual Volume Seasonality
trace_annual = go.Bar(x=annual_avg_volume_norm.index, y=annual_avg_volume_norm, name='Annual Volume Seasonality', marker_color='green')
fig.add_trace(trace_annual, row=2, col=1)

# Update x-axis labels for daily seasonality
fig.update_xaxes(title_text="Day of the Week", ticktext=day_names.unique(), tickvals=np.arange(7), row=1, col=1)

# Update layout
fig.update_layout(title_text="Volume Seasonality Analysis", showlegend=True)
fig.show()