from pathlib import Path
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import string
import random

BASE = Path(__file__).resolve().parent
PRICES = BASE / "prices"
PRICES.mkdir(parents=True, exist_ok=True)

np.random.seed(42)
random.seed(42)

def random_code(i:int) -> str:
    # AAA1, AAB2, ...
    letters = ''.join(random.choices(string.ascii_uppercase, k=3))
    return f"{letters}{i%9+1}"

def gen_universe(n=200):
    industries = ["Technology","Semiconductors","Finance","Healthcare","Consumer","Energy","Utilities","Industrial"]
    rows=[]
    for i in range(n):
        ticker = random_code(i)
        name = f"{ticker} Corp."
        industry = random.choice(industries)
        pe = np.round(np.random.uniform(8,60),2)
        eps = np.round(np.random.uniform(0.5,8),2)
        price = np.round(pe * eps * np.random.uniform(0.95,1.05),2)
        pb = np.round(np.random.uniform(0.8,20),2)
        roe = np.round(np.random.uniform(0.05,0.35),3)
        current_ratio = np.round(np.random.uniform(0.8,3.5),2)
        d2e = np.round(np.random.uniform(0.0,2.5),2)
        yoy = np.round(np.random.uniform(-0.2,0.8),3)
        mcap = int(10**9 * np.random.uniform(1,1000))
        rows.append([ticker,name,industry,price,eps,pe,pb,roe,current_ratio,d2e,yoy,mcap])
    df = pd.DataFrame(rows, columns=[
        "ticker","name","industry","price","eps_ttm","pe","pb","roe",
        "current_ratio","debt_to_equity","revenue_yoy","market_cap"
    ])
    return df

def gbm_series(start_price:float, days:int=252):
    dt = 1/252
    mu = 0.12
    sigma = 0.35
    prices=[start_price]
    for _ in range(days-1):
        shock = np.random.normal((mu - 0.5*sigma**2)*dt, sigma*np.sqrt(dt))
        prices.append(prices[-1]*np.exp(shock))
    return np.array(prices)

def gen_prices(ticker:str, start_price:float, days:int=252):
    end = datetime.today()
    dates = [end - timedelta(days=x) for x in range(days*2)]
    dates = [d for d in dates if d.weekday() < 5][:days]
    dates = sorted(dates)
    close = gbm_series(start_price, len(dates))
    open_ = close * (1 + np.random.normal(0, 0.005, len(dates)))
    high = np.maximum(open_, close) * (1 + np.abs(np.random.normal(0, 0.01, len(dates))))
    low = np.minimum(open_, close) * (1 - np.abs(np.random.normal(0, 0.01, len(dates))))
    vol = np.random.randint(1_000_000, 100_000_000, len(dates))
    df = pd.DataFrame({"date":dates,"open":open_,"high":high,"low":low,"close":close,"volume":vol})
    df["open"]=df["open"].round(2); df["high"]=df["high"].round(2); df["low"]=df["low"].round(2); df["close"]=df["close"].round(2)
    return df

def main():
    FUND = BASE / "fundamentals.csv"
    df = gen_universe(200)
    df.to_csv(FUND, index=False)
    for _, r in df.iterrows():
        p = gen_prices(r["ticker"], float(r["price"]), 252)
        p.to_csv(PRICES / f'{r["ticker"]}.csv', index=False)
    print("✅ Generated fundamentals.csv and 200 price CSVs.")

if __name__ == "__main__":
    main()
