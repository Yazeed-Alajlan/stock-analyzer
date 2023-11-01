import numpy as np


def normalize_data(df,rolling=30):
    df = df[df["Volume"] > 0]
    df["vol_norm"] = np.log(df["Volume"] / df["Volume"].rolling(rolling).median())
    return df

def volume_seasonality_daily(df):
    df=normalize_data(df,rolling=30)

    annual_avg_volume_norm = df['vol_norm'].resample('Y').mean()

    df["daily_avg_volume_norm"] = df['vol_norm'].resample('D').mean()
    daily_avg_volume_per_day = df.groupby(df.index.strftime('%A'))['vol_norm'].mean() 
    unique_days = daily_avg_volume_per_day.index.unique()
    custom_order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    custom_order = [day for day in custom_order if day in unique_days]    
    daily_avg_volume_per_day = daily_avg_volume_per_day.loc[custom_order]
    

    return df,annual_avg_volume_norm,daily_avg_volume_per_day
