# 🚗 RoadSense — Road Anomaly Detection System

A real-time road anomaly detection system using a phone camera mounted on a car dashboard. Detections are stored with GPS coordinates and displayed on a live web dashboard.

🌐 **Live Dashboard:** https://road-sense-dashboard.vercel.app

---

## 🔍 Detected Classes (v3 — 9 classes)

| # | Class |
|---|-------|
| 0 | Pothole |
| 1 | Fallen Barrier |
| 2 | Fallen Cone |
| 3 | Fallen Pole |
| 4 | Damaged Traffic Sign |
| 5 | Damaged Street Light |
| 6 | Faded Road Marking |
| 7 | Litter |
| 8 | Bin Full |

---

## 🧠 Model

- Architecture: YOLOv11n (nano), transfer learning from v2 best.pt
- Training: Google Colab (T4 GPU)

- Format: CoreML (iOS)
- Notebook: RoadSense NEW.ipynb

## 📦 Datasets

| Class | Source |
|-------|--------|
| Pothole, Fallen-Barrier, Fallen-Cone, Fallen-Pole | [RoadFix v3](https://universe.roboflow.com/dequillaprojects/roadfix) |
| Damaged_Traffic_Sign | [Damaged Traffic Signs v2](https://universe.roboflow.com/matyworkspace/damaged-traffic-signs) |
| Damaged_Street_Light | [Damaged Lights v1](https://universe.roboflow.com/godspeed-yqpeo/damaged-lights) |
| Faded_Road_Marking | [Mendeley — Attain Dataset](https://data.mendeley.com/datasets/nykrzdm74f/1) |
| Litter | [Garbage & Litter Detector](https://universe.roboflow.com/garbage-classification-yyarx/garbage-litter-detector) · [Litter Street Images](https://universe.roboflow.com/kabml-images/litter-street-images) · [Road Litter](https://universe.roboflow.com/ruis-workspace-ndeeo/road-litter) · [Litter v2](https://universe.roboflow.com/work-xqv89/litter-2lfp2) |
| Bin_Full | [Garbage Can Overflow](https://universe.roboflow.com/mariswary-deepak-4ajr0/garbage-can-overflow) · [Garbage Clixe](https://universe.roboflow.com/dsoelma/garbage-clixe) · [Trash Bin Status](https://universe.roboflow.com/jamshid-salimov-s-workspace/trash-bin-status-0ju0u) · [Garbage Bin](https://universe.roboflow.com/quality-control-defect-detection/garbage-bin-gfxbz) |




Total: 30,000+ images across train/val/test splits.
---

## 🛠️ Stack

| Layer | Tech |
|-------|------|
| Model | YOLOv11n (CoreML) |
| Training | Google Colab + Roboflow |
| Mobile App | Flutter (iOS) with CoreML |
| Backend | Supabase (DB + Storage + Auth) |
| Dashboard | React + Leaflet.js |
| Deployment | Vercel |
| Notifications | n8n + Telegram |

---

## 📊 Dashboard Features

- Role-based access: Public / Municipality Manager / Admin
- Live interactive map with GPS markers
- Status workflow: New → Under Review → Assigned → Repaired / Rejected
- Repair evidence upload
- Duplicate detection handling
- CSV & PDF export
- Date/time filtering

---


