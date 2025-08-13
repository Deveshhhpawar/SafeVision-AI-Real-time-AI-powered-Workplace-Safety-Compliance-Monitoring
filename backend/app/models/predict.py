from typing import List, Dict, Any
import torch
from PIL import Image
import numpy as np

from transformers import DetrImageProcessor, DetrForObjectDetection


class ObjectDetector:
    def __init__(self, model_name: str = "facebook/detr-resnet-50", device: str | None = None, conf_threshold: float = 0.7):
        self.device = device or ("cuda" if torch.cuda.is_available() else "cpu")
        self.processor = DetrImageProcessor.from_pretrained(model_name)
        self.model = DetrForObjectDetection.from_pretrained(model_name).to(self.device)
        self.model.eval()
        self.conf_threshold = conf_threshold

    @torch.inference_mode()
    def predict(self, image: Image.Image) -> List[Dict[str, Any]]:
        inputs = self.processor(images=image, return_tensors="pt").to(self.device)
        outputs = self.model(**inputs)

        # Convert outputs (logits and boxes) to COCO API
        target_sizes = torch.tensor([image.size[::-1]]).to(self.device)  # (height, width)
        results = self.processor.post_process_object_detection(outputs, target_sizes=target_sizes, threshold=self.conf_threshold)[0]

        detections = []
        for score, label, box in zip(results["scores"], results["labels"], results["boxes"]):
            box = box.tolist()  # [x_min, y_min, x_max, y_max]
            detections.append({
                "label_id": int(label),
                "label": self.model.config.id2label[int(label)],
                "score": float(score),
                "box": {
                    "x_min": float(box[0]),
                    "y_min": float(box[1]),
                    "x_max": float(box[2]),
                    "y_max": float(box[3])
                }
            })
        return detections


# Lazy singleton (simple cache for inference server)
_detector: ObjectDetector | None = None

def get_detector() -> ObjectDetector:
    global _detector
    if _detector is None:
        _detector = ObjectDetector()
    return _detector
