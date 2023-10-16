import pandas as pd
import json

# Load the JSON data
with open('stockDB.stockprices.json', 'r') as file:
    data = json.load(file)

# Process each symbol separately
symbols = data[0]['quotes']
print(symbols)
# for symbol in symbols:
#     symbol_data = data[data['Symbol'] == symbol]
#     X = symbol_data[['Open', 'High', 'Low', 'Close']]
#     y = symbol_data['Pattern']