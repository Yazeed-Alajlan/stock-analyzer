import yfinance as yf
import plotly.graph_objs as go
from plotly.subplots import make_subplots
import numpy as np

def prepData():
    df = yf.download('ETH-USD', start='2022-01-01', end='2022-12-31', interval='1h')
    df = df[df["Volume"] > 0]
    df["vol_norm"] = np.log(df["Volume"] / df["Volume"].rolling(168).median())
    return df

# Call the function to get the hourly data
df = prepData()

# Create subplots with three rows and one column
fig = make_subplots(rows=3, cols=1, shared_xaxes=False, vertical_spacing=0.1)

# Plot the volume data using Plotly Express (line chart)
line_chart = go.Scatter(x=df.index, y=df['vol_norm'], mode='lines', name='Volume Data')
fig.add_trace(line_chart, row=1, col=1)

# Add horizontal lines for the annual average volume with different colors
annual_avg_volume = df['vol_norm'].resample('Y').mean()
line_colors = ['blue', 'red', 'green', 'purple', 'orange']
for i, (year, avg) in enumerate(annual_avg_volume.items()):
    color = line_colors[i % len(line_colors)]  # Cycle through the defined colors
    hline = go.Scatter(x=[df.index[0], df.index[-1]], y=[avg, avg], mode='lines', line=dict(dash="dash", color=color), name=f'Average {year.year}')
    fig.add_trace(hline, row=1, col=1)

# Create a histogram chart for vol_norm
histogram_chart = go.Histogram(x=df['vol_norm'], name='Volume Histogram')
fig.add_trace(histogram_chart, row=2, col=1)

# Create a new line chart for the hourly average volume with custom order by hour
hourly_avg_volume = df.groupby(df.index.hour)['vol_norm'].mean()
custom_order = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]  # Hours of the day
hourly_avg_line_chart = go.Scatter(x=custom_order, y=hourly_avg_volume, mode='lines', name='Hourly Average Volume')
fig.add_trace(hourly_avg_line_chart, row=3, col=1)

# Update axis labels and titles
fig.update_xaxes(title_text='Date', row=1, col=1)
fig.update_xaxes(title_text='Volume (log scale)', row=2, col=1)
fig.update_xaxes(title_text='Hour of the Day', row=3, col=1)
fig.update_yaxes(title_text='Volume', row=1, col=1)
fig.update_yaxes(title_text='Frequency', row=2, col=1)
fig.update_yaxes(title_text='Average Volume (log scale)', row=3, col=1)

# Update subplot titles
fig.update_layout(title_text="Bitcoin Volume Data and Histogram")

# Add annotations to the charts
fig.add_annotation(text="Annotations here", xref="paper", yref="paper", x=0.02, y=0.95, showarrow=False)

fig.show()