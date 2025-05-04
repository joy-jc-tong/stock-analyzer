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

