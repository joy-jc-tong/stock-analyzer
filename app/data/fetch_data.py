import yfinance as yf
import pandas as pd

def fetch_stock_data(ticker: str, period: str = "1y", interval: str = "1mo") -> pd.DataFrame:
    """
    從 Yahoo Finance 擷取指定股票的歷史資料
    :param ticker: 股票代碼 (e.g., 'AAPL')
    :param period: 資料區間 (e.g., '1mo', '3mo', '6mo', '1y')
    :param interval: 資料頻率 (e.g., '1d', '1wk', '1mo')
    :return: pandas DataFrame 格式的資料
    """
    stock = yf.Ticker(ticker)
    df = stock.history(period=period, interval=interval)
    return df


ticker = "AAPL"
df = fetch_stock_data(ticker)
print(df)  # 印出前幾筆資料


