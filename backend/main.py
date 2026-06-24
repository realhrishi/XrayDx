import os
import shutil
import uuid
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from model_loader import load_model
from predict import analyze_image

app = FastAPI(title="XrayDx API")

# Allow requests from frontend (adjust origins as needed for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOADS_DIR = os.path.join(BASE_DIR, "uploads")
RESULTS_DIR = os.path.join(BASE_DIR, "results")

# Ensure directories exist
os.makedirs(UPLOADS_DIR, exist_ok=True)
os.makedirs(RESULTS_DIR, exist_ok=True)

# Mount the results directory so the frontend can access the annotated images
app.mount("/results", StaticFiles(directory=RESULTS_DIR), name="results")

@app.on_event("startup")
async def startup_event():
    """
    Load the YOLO model into memory exactly once when the server starts.
    """
    try:
        load_model()
    except Exception as e:
        print(f"Warning: Model failed to load during startup: {e}")
        # We catch it here so the server still starts, allowing users to see the error later,
        # but ideally the model should be present.

@app.post("/predict")
async def predict_fracture(file: UploadFile = File(...)):
    """
    Accepts an uploaded X-ray image, runs fracture detection, and returns the analysis.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded")
        
    # Validate file extension roughly
    ext = file.filename.split('.')[-1].lower()
    if ext not in ["jpg", "jpeg", "png", "bmp", "webp"]:
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload an image.")

    # Save uploaded file to disk temporarily
    temp_filename = f"upload_{uuid.uuid4().hex[:8]}.{ext}"
    temp_filepath = os.path.join(UPLOADS_DIR, temp_filename)
    
    try:
        with open(temp_filepath, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Run AI analysis
        analysis_result = analyze_image(temp_filepath, RESULTS_DIR)
        
        return analysis_result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Model inference failed: {str(e)}")
    finally:
        # Clean up the original uploaded file if you don't want to store it permanently
        if os.path.exists(temp_filepath):
            os.remove(temp_filepath)
