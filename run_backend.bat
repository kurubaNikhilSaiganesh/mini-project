@echo off
echo Setting up virtual environment if needed...
if not exist "venv" (
    python -m venv venv
)
call venv\Scripts\activate
echo Installing requirements...
pip install -r backend\requirements.txt

echo Generating self-signed certificates if they don't exist...
python backend\generate_cert.py

echo Starting FastAPI server with HTTPS on port 8443...
uvicorn backend.app:app --host 0.0.0.0 --port 8443 --ssl-keyfile backend\certs\server.key --ssl-certfile backend\certs\server.crt --reload
