import numpy as np



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
    print(symbol)
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
    df=normalize_data(df,rolling=30)
    df['day_name'] = df.index.day_name()
    df['month'] = df.index.month_name()

    annual_avg_volume_norm = df['vol_norm'].resample('Y').mean()
    daily_avg_volume_per_day = df.groupby('day_name')['vol_norm'].mean()
    daily_avg_volume_per_day_per_month = df.groupby(['month', 'day_name'])['vol_norm'].mean().unstack()

    custom_month_order = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    custom_day_order = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday']

    daily_avg_volume_per_day_per_month = daily_avg_volume_per_day_per_month.reindex(custom_day_order, axis=1)

    daily_avg_volume_per_day_per_month = daily_avg_volume_per_day_per_month.reindex(custom_month_order, axis=0)
    print(daily_avg_volume_per_day_per_month)
    

    return df,annual_avg_volume_norm,daily_avg_volume_per_day

df=get_price_data("2222") 
result,annual_avg_volume_norm,daily_avg_volume_per_day =  volume_seasonality_daily(df)
print(daily_avg_volume_per_day)