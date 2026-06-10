# 🚗 Road Anomaly Detection System

A real-time road anomaly detection system using a phone camera mounted on a car dashboard. Captures video, extracts frames, and runs YOLOv11s inference to detect road hazards. Detections are stored in Firebase with GPS coordinates and pushed as notifications to a live web dashboard.

## Detected Anomalies
- 🕳️ Pothole
- 🚧 Fallen Barrier
- 🔶 Fallen Cone
- 🪵 Fallen Pole

## Stack
| Layer | Tech |
|---|---|
| Model | YOLOv11s (transfer learning) |
| Training | Google Colab + Roboflow dataset |
| Backend | FastAPI (Hugging Face Spaces) |
| Frontend | React + Leaflet.js (Vercel/Netlify) |
| Database | Firebase Firestore |
| Notifications | Firebase Cloud Messaging |

## Dataset
[RoadFix Dataset](https://universe.roboflow.com/dequillaprojects/roadfix) — 23,876 images, 4 classes, YOLOv11 format (Roboflow Universe, CC BY 4.0)

## Repo Structure
```
/webapp      → React frontend (dashboard + camera capture)
/backend     → FastAPI inference server
/model       → Training notebooks and model weights
```

## Pipeline
```
Phone Camera → Frame Extraction (1fps) → YOLOv11s Inference → Firebase → Dashboard + Notification
```

## Getting Started
_Setup instructions coming soon._

## License
MIT
