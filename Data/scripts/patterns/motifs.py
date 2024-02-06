import yfinance as yf
import matplotlib.pyplot as plt
import stumpy
import numpy as np
from matplotlib.patches import Rectangle

# Define the stock symbol and period
stock_symbol = 'AAPL'  # Change this to the desired stock symbol
start_date = '2020-01-01'
end_date = '2024-01-11'
rt
# Fetch the stock data using yfinance
stock_data = yf.download(stock_symbol, start=start_date, end=end_date)['Close']

# Convert the stock data to a list
stock_prices = stock_data.tolist()

# Set the window size for motif discovery
window_size = 30  # You can adjust this window size

# Calculate the matrix profile
matrix_profile = stumpy.stump(stock_prices, m=window_size)

# Find the motif index and its nearest neighbor
motif_idx = np.argsort(matrix_profile[:, 0])[0]
nearest_neighbor_idx = int(matrix_profile[motif_idx, 1])

# Plot the stock prices and matrix profile
fig, axs = plt.subplots(2, sharex=True, gridspec_kw={'hspace': 0})
plt.suptitle('Motif (Pattern) Discovery', fontsize='30')
axs[0].plot(stock_prices)
axs[0].set_ylabel('Stock Prices', fontsize='20')

# Highlight motifs in the stock prices plot
rect1 = Rectangle((motif_idx, min(stock_prices)), window_size, max(stock_prices) - min(stock_prices), facecolor='lightgrey')
axs[0].add_patch(rect1)
rect2 = Rectangle((nearest_neighbor_idx, min(stock_prices)), window_size, max(stock_prices) - min(stock_prices), facecolor='lightgrey')
axs[0].add_patch(rect2)
axs[0].axvline(x=motif_idx, linestyle="dashed", color='r', label='Motif')
axs[0].axvline(x=nearest_neighbor_idx, linestyle="dashed", color='g', label='Nearest Neighbor')
axs[0].legend()

# Plot the matrix profile
axs[1].set_xlabel('Time', fontsize='20')
axs[1].set_ylabel('Matrix Profile', fontsize='20')
axs[1].plot(matrix_profile[:, 0])

# Highlight motifs in the matrix profile plot
axs[1].axvline(x=motif_idx, linestyle="dashed", color='r', label='Motif')
axs[1].axvline(x=nearest_neighbor_idx, linestyle="dashed", color='g', label='Nearest Neighbor')
axs[1].legend()

plt.show()

# Display motif and nearest neighbor indices
print(f"The motif is located at index {motif_idx}")
print(f"The nearest neighbor is located at index {nearest_neighbor_idx}")
