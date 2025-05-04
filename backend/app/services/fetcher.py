import yfinance as yf
import pandas as pd
from typing import Optional


def fetch_stock_data(ticker: str, period: str = "1mo", interval: str = "1d") -> Optional[pd.DataFrame]:
    try:
        stock = yf.Ticker(ticker)
        df = stock.history(period=period, interval=interval)
        if df.empty:
            print(f"[fetch_stock_data] No data found for {ticker}")
            return None
        df.reset_index(inplace=True)
        return df
    except Exception as e:
        print(f"[fetch_stock_data] Error fetching data: {e}")
        return None
