from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import yfinance as yf
import matplotlib.pyplot as plt
import io

router = APIRouter()

class StockRequest(BaseModel):
    ticker: str
    period: str
    interval: str

@router.post("/plot")
async def plot_stock(data: StockRequest):
    try:
        df = yf.download(data.ticker, period=data.period, interval=data.interval)

        if df.empty:
            raise HTTPException(status_code=404, detail="找不到資料")

        plt.figure(figsize=(10, 5))
        plt.plot(df.index, df['Close'], label='Close Price')
        plt.title(f"{data.ticker.upper()} Stock Price")
        plt.xlabel("Date")
        plt.ylabel("Price")
        plt.legend()
        plt.grid(True)

        buf = io.BytesIO()
        plt.savefig(buf, format='png')
        plt.close()
        buf.seek(0)

        return StreamingResponse(buf, media_type="image/png")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"伺服器錯誤: {str(e)}")
