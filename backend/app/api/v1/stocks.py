from fastapi import APIRouter, Query, HTTPException
from fastapi.responses import StreamingResponse
from app.services.fetcher import fetch_stock_data
from app.services.visualizer import plot_stock_chart
import io

router = APIRouter()

@router.get("/chart")
def get_stock_chart(
    ticker: str = Query(..., description="股票代號，如 AAPL"),
    period: str = Query("1mo", description="時間範圍，例如 1d, 5d, 1mo, 3mo, 6mo, 1y, 5y, max"),
    interval: str = Query("1d", description="時間間隔，例如 1m, 2m, 5m, 15m, 1d, 1wk, 1mo")
):
    df = fetch_stock_data(ticker, period, interval)
    if df is None or df.empty:
        raise HTTPException(status_code=404, detail="查無資料")

    image_bytes = plot_stock_chart(df, ticker)
    if not image_bytes:
        raise HTTPException(status_code=500, detail="圖表生成失敗")

    return StreamingResponse(io.BytesIO(image_bytes), media_type="image/png")
