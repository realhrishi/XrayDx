<div align="center">

# 🦴 XrayDx

### AI-Powered Bone Fracture Detection from X-Ray Images

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-xray--dx.vercel.app-blue?style=for-the-badge)](https://xray-dx.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.9+-yellow?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![YOLOv11](https://img.shields.io/badge/YOLOv11-Ultralytics-purple?style=for-the-badge)](https://github.com/ultralytics/ultralytics)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)

<br/>

> Upload an X-ray. Get an instant AI-powered fracture diagnosis.  
> Built as a B.Tech research internship project at **IIT (BHU) Varanasi**.

<br/>

---

</div>

## ✨ What is XrayDx?

**XrayDx** is a full-stack web application that lets anyone — doctors, students, or researchers — upload a bone X-ray image and receive an instant AI prediction on whether a fracture is present.

Under the hood, it runs a custom **YOLOv11** model enhanced with **Dynamic Snake Convolution (DSConv)** applied across 5 layers of the YOLO backbone, combined with **ResCBAM** (Residual Convolutional Block Attention Module) — trained on the **GRAZPEDWRI-DX** pediatric wrist X-ray dataset.

<br/>

## 🚀 Features

| Feature | Description |
|---|---|
| 📤 **Image Upload** | Upload any bone X-ray (JPEG / PNG) directly from your browser |
| 🤖 **Deep Learning Inference** | YOLOv11 with DSConv backbone + ResCBAM attention |
| ✅ **Instant Prediction** | Returns *Fracture Detected* or *No Fracture* in seconds |
| 📊 **Confidence Score** | See how confident the model is in its prediction |
| 🌐 **No Installation** | Fully browser-based — works on any device |

<br/>

## 🧠 Model Architecture

The model is a customized **YOLOv11** where two key architectural changes are made over the standard baseline:

```
Input X-ray
     │
     ▼
┌──────────────────────────────────────────┐
│           YOLOv11 Backbone               │
│                                          │
│  Layer 1  ──► DSConv  ◄── replaces       │
│  Layer 2  ──► DSConv      standard       │
│  Layer 3  ──► DSConv      Conv in        │
│  Layer 4  ──► DSConv      5 layers       │
│  Layer 5  ──► DSConv                     │
│                                          │
│  (Dynamic Snake Convolution adapts its   │
│   receptive field to follow the curved   │
│   geometry of bone structures)           │
└─────────────────┬────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│            ResCBAM Block                 │
│                                          │
│  Channel Attention ──┐                   │
│                      ├──► Residual Add   │
│  Spatial Attention ──┘                   │
│                                          │
│  (Highlights diagnostically relevant     │
│   regions like fracture sites)           │
└─────────────────┬────────────────────────┘
                  │
                  ▼
         Fracture / No Fracture
           + Confidence Score
```

### Key Components

| Component | Role |
|---|---|
| **DSConv** *(Dynamic Snake Convolution)* | Applied to 5 backbone layers; deforms its kernel to trace elongated/curved bone structures that standard convolutions miss |
| **ResCBAM** *(Residual CBAM)* | Combines channel attention (what to focus on) + spatial attention (where to focus), wrapped in a residual connection to preserve gradient flow |
| **YOLOv11 Neck + Head** | Standard PAN neck and detection head for bounding box regression and classification |

<br/>

## 🗂️ Dataset

Trained on the **[GRAZPEDWRI-DX](https://www.nature.com/articles/s41597-022-01328-z)** dataset — a pediatric wrist X-ray dataset collected at the University Hospital Graz, widely used as a benchmark for musculoskeletal fracture detection.

| Property | Details |
|---|---|
| **Full Name** | Graz Pediatric Wrist Radiograph Dataset |
| **Modality** | Pediatric wrist X-rays |
| **Annotations** | Bounding boxes for fractures and other findings |
| **Use Case** | Fracture detection benchmark |

<br/>

## 🗃️ Project Structure

```
XrayDx/
│
├── 📁 backend/           # Python inference API (model loading + /predict endpoint)
├── 📁 skeletal/          # Model weights and supporting assets
├── 📁 src/lib/           # Shared JS utility modules
│
├── 🌐 index.html         # Landing page
├── 🔬 predict.html       # Upload & prediction interface
├── ℹ️  about.html         # About the project
├── 📬 contact.html       # Contact page
│
├── 🎨 style.css          # Global styles
├── ⚙️  script.js          # Frontend logic (upload, API call, result display)
│
├── 📓 xraydx.ipynb       # Model training & evaluation notebook
├── 🐳 Dockerfile         # Container config for backend
├── 🚀 vercel.json        # Vercel deployment configuration
└── 📦 package.json       # Node dependencies
```

<br/>

## 🛠️ Tech Stack

<div align="center">

| Layer | Technology |
|---|---|
| **Frontend** | HTML5 · CSS3 · Vanilla JavaScript |
| **ML Framework** | PyTorch · Ultralytics YOLOv11 |
| **Backend API** | Python · FastAPI / Flask |
| **Containerization** | Docker |
| **Deployment** | Vercel |
| **Training** | Jupyter Notebook · Kaggle |

</div>

<br/>

## ⚡ Local Setup

### Prerequisites
- Python 3.9+
- Node.js *(optional, for frontend dev server)*
- pip

### 1️⃣ Clone the repo

```bash
git clone https://github.com/realhrishi/XrayDx.git
cd XrayDx
```

### 2️⃣ Start the backend

```bash
cd backend
pip install -r requirements.txt
python app.py
# API available at http://localhost:8000
```

### 3️⃣ Open the frontend

```bash
# Option A: just open index.html in your browser
# Option B: use a local dev server
npx serve .
# Visit http://localhost:3000
```

<br/>

## 🖥️ How to Use

```
1. Visit https://xray-dx.vercel.app/predict.html
         │
         ▼
2. Upload your bone X-ray (JPEG or PNG)
         │
         ▼
3. Click "Analyze"
         │
         ▼
4. Get your result → Fracture Detected ❌  or  No Fracture ✅
                      + Confidence Score
```

<br/>

## 👥 Contributors

<div align="center">

| | Name | Role |
|---|---|---|
| 👨‍💻 | **Hrishiraj Chowdhury** | Web app development · Model integration · Deployment |
| 👨‍💻 | **Krishna** | Model architecture · Training pipeline · Evaluation |

*Developed under faculty guidance at **IIT (BHU) Varanasi***.

</div>

<br/>

## ⚠️ Disclaimer

XrayDx is a **research prototype** and is **not intended for clinical or diagnostic use**. Always consult a qualified medical professional for fracture diagnosis and treatment.

<br/>

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

<br/>

## 🙏 Acknowledgements

- [**GRAZPEDWRI-DX Dataset**](https://www.nature.com/articles/s41597-022-01328-z) — Nagy et al., Scientific Data, 2022
- [**Ultralytics YOLOv11**](https://github.com/ultralytics/ultralytics)
- [**Dynamic Snake Convolution**](https://www.nature.com/articles/s41598-024-77878-6) — Peng Chen et al., Scientific Data 2024
- [**CBAM**](https://arxiv.org/pdf/2402.09329) — Chien et al., IEEE Access 2025

<br/>

<div align="center">

Made with ❤️ by Hrishiraj & Krishna · IIT (BHU) Varanasi · 2026

</div>
