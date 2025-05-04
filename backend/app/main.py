from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import stocks

app = FastAPI()

# 加入 CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 若只允許前端來源，填 ["http://localhost:5173"] 之類
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(stocks.router, prefix="/api/v1/stocks")
