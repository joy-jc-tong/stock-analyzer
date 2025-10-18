# Server (FastAPI)

## Setup
```bash
cd server
python -m venv .venv
# Windows: .venv\Scripts\activate  | macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
python data/gen_data.py   # generate offline reproducible dataset
uvicorn main:app --reload
