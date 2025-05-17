# 📈 Stock Analyzer – 股票分析與篩選平台

一個以「產品思維」打造的股票投資分析平台，目標是讓使用者能夠快速篩選潛力股、視覺化觀察市場趨勢，並記錄與驗證自己的投資策略。專案以模擬 SaaS 架構設計，兼顧技術深度與使用者體驗。

---

## 🔧 功能特色（MVP）

- 擷取台股/美股公開資料（如 yfinance）
- 自訂條件篩選股票（本益比、營收成長等）
- 基本圖表視覺化（K 線圖、營收趨勢）
- 前端參數輸入 + 即時篩選回傳
- 假想 Persona 操作情境（上班族、投資新手）

---

## 📦 技術架構

| 層級 | 技術 |
|------|------|
| 前端 | React + TypeScript + TailwindCSS |
| 後端 | FastAPI + Pydantic |
| 資料 | yfinance / 其他 API + pandas 處理 |
| 部署 | Docker + Railway/Render |
| 測試 | pytest + requests |
| 儲存 | SQLite（可擴充 PostgreSQL）|

---

## 📁 專案結構簡介

一、開機後啟動「開發環境」

<aside>

```bash
# 1. 啟動前端（熱更新在 http://localhost:5173）
cd frontend
npm run dev
# 2. 另開一個終端機視窗啟動後端（FastAPI，http://localhost:8000）
cd ..
docker compose -f docker-compose.dev.yml up --build
```

</aside>

二、開發完成 → 切換為「部屬環境」

```bash
# 1. 停止目前正在跑的開發前後端（按 Ctrl + C）
#    包括 frontend 的 npm 和 docker 的後端

# 2. 重新打包整個前後端並啟動部屬版（將 React build 並嵌入 FastAPI）
docker compose -f docker-compose.prod.yml build --no-cache
docker compose -f docker-compose.prod.yml up
```

> ✅ 成功後可透過 http://localhost:8000 看到嵌入式的前端頁面。
> 

---

三、日後開機直接進入「部屬環境」

```bash
# 啟動部署環境（FastAPI + 已打包的 React）
docker compose -f docker-compose.prod.yml up
```

完全清掉容器、網路、volume →

<aside>

docker compose -f docker-compose.prod.yml down --volumes --remove-orphans

</aside>

