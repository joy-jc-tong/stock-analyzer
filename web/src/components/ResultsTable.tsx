import { StockRow } from "../types";
import { getFieldLabel } from "../fieldLabels";

type Props = { rows: StockRow[]; onPick:(ticker:string)=>void; sortBy:string|null; setSortBy:(f:string)=>void; };
export default function ResultsTable({rows,onPick,sortBy,setSortBy}:Props){
  if(!rows.length) return (
    <div className="text-center py-16 space-y-3">
      <div className="text-6xl">🔎</div>
      <div className="text-gray-500 text-lg">尚無篩選結果</div>
      <div className="text-gray-400 text-sm">設定篩選條件後點擊「執行篩選」</div>
    </div>
  );
  
  const columns = Object.keys(rows[0]);
  return (
    <div className="overflow-auto rounded-lg border border-gray-200">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100 sticky top-0 z-10">
          <tr>{columns.map(c=>(
            <th 
              key={c} 
              className="text-left px-4 py-3 cursor-pointer font-semibold text-gray-900 hover:bg-gray-200 transition-colors duration-150 select-none group"
              onClick={()=>setSortBy(c)}
              title={c}
            >
              <div className="flex items-center gap-1 whitespace-nowrap">
                <span>{getFieldLabel(c)}</span>
                {sortBy===c && <span className="text-gray-900">▼</span>}
                {sortBy!==c && <span className="text-gray-400 opacity-0 group-hover:opacity-100">▼</span>}
              </div>
            </th>))}</tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {rows.map((r,idx)=>(
            <tr 
              key={idx} 
              className={`hover:bg-gray-100 transition-colors duration-150 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
            >
              {columns.map((c,i)=>{
                const value = r[c];
                const formatValue = (val: any, col: string) => {
                  if (val === null || val === undefined) return '-';
                  // 數值類型格式化
                  if (typeof val === 'number') {
                    // 市值顯示為億
                    if (col === 'market_cap') {
                      return (val / 100000000).toFixed(2) + ' 億';
                    }
                    // 比率顯示為百分比
                    if (['roe', 'revenue_yoy'].includes(col)) {
                      return (val * 100).toFixed(2) + '%';
                    }
                    // 其他數值保留2位小數
                    return val.toFixed(2);
                  }
                  return String(val);
                };
                
                return (
                  <td key={i} className="px-4 py-3 whitespace-nowrap">
                    {c==="ticker"
                      ? <button 
                          className="text-gray-900 font-semibold hover:text-black hover:underline transition-colors duration-150" 
                          onClick={()=>onPick(String(value))}
                        >
                          {value}
                        </button>
                      : <span className="text-gray-800">{formatValue(value, c)}</span>}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

