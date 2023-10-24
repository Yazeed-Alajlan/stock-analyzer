import yfinance as yf
import plotly.graph_objs as go
from plotly.subplots import make_subplots
import numpy as np

def prepData():
    df = yf.download('USDT-BTC', start='2018-01-01', end='2022-12-31')
    df = df[df["Volume"] > 0]
    df["vol_norm"] = np.log(df["Volume"] / df["Volume"].rolling(30).median())
    return df

# Call the function to get the data
df = prepData()

# Calculate the annual average volume
annual_avg_volume = df['vol_norm'].resample('Y').mean()

# Define a list of colors for the lines
line_colors = ['blue', 'red', 'green', 'purple', 'orange']

# Create subplots with two rows and one column
fig = make_subplots(rows=2, cols=1, shared_xaxes=True, vertical_spacing=0.1)

# Plot the volume data using Plotly Express (line chart)
line_chart = go.Scatter(x=df.index, y=df['vol_norm'], mode='lines', name='Volume Data')
fig.add_trace(line_chart, row=1, col=1)

# Add horizontal lines for the annual average volume with different colors
for i, (year, avg) in enumerate(annual_avg_volume.items()):
    color = line_colors[i % len(line_colors)]  # Cycle through the defined colors
    hline = go.Scatter(x=[df.index[0], df.index[-1]], y=[avg, avg], mode='lines', line=dict(dash="dash", color=color), name=f'Average {year.year}')
    fig.add_trace(hline, row=1, col=1)

# Create a histogram chart for vol_norm
histogram_chart = go.Histogram(x=df['vol_norm'], name='Volume Histogram')
fig.add_trace(histogram_chart, row=2, col=1)

# Update axis labels and titles
fig.update_xaxes(title_text='Date', row=1, col=1)
fig.update_xaxes(title_text='Volume (log scale)', row=2, col=1)
fig.update_yaxes(title_text='Volume', row=1, col=1)
fig.update_yaxes(title_text='Frequency', row=2, col=1)

# Update subplot titles
fig.update_layout(title_text="Bitcoin Volume Data and Histogram")

fig.show()
