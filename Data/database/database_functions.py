from pymongo import MongoClient
import pandas as pd



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

def getAllStocksInformation():
    db,client = database_connect()
    collection = db["stockinformations"]

    # Example: Query all documents in the collection
    documents = list(collection.find({}))
    # print("Documents in the collection:", documents)

    # Close the MongoDB client when done
    client.close()
    return documents

def get_all_stocks_symbols():
    db,client = database_connect()
    collection = db["stockinformations"]

    documents = collection.find({})
    symbols = []
    for document in documents:
        symbol = document.get("symbol")
        if symbol:
            symbols.append(symbol)

    client.close()
    return symbols

def get_price_data(symbol):
    db,client = database_connect()
    collection = db["stockprices"]
    # Example: Query all documents in the collection
    document = collection.find_one({"symbol": symbol})
    quotes = document.get("quotes")
    # pipeline = [
    #     {"$match": {"symbol": symbol}},
    #     {"$unwind": "$quotes"},
    #     {
    #         "$group": {
    #             "_id": {
    #                 "year": {"$year": "$quotes.date"},
    #                 "month": {"$month": "$quotes.date"},
    #                 "day": {"$dayOfMonth": "$quotes.date"}
    #             },
    #             "open": {"$first": "$quotes.open"},
    #             "close": {"$last": "$quotes.close"},
    #             "high": {"$max": "$quotes.high"},
    #             "low": {"$min": "$quotes.low"},
    #             "volume": {"$sum": "$quotes.volume"}
    #         }
    #     },
    #     {"$sort": {"_id.year": 1, "_id.month": 1, "_id.day": 1}}
    # ]
    # result = list(collection.aggregate(pipeline))
    df =  pd.DataFrame(quotes)
    df = df.drop('_id', axis=1)
    df.set_index('date', inplace=True)

   
    
    # print(result)
    # Convert numeric columns to float
    # numeric_columns = ['open', 'close', 'high', 'low', 'volume', 'adjclose']
    # df[numeric_columns] = df[numeric_columns].apply(pd.to_numeric, errors='coerce')

    result = df.groupby(df.index.date).agg({'open': 'first', 'close': 'last', 'high': 'max', 'low': 'min', 'volume': 'sum'})

    # Close the MongoDB client when done
    client.close()
    return result