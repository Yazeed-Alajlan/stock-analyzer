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

# Calculate the daily average volume
daily_avg_volume = df['vol_norm'].resample('D').mean()

# Extract day names for the x-axis
day_names = df.index.strftime('%A')

# Define a list of colors for the lines
line_colors = ['blue', 'red', 'green', 'purple', 'orange']

# Create subplots with three rows and one column
fig = make_subplots(rows=3, cols=1, shared_xaxes=True, vertical_spacing=0.1)

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

# Create a new line chart for the daily average volume with day names on the x-axis
daily_avg_volume = df.groupby(df.index.strftime('%A'))['vol_norm'].mean()  # Calculate daily average
# custom_order = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
custom_order = [ 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday','Sunday']
daily_avg_volume = daily_avg_volume.loc[custom_order]

day_names = daily_avg_volume.index  # Get day names
daily_avg_line_chart = go.Scatter(x=day_names, y=daily_avg_volume, mode='lines', name='Daily Average Volume')
fig.add_trace(daily_avg_line_chart, row=3, col=1)

# Update axis labels and titles
fig.update_xaxes(title_text='Date', row=1, col=1)
fig.update_xaxes(title_text='Day', row=3, col=1)
fig.update_xaxes(title_text='Volume (log scale)', row=2, col=1)
fig.update_yaxes(title_text='Volume', row=1, col=1)
fig.update_yaxes(title_text='Frequency', row=2, col=1)
fig.update_yaxes(title_text='Average Volume (log scale)', row=3, col=1)

# Update subplot titles
fig.update_layout(title_text="Bitcoin Volume Data and Histogram")

# Add annotations to the charts
fig.add_annotation(text="Annotations here", xref="paper", yref="paper", x=0.02, y=0.95, showarrow=False)

fig.show()
