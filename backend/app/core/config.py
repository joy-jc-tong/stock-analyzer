# backend/app/core/config.py

from pydantic import BaseSettings

class Settings(BaseSettings):
    DEFAULT_STOCK_SYMBOL: str = "AAPL"  # 預設查詢的股票代碼
    DATA_SOURCE: str = "yfinance"       # 資料來源
    DEBUG_MODE: bool = True             # 是否為除錯模式

settings = Settings()
