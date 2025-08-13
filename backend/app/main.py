from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
from PIL import Image
import io

from app.models.predict import get_detector

app = FastAPI(title="SafeVision AI – Backend", version="0.1.0")

# CORS for local dev (vite default port)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Detection(BaseModel):
    label_id: int
    label: str
    score: float
    box: Dict[str, float]

class InferenceResponse(BaseModel):
    detections: List[Detection]

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/infer", response_model=InferenceResponse)
async def infer(file: UploadFile = File(...)):
    if not file.content_type or "image" not in file.content_type:
        return {"detections": []}

    content = await file.read()
    image = Image.open(io.BytesIO(content)).convert("RGB")

    detector = get_detector()
    dets = detector.predict(image)

    return {"detections": dets}
