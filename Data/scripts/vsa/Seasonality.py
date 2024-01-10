import pandas as pd
import numpy as np
import statsmodels.api as sm
import matplotlib.pyplot as plt

import pandas as pd
from pymongo import MongoClient
def database_connect():
    # Database connection parameters
    host  = "127.0.0.1"
    port  = 27017
    database_name  = "stockDB"

    # Connect to the MongoDB server
    client = MongoClient(host, port)

    # Access the specified database
    db = client[database_name]
    return db,client

def get_price_data(symbol):
    db,client = database_connect()
    collection = db["stockprices"]
    # Example: Query all documents in the collection
    document = collection.find_one({"symbol": symbol})
    quotes = document.get("quotes")
    df =  pd.DataFrame(quotes)
    df = df.drop('_id', axis=1)
    df.set_index('date', inplace=True)

    # Convert numeric columns to float
    # numeric_columns = ['open', 'close', 'high', 'low', 'volume', 'adjclose']
    # df[numeric_columns] = df[numeric_columns].apply(pd.to_numeric, errors='coerce')

    # Close the MongoDB client when done
    client.close()
    return df
def normalize_data(df,rolling=30):
    df = df[df["volume"] > 0]
    df["vol_norm"] = np.log(df["volume"] / df["volume"].rolling(rolling).median())
    return df


def volume_seasonality_daily(df):
    df = normalize_data(df, rolling=30)
    df['vol_norm'].fillna(df['vol_norm'].mean(), inplace=True)  # Fill missing values with mean

    print(df)
    # Decompose the time series to identify seasonality
    decomposition = sm.tsa.seasonal_decompose(df['vol_norm'], model='additive', period=30)  # Assuming a period of 30 days

    # Plot the original volume data
    plt.figure(figsize=(10, 8))
    plt.subplot(411)
    plt.plot(df['vol_norm'], label='Original Volume')
    plt.legend()

    # Plot the trend component
    plt.subplot(412)
    plt.plot(decomposition.trend, label='Trend')
    plt.legend()

    # Plot the seasonal component
    plt.subplot(413)
    plt.plot(decomposition.seasonal, label='Seasonal')
    plt.legend()

    # Plot the residual component
    plt.subplot(414)
    plt.plot(decomposition.resid, label='Residual')
    plt.legend()

    plt.tight_layout()
    plt.show()




df = get_price_data("2222")
volume_seasonality_daily(df)
