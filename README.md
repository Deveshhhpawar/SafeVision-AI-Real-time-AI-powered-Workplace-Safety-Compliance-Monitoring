# SafeVision AI – Starter Kit (MVP)

Real-time workplace safety monitoring (PPE/object detection) built with **FastAPI + Hugging Face** (backend) and **React + Vite** (frontend). This starter gives you a working foundation you can extend over 1–3 months.

## What’s Included
- **Backend** (FastAPI): `/infer` endpoint accepts an image, runs object detection with a Hugging Face model (DETR), and returns JSON detections.
- **Frontend** (Vite + React + TS): simple UI to upload an image and view detections.
- CORS configured for local dev.
- Dockerfile for backend.

> Note: The included model (`facebook/detr-resnet-50`) detects general objects (COCO). PPE-specific fine-tuning can be added later.

---

## Quick Start

### 1) Backend (FastAPI)
```bash
cd backend
python -m venv .venv
# Windows PowerShell
. .venv/Scripts/Activate.ps1
# macOS/Linux
# source .venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Health check: http://localhost:8000/health

### 2) Frontend (Vite + React + TS)
```bash
cd frontend
npm install
npm run dev
```
Open the URL Vite prints (usually http://localhost:5173).

Upload an image; the app calls `POST http://localhost:8000/infer` and renders detections.

---

## Repo Structure
```
safevision-ai/
  backend/
    app/
      main.py
      models/predict.py
    requirements.txt
    Dockerfile
  frontend/
    index.html
    package.json
    tsconfig.json
    tsconfig.node.json
    vite.config.ts
    src/
      main.tsx
      App.tsx
      types.ts
```

---

## Next Steps (Roadmap Hooks)
- [ ] Replace generic object detection with PPE-specific model (fine-tune on PPE dataset).
- [ ] Add video stream processing (OpenCV) and WebSocket live updates.
- [ ] Store detections (PostgreSQL), add auth, and role-based dashboards.
- [ ] Add Slack/Twilio alerts and rate-limiting (Redis).
- [ ] Containerize frontend; add docker-compose for both services.
- [ ] Deploy to cloud (Hugging Face Spaces for demo, AWS/GCP/Azure for prod).

---

## Environment Variables (later)
- `HF_HOME` to control HF cache location (optional).
- `.env` for API keys (Slack/Twilio), DB URLs, etc.

---

## License
MIT (adjust as you prefer).
