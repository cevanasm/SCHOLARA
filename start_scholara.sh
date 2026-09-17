#!/bin/bash
set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

echo "Setting up SCHOLARA backend..."
cd backend
if [ ! -d venv ]; then python3 -m venv venv; fi
source venv/bin/activate
python -m pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8000 > ../backend.log 2>&1 &
BACKEND_PID=$!

cd ../frontend
npm install
echo ""
echo "SCHOLARA backend: http://127.0.0.1:8000"
echo "SCHOLARA API docs: http://127.0.0.1:8000/docs"
echo "Starting frontend..."
trap 'kill $BACKEND_PID 2>/dev/null || true' EXIT
npm run dev
