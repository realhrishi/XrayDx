import os
import uuid
from model_loader import get_model

# Constants for AI Output
SUMMARY_FRACTURE = "The AI model identified a suspected fracture region in the uploaded radiograph. The highlighted area represents the location considered abnormal by the detection model."
SUMMARY_NO_FRACTURE = "No significant fracture-like abnormalities were detected in the uploaded radiograph. Clinical review is still recommended."

REC_FRACTURE = [
    "Consult an orthopedic specialist.",
    "Obtain professional radiological review.",
    "Minimize movement of the affected area."
]

REC_NO_FRACTURE = [
    "Continue clinical observation.",
    "Seek medical evaluation if symptoms persist."
]

CONFIDENCE_THRESHOLD = 0.65

def analyze_image(image_path: str, results_dir: str) -> dict:
    model = get_model()

    results = model.predict(
        source=image_path,
        conf=0.65,
        save=False,
        verbose=False
    )

    result = results[0]
    boxes = result.boxes

    filename = f"result_{uuid.uuid4().hex[:8]}.jpg"
    annotated_image_path = os.path.join(results_dir, filename)

    result.save(filename=annotated_image_path)

    if len(boxes) == 0:
        return {
            "fracture_detected": False,
            "predicted_class": "No Finding",
            "confidence": 0.0,
            "annotated_image": f"/results/{filename}",
            "analysis_summary": SUMMARY_NO_FRACTURE,
            "recommendations": REC_NO_FRACTURE
        }

    best_idx = int(boxes.conf.argmax())
    best_conf = float(boxes.conf[best_idx])
    best_cls = int(boxes.cls[best_idx])

    predicted_class = str(model.names[best_cls]).lower()

    print(
        f"[XRAYDX] Class={predicted_class} | Confidence={best_conf:.3f}"
    )

    fracture_detected = predicted_class == "fracture"

    return {
        "fracture_detected": fracture_detected,
        "predicted_class": predicted_class.title(),
        "confidence": round(best_conf, 3),
        "annotated_image": f"/results/{filename}",
        "analysis_summary": SUMMARY_FRACTURE if fracture_detected else SUMMARY_NO_FRACTURE,
        "recommendations": REC_FRACTURE if fracture_detected else REC_NO_FRACTURE
    }
