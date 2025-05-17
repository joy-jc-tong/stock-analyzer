from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
from app.api.v1 import stocks

app = FastAPI()

# 指定靜態資源目錄
static_dir = os.path.join(os.path.dirname(__file__), "static")
app.mount("/static", StaticFiles(directory=static_dir), name="static")

# 根目錄轉向 index.html
@app.get("/")
async def root():
    index_path = os.path.join(static_dir, "index.html")
    return FileResponse(index_path)

# 載入股票 API router（已內含 prefix）
app.include_router(stocks.router)
