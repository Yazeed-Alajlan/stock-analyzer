import yfinance as yf
import numpy as np
import matplotlib.pyplot as plt

def prepData():
    df = yf.download('USDT-BTC', start='2022-01-01', end='2022-12-31', interval='1h')
    df = df[df["Volume"] > 0]
    df["vol_norm"] = np.log(df["Volume"] / df["Volume"].rolling(168).median())
    return df

# Call the function to get the hourly data
df = prepData()

# Create subplots with three rows and one column
fig, axs = plt.subplots(3, 1, figsize=(10, 10), sharex=False)

# Plot the volume data as a line chart
axs[0].plot(df.index, df['vol_norm'], label='Volume Data', color='blue')
axs[0].set_ylabel('Volume (log scale)')
axs[0].set_title('Volume Data')

# Add horizontal lines for the annual average volume with different colors
annual_avg_volume = df['vol_norm'].resample('Y').mean()
line_colors = ['red', 'green', 'purple', 'orange']
for i, (year, avg) in enumerate(annual_avg_volume.items()):
    color = line_colors[i % len(line_colors)]  # Cycle through the defined colors
    axs[0].axhline(avg, color=color, linestyle='--', label=f'Average {year.year}')

# Create a histogram chart for vol_norm
axs[1].hist(df['vol_norm'], bins=75, color='lightblue', edgecolor='black')
axs[1].set_xlabel('Volume (log scale)')
axs[1].set_ylabel('Frequency')
axs[1].set_title('Volume Histogram')

# Create a new line chart for the hourly average volume with custom order by hour
hourly_avg_volume = df.groupby(df.index.hour)['vol_norm'].mean()
custom_order = range(24)  # Hours of the day
axs[2].plot(custom_order, hourly_avg_volume, label='Hourly Average Volume', color='green')
axs[2].set_xlabel('Hour of the Day')
axs[2].set_ylabel('Average Volume (log scale)')
axs[2].set_title('Hourly Average Volume')

# Update subplot titles
fig.suptitle("Bitcoin Volume Data and Histogram", fontsize=16)

# Add annotations to the charts
fig.text(0.02, 0.95, "Annotations here", fontsize=12)

# Display the plot
plt.tight_layout(rect=[0, 0, 1, 0.95])
plt.show()
