from pydantic import BaseModel
from typing import Optional, Literal, List


class StockFilter(BaseModel):
    tickers: List[str]  # ✅ 必加

    max_pe: Optional[float] = None
    min_dividend_yield: Optional[float] = None

    avg_volume_days: Optional[int] = None
    avg_volume_threshold: Optional[float] = None  # 單位：萬股
    avg_volume_direction: Optional[Literal["above", "below"]] = None

    pb_upper: Optional[float] = None
    min_eps: Optional[float] = None
    roe_years: Optional[int] = None
    min_roe: Optional[float] = None
    roa_years: Optional[int] = None
    min_roa: Optional[float] = None
    roic_years: Optional[int] = None
    min_roic: Optional[float] = None
    gross_margin_years: Optional[int] = None
    min_gross_margin: Optional[float] = None


class StockInfo(BaseModel):
    ticker: str
    name: Optional[str]
    date: Optional[str]

    price: Optional[float]
    volume: Optional[int]

    pb_ratio: Optional[float]
    pe_ratio: Optional[float]
    eps: Optional[float]
    dividend_yield: Optional[float]
    gross_margin: Optional[float]

    roe: Optional[float]
    roa: Optional[float]
    roic: Optional[float]
