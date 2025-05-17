# 前端建置階段
FROM node:18-alpine AS frontend-build
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# 後端建置階段
FROM python:3.10-slim AS backend-build
WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/app/ ./app

# 整合階段（直接用 backend-build，節省重複安裝）
FROM backend-build AS final
WORKDIR /app
COPY --from=frontend-build /frontend/dist /app/app/static
CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
