import yfinance as yf
import matplotlib.pyplot as plt
import stumpy

# Define the stock symbol and period
stock_symbol = 'AAPL'  # Change this to the desired stock symbol
start_date = '2022-01-01'
end_date = '2023-01-01'

# Fetch the stock data using yfinance
stock_data = yf.download(stock_symbol, start=start_date, end=end_date)['Close']

# Convert the stock data to a list
stock_prices = stock_data.tolist()

# Set the window size for motif discovery
window_size = 80  # You can adjust this window size

# Calculate the matrix profile
matrix_profile = stumpy.stump(stock_prices, m=window_size)

# Find the index of the first occurrence of the motif
motif_idx = matrix_profile[:, 0].argsort()[:5]  # Get indices of the top 5 motifs

# Plot the stock closing prices
plt.figure(figsize=(10, 6))
plt.plot(stock_prices)
plt.title(f'{stock_symbol} Closing Prices')
plt.xlabel('Days')
plt.ylabel('Price')
plt.grid(True)

# Highlight the motifs on the plot
for idx in motif_idx:
    motif_start = idx
    motif_end = idx + window_size
    plt.axvspan(motif_start, motif_end, color='orange', alpha=0.3)

plt.show()
