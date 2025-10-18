import { FilterItem, Operator } from "../types";
import { getFieldLabel } from "../fieldLabels";

type Props = { index: number; fields: string[]; value: FilterItem; onChange: (i:number,p:Partial<FilterItem>)=>void; onRemove:(i:number)=>void; };
const ops:{label:string;value:Operator}[]=[
  {label:"=",value:"eq"},{label:"≠",value:"ne"},{label:">",value:"gt"},{label:">=",value:"gte"},
  {label:"<",value:"lt"},{label:"<=",value:"lte"},{label:"區間",value:"between"},{label:"包含",value:"contains"},
];
export default function FilterRow({index,fields,value,onChange,onRemove}:Props){
  const renderValue=()=>{
    if(value.op==="between"){
      const v=Array.isArray(value.value)?value.value:["",""];
      return (<div className="flex gap-2 items-center">
        <input className="input text-sm" placeholder="最小值" value={String(v[0]??"")}
          onChange={e=>onChange(index,{value:[e.target.value, Array.isArray(value.value)?value.value[1]:""]})}/>
        <span className="text-slate-400 font-medium">~</span>
        <input className="input text-sm" placeholder="最大值" value={String(v[1]??"")}
          onChange={e=>onChange(index,{value:[Array.isArray(value.value)?value.value[0]:"", e.target.value]})}/>
      </div>);
    }
    const displayValue = Array.isArray(value.value) ? "" : String(value.value??"");
    return (<input className="input w-full text-sm" placeholder="請輸入數值或文字"
      value={displayValue}
      onChange={e=>onChange(index,{value:e.target.value})}/>);
  };
  
  const handleOpChange = (newOp: Operator) => {
    // 當操作符改變時，調整 value 格式
    if (newOp === "between" && !Array.isArray(value.value)) {
      onChange(index, {op: newOp, value: ["", ""]});
    } else if (newOp !== "between" && Array.isArray(value.value)) {
      onChange(index, {op: newOp, value: ""});
    } else {
      onChange(index, {op: newOp});
    }
  };
  return (
    <div className="grid grid-cols-1 gap-2 p-3 border border-gray-200 rounded-lg bg-white hover:shadow-sm transition-all duration-200">
      <div className="grid grid-cols-[1fr_auto] gap-2">
        <select className="input text-sm" value={value.field} onChange={e=>onChange(index,{field:e.target.value})}>
          <option value="">-- 選擇欄位 --</option>
          {fields.map(f=><option key={f} value={f}>{getFieldLabel(f)}</option>)}
        </select>
        <select className="input w-28 text-sm" value={value.op} onChange={e=>handleOpChange(e.target.value as Operator)}>
          {ops.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
      {renderValue()}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input 
            type="checkbox" 
            checked={!!value.exclude} 
            onChange={e=>onChange(index,{exclude:e.target.checked})}
            className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-500 cursor-pointer"
          />
          <span className="text-sm text-gray-700 group-hover:text-gray-900">排除此條件</span>
        </label>
        <button 
          className="btn-ghost text-sm text-gray-600 hover:text-gray-900" 
          onClick={()=>onRemove(index)}
          title="刪除篩選條件"
        >
          刪除
        </button>
      </div>
    </div>
  );
}

