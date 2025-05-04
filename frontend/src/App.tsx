import { useState } from "react";

function App() {
  const [ticker, setTicker] = useState("");
  const [period, setPeriod] = useState("1mo");
  const [interval, setInterval] = useState("1d");
  const [imageSrc, setImageSrc] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("http://localhost:8000/plot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ticker, period, interval }),
    });
    const data = await res.json();
    setImageSrc(`data:image/png;base64,${data.image}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">📈 Stock Analyzer</h1>
      
      {/* 上半部表單 */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow-md max-w-md mx-auto space-y-4"
      >
        <div>
          <label className="block font-medium">Ticker</label>
          <input
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="e.g. AAPL"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Period</label>
          <input
            type="text"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="e.g. 1mo, 6mo, 1y"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Interval</label>
          <input
            type="text"
            value={interval}
            onChange={(e) => setInterval(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="e.g. 1d, 1wk, 1mo"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>

      {/* 下半部圖表 */}
      <div className="mt-8 text-center">
        {imageSrc && (
          <img
            src={imageSrc}
            alt="Stock Chart"
            className="mx-auto border rounded shadow"
          />
        )}
      </div>
    </div>
  );
}

export default App;
