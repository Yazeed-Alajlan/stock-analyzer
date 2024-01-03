import pandas as pd
from database.main import *


import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
from database.main import get_price_data  # Import your database function

def correlation_matrix(symbols):
    # Fetch stock data for each symbol
    stock_frames = {}
    for symbol in symbols:
        stock_data = get_price_data(symbol)  # Assuming get_price_data returns DataFrame with 'Close' prices
        stock_frames[symbol] = stock_data['close']  # Select only the 'Close' column

    # Combine the 'Close' prices into a single DataFrame
    stock_data_close = pd.concat(stock_frames.values(), keys=stock_frames.keys(), axis=1)
    
    # Calculate the correlation matrix for 'Close' prices
    corr_matrix = stock_data_close.corr()

    # Plot heatmap
    plt.figure(figsize=(10, 8))
    sns.heatmap(corr_matrix, annot=True, cmap='coolwarm', fmt=".2f")
    plt.title('Correlation Matrix Heatmap')
    plt.xlabel('Stock Symbols')
    plt.ylabel('Stock Symbols')
    plt.show()


