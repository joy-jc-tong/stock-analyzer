import React from "react";
import { api, API_BASE } from "../api";
export default function ChartPane({ticker}:{ticker:string|null}){
  const [url,setUrl]=React.useState<string|null>(null);
  const [error,setError]=React.useState<string|null>(null);
  const [loading,setLoading]=React.useState<boolean>(false);
  
  React.useEffect(()=>{
    if(!ticker){ setUrl(null); setError(null); return; }
    setLoading(true);
    setError(null);
    api.get(`/api/stock/${ticker}/chart`).then(res=>{
      setUrl(API_BASE + res.data.url + `?t=${Date.now()}`);
    }).catch(err=>{
      setUrl(null);
      setError(`無法載入圖表: ${err.response?.data?.detail || err.message}`);
    }).finally(()=>setLoading(false));
  },[ticker]);
  
  if(!ticker) return (
    <div className="text-center py-16 space-y-3 bg-gray-50 rounded-lg border border-gray-200">
      <div className="text-gray-500 text-lg">尚未選擇股票</div>
      <div className="text-gray-400 text-sm">點擊表格中的股票代碼查看圖表</div>
    </div>
  );
  
  if(loading) return (
    <div className="text-center py-16 space-y-3 bg-gray-50 rounded-lg border border-gray-200">
      <div className="text-gray-600 text-lg">圖表生成中…</div>
      <div className="flex justify-center">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-700 rounded-full animate-spin"></div>
      </div>
    </div>
  );
  
  if(error) return (
    <div className="text-center py-16 space-y-3 bg-gray-100 rounded-lg border border-gray-300">
      <div className="text-gray-900 text-lg">圖表載入失敗</div>
      <div className="text-gray-700 text-sm">{error}</div>
    </div>
  );
  
  if(!url) return (
    <div className="text-center py-16 space-y-3 bg-gray-50 rounded-lg border border-gray-200">
      <div className="text-gray-500 text-lg">無資料</div>
    </div>
  );
  
  return (
    <div className="fade-in">
      <img 
        src={url} 
        alt={`${ticker} chart`} 
        className="w-full rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
      />
    </div>
  );
}

