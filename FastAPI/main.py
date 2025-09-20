from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
from collections import Counter
import uuid
import os
import cv2

app = FastAPI()

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,                
    allow_methods=["*"],
    allow_headers=["*"],
)


model = YOLO("app/best.pt")


def get_labels(image_path, conf=0.05):
    img = cv2.imread(image_path)
    if img is None:
        print("Failed to read image for resizing")
        return []

    resized = cv2.resize(img, (640, 640))
    cv2.imwrite(image_path, resized)

    results = model(image_path, conf=conf)[0]

    print(f"➡️ YOLO processed {image_path}")
    if results.boxes:
        print(f"Found {len(results.boxes)} boxes")
    else:
        print("No boxes found")

    return [model.names[int(box.cls[0])] for box in results.boxes]


@app.post("/predict")
async def predict_pothole(file: UploadFile = File(...)):
    temp_path = f"temp_{uuid.uuid4().hex}.jpg"
    contents = await file.read()

    if not contents:
        return {"error": "Empty file uploaded"}

    with open(temp_path, "wb") as f:
        f.write(contents)

    if not os.path.exists(temp_path) or os.path.getsize(temp_path) == 0:
        return {"error": "Image was not saved correctly"}

    labels = get_labels(temp_path, conf=0.2)
    os.remove(temp_path)

    if not labels:
        return {"pothole_type": "none", "count": 0}

    counts = Counter(labels)
    most_common_label, count = counts.most_common(1)[0]

    return {
        "pothole_type": most_common_label,
        "count": count
    }

@app.post("/verify-repair")
async def verify_repair(before: UploadFile = File(...), after: UploadFile = File(...)):
    before_path = f"before_{uuid.uuid4().hex}.jpg"
    after_path = f"after_{uuid.uuid4().hex}.jpg"

    with open(before_path, "wb") as bf:
        bf.write(await before.read())
    with open(after_path, "wb") as af:
        af.write(await after.read())

    before_labels = get_labels(before_path, conf=0.05)
    after_labels = get_labels(after_path, conf=0.05)

    print(f"\n🟡 BEFORE: {before_labels}")
    print(f"🟢 AFTER: {after_labels}")

    os.remove(before_path)
    os.remove(after_path)

    repaired = len(before_labels) > 0 and len(after_labels) < len(before_labels)

    return {"repaired": repaired}