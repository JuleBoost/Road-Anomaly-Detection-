# 🚗 RoadSense — Road Anomaly Detection System

A real-time road anomaly detection system using a phone camera mounted on a car dashboard. Captures video, extracts frames, and runs YOLOv11s inference to detect road hazards. Detections are stored in Firebase with GPS coordinates and sent as Telegram notifications via n8n automation.

## Detected Anomalies
- 🕳️ Pothole
- 🚧 Fallen Barrier
- 🔶 Fallen Cone
- 🪵 Fallen Pole

## Stack
| Layer | Tech |
|---|---|
| Model | YOLOv11s (transfer learning, ONNX export) |
| Training | Google Colab T4 + Roboflow RoadFix dataset |
| Backend | FastAPI (Hugging Face Spaces) |
| Frontend | React + Leaflet.js (Netlify) |
| Mobile Prototype | ONNX Runtime Web (browser-based inference) |
| Database | Firebase Firestore |
| Notifications | n8n + Telegram Bot |

## Dataset
[RoadFix Dataset](https://universe.roboflow.com/dequillaprojects/roadfix) — 23,876 images, 4 classes, YOLOv11 format (Roboflow Universe, CC BY 4.0)

## Model
- Base: `yolo11s.pt` pretrained on COCO, fine-tuned for road anomalies
- Input: 640×640, normalized to [0,1], NCHW tensor
- Output: `[1, 8, 8400]` — 4 box coords + 4 class scores over 8400 anchors
- Exported as `best.onnx` for browser inference via ONNX Runtime Web (WASM)
- Confidence threshold: 0.40 | NMS IoU: 0.45

## Training
- Platform: Google Colab (T4 GPU, free tier)
- Epochs: 100 | Batch: 16 | Image size: 640×640
- Early stopping patience: 20 epochs
- Notebook: [`model/RoadSense_Training.ipynb`](model/RoadSense_Training.ipynb)

## Repo Structure
```
/src           → React frontend (dashboard + map view)
/mobile        → Browser-based prototype (ONNX Runtime Web, no backend needed)
/model         → Training notebook
assets/        → Static assets
```

## Pipeline
```
Phone Camera → FastAPI Backend (HF Spaces) → YOLOv11s Inference → Firebase Firestore → React Dashboard + Telegram Notification (n8n)
```

## Mobile Prototype
Runs entirely in the browser — no Python or GPU required.
- Open `mobile/index.html` in any browser
- Load `best.onnx` when prompted
- Use live camera or upload a video file
- Auto-pauses on hazard detection

## Notification System
New Firestore entries in the `anomalies` collection trigger a Telegram message via an n8n polling workflow (no Firebase Cloud Functions required — works on free Spark plan).

## Getting Started

### Frontend (React Dashboard)
```bash
npm install
npm run dev
```

Create a `.env` file based on `.env.example` and add your Firebase config.

### Mobile Prototype
Open `mobile/index.html` directly in a browser. No install needed.

### Backend
Deployed on Hugging Face Spaces (FastAPI). See Space for API docs.

## License
MIT
