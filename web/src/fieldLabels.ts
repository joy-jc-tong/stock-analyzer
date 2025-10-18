// 欄位中英文對照表
export const fieldLabels: Record<string, string> = {
  // 基本資訊
  ticker: "股票代碼",
  name: "公司名稱",
  industry: "產業類別",
  
  // 價格相關
  price: "股價",
  market_cap: "市值",
  
  // 獲利指標
  eps_ttm: "每股盈餘 (EPS)",
  pe: "本益比 (P/E)",
  pb: "股價淨值比 (P/B)",
  roe: "股東權益報酬率 (ROE)",
  
  // 財務健全度
  current_ratio: "流動比率",
  debt_to_equity: "負債權益比",
  
  // 成長性
  revenue_yoy: "營收年增率 (YoY)",
};

// 將英文欄位名稱轉換為中文
export function getFieldLabel(field: string): string {
  return fieldLabels[field] || field;
}

// 取得所有欄位的中文標籤陣列
export function getFieldLabels(fields: string[]): Array<{value: string; label: string}> {
  return fields.map(field => ({
    value: field,
    label: getFieldLabel(field)
  }));
}

