from fastapi import APIRouter
from app.database.schemas import StockFilter, StockInfo
from app.services.screener import screen_stocks
from typing import List

router = APIRouter(prefix="/api/v1/stocks", tags=["Stocks"])

@router.post("/screen", response_model=List[StockInfo])
async def screen_stocks_endpoint(filter: StockFilter):
    return screen_stocks(filter)
