from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
from typing import List, Optional, Literal, Union
from pathlib import Path
from datetime import datetime
import pandas as pd
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

DATA_DIR = Path(__file__).parent / "data"
PRICES_DIR = DATA_DIR / "prices"
STATIC_DIR = Path(__file__).parent / "static"
CHARTS_DIR = STATIC_DIR / "charts"
CHARTS_DIR.mkdir(parents=True, exist_ok=True)

app = FastAPI(title="Stock Screener API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"],
)

def load_fundamentals() -> pd.DataFrame:
    fp = DATA_DIR / "fundamentals.csv"
    if not fp.exists():
        raise FileNotFoundError("fundamentals.csv missing. Run: python data/gen_data.py")
    df = pd.read_csv(fp, dtype={"ticker": str})
    return df

def load_price(ticker: str) -> pd.DataFrame:
    fp = PRICES_DIR / f"{ticker}.csv"
    if not fp.exists():
        raise FileNotFoundError(f"prices file missing for {ticker}")
    df = pd.read_csv(fp, parse_dates=["date"])
    df = df.sort_values("date").reset_index(drop=True)
    return df

Operator = Literal["eq","ne","gt","gte","lt","lte","between","contains","in"]

class FilterItem(BaseModel):
    field: str
    op: Operator
    value: Union[str, float, int, List[Union[str, float, int]]]
    exclude: bool = False

class SortSpec(BaseModel):
    field: str
    direction: Literal["asc","desc"] = "desc"

class RankSpec(BaseModel):
    by: str
    top_n: int = Field(50, ge=1)

class ColArithmetic(BaseModel):
    name: str
    expr: str  # e.g. "(roe + revenue_yoy) / pe"

class ScreenRequest(BaseModel):
    filters: List[FilterItem] = []
    sorts: List[SortSpec] = []
    rank: Optional[RankSpec] = None
    computed_cols: List[ColArithmetic] = []
    page: int = 1
    page_size: int = 50

def apply_filters(df: pd.DataFrame, filters: List[FilterItem]) -> pd.DataFrame:
    out = df.copy()
    for f in filters:
        if f.field not in out.columns:
            raise HTTPException(400, f"Unknown field {f.field}")
        if f.op == "between":
            lo, hi = f.value if isinstance(f.value, list) else (None, None)
            mask = (out[f.field] >= float(lo)) & (out[f.field] <= float(hi))
        elif f.op == "eq":
            mask = out[f.field] == f.value
        elif f.op == "ne":
            mask = out[f.field] != f.value
        elif f.op == "gt":
            mask = out[f.field] > float(f.value)
        elif f.op == "gte":
            mask = out[f.field] >= float(f.value)
        elif f.op == "lt":
            mask = out[f.field] < float(f.value)
        elif f.op == "lte":
            mask = out[f.field] <= float(f.value)
        elif f.op == "contains":
            mask = out[f.field].astype(str).str.contains(str(f.value), case=False, na=False)
        elif f.op == "in":
            vals = f.value if isinstance(f.value, list) else [f.value]
            mask = out[f.field].isin(vals)
        else:
            raise HTTPException(400, f"Unknown op {f.op}")
        out = out[~mask] if f.exclude else out[mask]
    return out

def apply_computed_cols(df: pd.DataFrame, specs: List[ColArithmetic]) -> pd.DataFrame:
    out = df.copy()
    env = {c: out[c] for c in out.columns}
    env["np"] = np
    for s in specs:
        try:
            out[s.name] = eval(s.expr, {"__builtins__": {}}, env)
        except Exception as e:
            raise HTTPException(400, f"computed col '{s.name}' error: {e}")
    return out

def apply_sorts(df: pd.DataFrame, sorts: List[SortSpec]) -> pd.DataFrame:
    if not sorts: return df
    by = [s.field for s in sorts]
    ascending = [s.direction == "asc" for s in sorts]
    return df.sort_values(by=by, ascending=ascending)

def apply_rank(df: pd.DataFrame, rank: Optional[RankSpec]) -> pd.DataFrame:
    if not rank: return df
    return df.sort_values(rank.by, ascending=False).head(rank.top_n)

@app.get("/api/health")
def health():
    return {"ok": True, "time": datetime.utcnow().isoformat()}

@app.get("/api/options")
def options():
    df = load_fundamentals()
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    category_cols = [c for c in df.columns if c not in numeric_cols]
    return {"numeric_fields": numeric_cols, "category_fields": category_cols,
            "default_sorts": [{"field": "market_cap", "direction": "desc"}]}

@app.post("/api/screen")
def screen(req: ScreenRequest):
    df = load_fundamentals()
    if req.computed_cols: df = apply_computed_cols(df, req.computed_cols)
    if req.filters: df = apply_filters(df, req.filters)
    if req.sorts: df = apply_sorts(df, req.sorts)
    if req.rank: df = apply_rank(df, req.rank)
    total = len(df)
    page = max(req.page, 1)
    page_size = max(min(req.page_size, 200), 1)
    start = (page - 1) * page_size
    end = start + page_size
    items = df.iloc[start:end].to_dict(orient="records")
    return {"total": total, "page": page, "page_size": page_size, "items": items}

@app.get("/api/stock/{ticker}/chart")
def stock_chart(ticker: str):
    df = load_price(ticker)
    if df.empty: raise HTTPException(404, "no price data")
    close = df["close"]
    ma5 = close.rolling(5).mean()
    ma20 = close.rolling(20).mean()
    vol = df["volume"]

    fig = plt.figure(figsize=(8, 4.5), dpi=120)
    ax_price = fig.add_axes([0.08, 0.35, 0.88, 0.6])
    ax_vol = fig.add_axes([0.08, 0.10, 0.88, 0.2], sharex=ax_price)

    ax_price.plot(df["date"], close, label="Close")
    ax_price.plot(df["date"], ma5, label="MA5")
    ax_price.plot(df["date"], ma20, label="MA20")
    ax_price.set_title(f"{ticker} - Price")
    ax_price.legend(loc="upper left")
    ax_price.grid(True, alpha=0.3)

    ax_vol.bar(df["date"], vol)
    ax_vol.set_title("Volume")
    ax_vol.grid(True, alpha=0.3)

    fp = CHARTS_DIR / f"{ticker}.png"
    fig.autofmt_xdate()
    fig.savefig(fp, bbox_inches="tight")
    plt.close(fig)
    return {"url": f"/static/charts/{ticker}.png"}

app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")
