import yfinance as yf
from typing import List
from datetime import datetime
from app.database.schemas import StockFilter, StockInfo


def calculate_average(values: List[float]) -> float:
    return sum(values) / len(values) if values else 0.0


def screen_stocks(filter: StockFilter) -> List[StockInfo]:
    result = []
    for ticker in filter.tickers:
        try:
            stock = yf.Ticker(ticker)

            info = stock.info
            hist = stock.history(period=f"{filter.avg_volume_days}d") if filter.avg_volume_days else None

            # 平均成交量（萬）
            avg_volume = hist["Volume"].mean() / 10_000 if hist is not None and not hist.empty else None
            if filter.avg_volume_threshold is not None:
                if filter.avg_volume_direction == "above" and (avg_volume is None or avg_volume < filter.avg_volume_threshold):
                    continue
                if filter.avg_volume_direction == "below" and (avg_volume is None or avg_volume > filter.avg_volume_threshold):
                    continue

            pe_ratio = info.get("trailingPE")
            pb_ratio = info.get("priceToBook")
            eps = info.get("trailingEps")
            dividend_yield = info.get("dividendYield", 0.0) * 100 if info.get("dividendYield") else None
            current_price = info.get("currentPrice")
            long_name = info.get("longName", "")
            volume = info.get("volume")

            if filter.max_pe and (pe_ratio is None or pe_ratio > filter.max_pe):
                continue
            if filter.min_eps and (eps is None or eps < filter.min_eps):
                continue
            if pb_ratio is None or not (0 < pb_ratio < filter.pb_upper):
                continue
            if filter.min_dividend_yield and (dividend_yield is None or dividend_yield < filter.min_dividend_yield):
                continue

            avg_gross_margin = info.get("grossMargins", None) * 100 if info.get("grossMargins") else None
            avg_roe = info.get("returnOnEquity", None) * 100 if info.get("returnOnEquity") else None
            avg_roa = info.get("returnOnAssets", None) * 100 if info.get("returnOnAssets") else None
            avg_roic = info.get("returnOnCapitalEmployed", None) * 100 if info.get("returnOnCapitalEmployed") else None

            if filter.min_gross_margin and (avg_gross_margin is None or avg_gross_margin < filter.min_gross_margin):
                continue
            if filter.min_roe and (avg_roe is None or avg_roe < filter.min_roe):
                continue
            if filter.min_roa and (avg_roa is None or avg_roa < filter.min_roa):
                continue
            if filter.min_roic and (avg_roic is None or avg_roic < filter.min_roic):
                continue

            result.append(StockInfo(
                ticker=ticker,
                name=long_name,
                date=str(datetime.today().date()),
                price=current_price,
                volume=volume,
                pe_ratio=pe_ratio,
                pb_ratio=pb_ratio,
                eps=eps,
                dividend_yield=dividend_yield,
                gross_margin=avg_gross_margin,
                roe=avg_roe,
                roa=avg_roa,
                roic=avg_roic
            ))

        except Exception as e:
            print(f"Error processing {ticker}: {e}")
            continue

    return result
