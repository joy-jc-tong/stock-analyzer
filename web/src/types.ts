export type Operator = "eq"|"ne"|"gt"|"gte"|"lt"|"lte"|"between"|"contains";
export type FilterItem = { field: string; op: Operator; value: string | number | (string|number)[]; exclude?: boolean; };
export type SortSpec = { field: string; direction: "asc" | "desc" };
export type RankSpec = { by: string; top_n: number };
export type ScreenRequest = { filters: FilterItem[]; sorts: SortSpec[]; rank?: RankSpec; computed_cols: {name:string;expr:string}[]; page: number; page_size: number; };
export type StockRow = Record<string, string | number>;

