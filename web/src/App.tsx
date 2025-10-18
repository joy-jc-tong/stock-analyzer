import React from "react";
import { api } from "./api";
import { FilterItem, ScreenRequest, SortSpec } from "./types";
import { getFieldLabel } from "./fieldLabels";
import FilterRow from "./components/FilterRow";
import ResultsTable from "./components/ResultsTable";
import ChartPane from "./components/ChartPane";

type Opts = { numeric_fields: string[]; category_fields: string[] };

export default function App(){
  const [opts,setOpts]=React.useState<Opts>({numeric_fields:[], category_fields:[]});
  const [filters,setFilters]=React.useState<FilterItem[]>([]);
  const [sorts,setSorts]=React.useState<SortSpec[]>([{field:"market_cap",direction:"desc"}]);
  const [rows,setRows]=React.useState<any[]>([]);
  const [ticker,setTicker]=React.useState<string|null>(null);
  const [loading,setLoading]=React.useState<boolean>(false);
  const [error,setError]=React.useState<string|null>(null);

  React.useEffect(()=>{ 
    api.get("/api/options")
      .then(r=>setOpts(r.data))
      .catch(err=>setError(`無法載入欄位選項: ${err.message}`)); 
  },[]);

  const addFilter = ()=> setFilters([...filters,{field:"pe",op:"gt",value:"",exclude:false}]);
  const updateFilter=(i:number,patch:Partial<FilterItem>)=>{
    const draft=[...filters]; draft[i]={...draft[i],...patch}; setFilters(draft);
  };
  const removeFilter=(i:number)=> setFilters(filters.filter((_,idx)=>idx!==i));

  const runScreen=React.useCallback(async ()=>{
    try {
      setLoading(true);
      setError(null);
      const cast=(v:any)=>{
        if(Array.isArray(v)) return v.map(x=>x===""?x:Number(x));
        if(v===""||v==null) return v;
        const n=Number(v); return isNaN(n)?v:n;
      };
      const req:ScreenRequest={filters:filters.map(f=>({...f, value:cast(f.value)})),
        sorts, computed_cols:[], page:1, page_size:100};
      const res=await api.post("/api/screen", req);
      setRows(res.data.items); setTicker(null);
    } catch(err: any) {
      let errorMsg = "未知錯誤";
      if (err.response?.data?.detail) {
        const detail = err.response.data.detail;
        if (Array.isArray(detail)) {
          errorMsg = detail.map((e: any) => {
            if (typeof e === 'object') {
              return `${e.loc?.join(' -> ') || ''}: ${e.msg || JSON.stringify(e)}`;
            }
            return String(e);
          }).join('; ');
        } else if (typeof detail === 'object') {
          errorMsg = JSON.stringify(detail);
        } else {
          errorMsg = String(detail);
        }
      } else if (err.message) {
        errorMsg = err.message;
      }
      setError(`篩選失敗: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  }, [filters, sorts]);

  const handleSortChange = (field: string) => {
    setSorts([{field, direction:"desc"}]);
    // 如果已經有篩選結果，重新執行篩選以套用新排序
    if(rows.length > 0) {
      setTimeout(() => runScreen(), 0);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* 標題區域 */}
        <div className="mb-8 fade-in">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            股票篩選器 by 童
          </h1>
        </div>

        {/* 錯誤提示 */}
        {error && (
          <div className="bg-gray-100 border-l-4 border-gray-700 text-gray-900 px-4 py-3 rounded-lg mb-6 shadow-sm fade-in flex items-start gap-3">
            <div className="flex-1">{error}</div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左側篩選區 */}
          <section className="lg:col-span-1 space-y-4">
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <span>篩選條件</span>
                </h2>
                <button className="btn text-sm" onClick={addFilter}>
                  <span className="text-gray-900">+ 新增</span>
                </button>
              </div>
              
              {filters.length===0 && (
                <div className="text-center py-8 text-gray-400 space-y-2">
                  <div className="text-sm">尚未設定篩選條件</div>
                  <div className="text-xs">點擊上方按鈕新增</div>
                </div>
              )}
              
              <div className="space-y-3">
                {filters.map((f,i)=>(
                  <div key={i} className="fade-in">
                    <FilterRow
                      index={i}
                      fields={[...opts.numeric_fields, ...opts.category_fields]}
                      value={f}
                      onChange={updateFilter}
                      onRemove={removeFilter}/>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-5">
              <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <span>排序方式</span>
              </label>
              <select className="input w-full"
                value={sorts[0]?.field ?? ""}
                onChange={e=>setSorts([{field:e.target.value, direction:"desc"}])}>
                {[...opts.numeric_fields, ...opts.category_fields].map(f=>
                  <option key={f} value={f}>{getFieldLabel(f)}</option>
                )}
              </select>
            </div>

            <button className="btn-primary w-full" onClick={runScreen} disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="spinner"></span>
                  <span>篩選中...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>執行篩選</span>
                </span>
              )}
            </button>
          </section>

          {/* 右側結果區 */}
          <section className="lg:col-span-2 space-y-6">
            <div className="card p-5">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>篩選結果</span>
                {rows.length > 0 && (
                  <span className="text-sm font-normal text-gray-600 ml-auto">
                    共 {rows.length} 筆
                  </span>
                )}
              </h2>
              <ResultsTable rows={rows} onPick={setTicker} sortBy={sorts[0]?.field ?? null} setSortBy={handleSortChange}/>
            </div>

            <div className="card p-5">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>技術圖表</span>
                {ticker && (
                  <span className="text-sm font-normal text-gray-900 ml-2">
                    {ticker}
                  </span>
                )}
              </h2>
              <ChartPane ticker={ticker}/>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

