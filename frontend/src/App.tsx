import { useState } from "react";

function App() {
  const [ticker, setTicker] = useState("");
  const [period, setPeriod] = useState("");
  const [interval, setInterval] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setImageUrl(null);

    try {
      const response = await fetch("http://localhost:8000/api/v1/stocks/plot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ticker, period, interval })
      });

      if (!response.ok) {
        throw new Error("圖表取得失敗");
      }

      const blob = await response.blob();
      const imgUrl = URL.createObjectURL(blob);
      setImageUrl(imgUrl);
    } catch (err) {
      console.error(err);
      alert("發生錯誤，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow p-6 mb-6 space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Ticker (e.g. AAPL)"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Period (e.g. 1mo)"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Interval (e.g. 1d)"
            value={interval}
            onChange={(e) => setInterval(e.target.value)}
            className="p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {loading ? "載入中..." : "取得資料"}
        </button>
      </form>

      <div className="bg-white rounded-2xl shadow p-6 text-center">
        {loading && <p className="text-gray-500">載入圖表中...</p>}
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Stock Chart"
            className="mx-auto max-w-full h-auto"
          />
        )}
        {!imageUrl && !loading && (
          <p className="text-gray-400">此處將顯示圖表</p>
        )}
      </div>
    </div>
  );
}

export default App;
