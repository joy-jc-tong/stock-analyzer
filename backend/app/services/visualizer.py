import io
import matplotlib.pyplot as plt
import pandas as pd
from typing import Optional


def plot_stock_chart(df: pd.DataFrame, ticker: str) -> Optional[bytes]:
    if df is None or df.empty:
        print("[plot_stock_chart] Empty DataFrame, cannot plot.")
        return None

    plt.figure(figsize=(10, 4))
    plt.plot(df["Date"], df["Close"], label="Close Price", color="blue")
    plt.title(f"{ticker.upper()} Stock Price")
    plt.xlabel("Date")
    plt.ylabel("Price (USD)")
    plt.grid(True)
    plt.legend()

    # Save plot to in-memory buffer
    buf = io.BytesIO()
    plt.tight_layout()
    plt.savefig(buf, format="png")
    plt.close()  # Close the figure to free memory
    buf.seek(0)
    return buf.read()
