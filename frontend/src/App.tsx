import { useState } from "react";

type StockInfo = {
  ticker: string;
  pe_ratio?: number | null;
  dividend_yield?: number | null;
  revenue_growth?: number | null;
};

function App() {
  // 圖表查詢狀態
  const [ticker, setTicker] = useState("");
  const [period, setPeriod] = useState("");
  const [interval, setInterval] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 篩選器狀態
  const [maxPE, setMaxPE] = useState("");
  const [minDividendYield, setMinDividendYield] = useState("");
  const [avgVolumeDays, setAvgVolumeDays] = useState("");
  const [avgVolumeValue, setAvgVolumeValue] = useState("");
  const [avgVolumeDir, setAvgVolumeDir] = useState("above");
  const [pbUpper, setPbUpper] = useState("2");
  const [eps, setEPS] = useState("");
  const [grossMarginYears, setGrossMarginYears] = useState("");
  const [grossMarginValue, setGrossMarginValue] = useState("");
  const [roeYears, setRoeYears] = useState("");
  const [roeValue, setRoeValue] = useState("");
  const [roaYears, setRoaYears] = useState("");
  const [roaValue, setRoaValue] = useState("");
  const [roicYears, setRoicYears] = useState("");
  const [roicValue, setRoicValue] = useState("");
  const [screenResults, setScreenResults] = useState<StockInfo[]>([]);
  const [screenLoading, setScreenLoading] = useState(false);

  // 查圖表
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!ticker || !period || !interval) return;

    setLoading(true);
    setImageUrl(null);

    try {
      const response = await fetch("/api/v1/stocks/plot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker, period, interval }),
      });

      if (!response.ok) throw new Error("圖表取得失敗");

      const blob = await response.blob();
      const imgUrl = URL.createObjectURL(blob);
      setImageUrl(imgUrl);
    } catch (err) {
      alert("發生錯誤，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  // 篩選處理
  const handleScreen = async () => {
    setScreenLoading(true);
    setScreenResults([]);
    try {
      const response = await fetch("/api/v1/stocks/screen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          max_pe: maxPE ? parseFloat(maxPE) : undefined,
          min_dividend_yield: minDividendYield ? parseFloat(minDividendYield) : undefined,
          avg_volume_days: avgVolumeDays ? parseInt(avgVolumeDays) : undefined,
          avg_volume_value: avgVolumeValue ? parseFloat(avgVolumeValue) : undefined,
          avg_volume_dir: avgVolumeDir,
          pb_upper: pbUpper ? parseFloat(pbUpper) : undefined,
          eps: eps ? parseFloat(eps) : undefined,
          gross_margin_years: grossMarginYears ? parseInt(grossMarginYears) : undefined,
          gross_margin_value: grossMarginValue ? parseFloat(grossMarginValue) : undefined,
          roe_years: roeYears ? parseInt(roeYears) : undefined,
          roe_value: roeValue ? parseFloat(roeValue) : undefined,
          roa_years: roaYears ? parseInt(roaYears) : undefined,
          roa_value: roaValue ? parseFloat(roaValue) : undefined,
          roic_years: roicYears ? parseInt(roicYears) : undefined,
          roic_value: roicValue ? parseFloat(roicValue) : undefined,
        }),
      });
      if (!response.ok) throw new Error("篩選失敗");
      const data: StockInfo[] = await response.json();
      setScreenResults(data);
    } catch {
      alert("篩選時發生錯誤");
    } finally {
      setScreenLoading(false);
    }
  };

  // 表格點選 → 查圖
  const handleSelectTicker = (symbol: string) => {
    setTicker(symbol);
    setPeriod("1mo");
    setInterval("1d");
    handleSubmit();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 space-y-10">

      {/* 股票篩選器 */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">📋 股票篩選器</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <input type="number" placeholder="本益比上限" value={maxPE} onChange={(e) => setMaxPE(e.target.value)} className="p-2 border rounded" />
          <input type="number" placeholder="殖利率下限 (%)" value={minDividendYield} onChange={(e) => setMinDividendYield(e.target.value)} className="p-2 border rounded" />
          <div className="flex gap-2">
            <input type="number" placeholder="N天均量" value={avgVolumeDays} onChange={(e) => setAvgVolumeDays(e.target.value)} className="p-2 border rounded w-1/3" />
            <input type="number" placeholder="數值 (萬)" value={avgVolumeValue} onChange={(e) => setAvgVolumeValue(e.target.value)} className="p-2 border rounded w-1/3" />
            <select value={avgVolumeDir} onChange={(e) => setAvgVolumeDir(e.target.value)} className="p-2 border rounded w-1/3">
              <option value="above">以上</option>
              <option value="below">以下</option>
            </select>
          </div>
          <input type="number" placeholder="每股盈餘 EPS" value={eps} onChange={(e) => setEPS(e.target.value)} className="p-2 border rounded" />
          <input type="number" placeholder="股價淨值比上限 (預設2)" value={pbUpper} onChange={(e) => setPbUpper(e.target.value)} className="p-2 border rounded" />
          <div className="flex gap-2">
            <input type="number" placeholder="N年" value={grossMarginYears} onChange={(e) => setGrossMarginYears(e.target.value)} className="p-2 border rounded w-1/2" />
            <input type="number" placeholder="毛利率 >%" value={grossMarginValue} onChange={(e) => setGrossMarginValue(e.target.value)} className="p-2 border rounded w-1/2" />
          </div>
          <div className="flex gap-2">
            <input type="number" placeholder="N年" value={roeYears} onChange={(e) => setRoeYears(e.target.value)} className="p-2 border rounded w-1/2" />
            <input type="number" placeholder="ROE >" value={roeValue} onChange={(e) => setRoeValue(e.target.value)} className="p-2 border rounded w-1/2" />
          </div>
          <div className="flex gap-2">
            <input type="number" placeholder="N年" value={roaYears} onChange={(e) => setRoaYears(e.target.value)} className="p-2 border rounded w-1/2" />
            <input type="number" placeholder="ROA >" value={roaValue} onChange={(e) => setRoaValue(e.target.value)} className="p-2 border rounded w-1/2" />
          </div>
          <div className="flex gap-2">
            <input type="number" placeholder="N年" value={roicYears} onChange={(e) => setRoicYears(e.target.value)} className="p-2 border rounded w-1/2" />
            <input type="number" placeholder="ROIC >" value={roicValue} onChange={(e) => setRoicValue(e.target.value)} className="p-2 border rounded w-1/2" />
          </div>
          <button onClick={handleScreen} disabled={screenLoading} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            {screenLoading ? "篩選中..." : "篩選股票"}
          </button>
        </div>

        {screenResults.length > 0 && (
          <table className="table-auto w-full border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-2 py-1">代號</th>
                <th className="border px-2 py-1">名稱</th>
                <th className="border px-2 py-1">資料日</th>
                <th className="border px-2 py-1">股價</th>
                <th className="border px-2 py-1">成交量</th>
                <th className="border px-2 py-1">股價淨值比</th>
                <th className="border px-2 py-1">本益比</th>
                <th className="border px-2 py-1">每股盈餘</th>
                <th className="border px-2 py-1">毛利率</th>
                <th className="border px-2 py-1">ROE</th>
                <th className="border px-2 py-1">ROA</th>
                <th className="border px-2 py-1">ROIC</th>
              </tr>
            </thead>
            <tbody>
              {screenResults.map((stock) => (
                <tr
                  key={stock.ticker}
                  onClick={() => handleSelectTicker(stock.ticker)}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  <td className="border px-4 py-2 text-blue-600 underline">{stock.ticker}</td>
                  <td className="border px-4 py-2">{stock.pe_ratio?.toFixed(2) ?? "-"}</td>
                  <td className="border px-4 py-2">{stock.dividend_yield?.toFixed(2) ?? "-"}</td>
                  <td className="border px-4 py-2">{stock.revenue_growth?.toFixed(2) ?? "-"}</td> {/* ✅ 新欄位 */}
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!screenLoading && screenResults.length === 0 && (
          <p className="text-gray-400 mt-4">尚無符合條件的股票</p>
        )}
      </div>

      {/* 股票走勢圖 */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">📈 股票走勢圖</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            placeholder="股票代號(e.g. AAPL)"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="資料區間(e.g. 1mo)"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="表示區間(e.g. 1d)"
            value={interval}
            onChange={(e) => setInterval(e.target.value)}
            className="p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="sm:col-span-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {loading ? "載入中..." : "取得資料"}
          </button>
        </form>

        <div className="text-center">
          {loading && <p className="text-gray-500">載入圖表中...</p>}
          {imageUrl && (
            <img src={imageUrl} alt="Stock Chart" className="mx-auto max-w-full h-auto" />
          )}
          {!imageUrl && !loading && (
            <p className="text-gray-400">此處將顯示圖表</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
