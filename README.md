# Stock Analyzer

Stock Analyzer 是一個以 Python 為核心的資料處理與分析流程示範專案，
用股票資料作為範例資料型態，展示資料從產生、轉換到提供給分析與 BI 使用的完整流程。

本專案重點在於資料管線設計與資料服務化，不著重於投資或選股邏輯，
可視為通用結構化資料的 ETL 與分析範例。

---

## 本專案模擬的情境（What this project simulates）

結構化時間序列資料（以股票資料為例）

資料流程：
Raw data → ETL → Analysis-ready datasets → API / BI consumption
- 常見分析情境：
  - 條件式篩選與排序
  - 排名（Top-N）
  - 衍生欄位與指標計算

---

## 技術重點

使用 Python 進行資料產生與轉換（pandas / numpy）
將處理後資料輸出為 CSV 與 API，供前端或 Power BI 使用
以圖表產出作為資料品質與流程驗證
