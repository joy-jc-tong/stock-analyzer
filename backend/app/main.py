from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import stocks

app = FastAPI(
    title="Stock Analyzer API",
    version="1.0.0"
)

# 如果你前端是 localhost:5173，加入 CORS 設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 掛載路由
app.include_router(stocks.router, prefix="/api/v1")
