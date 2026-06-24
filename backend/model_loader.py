import os
import sys

# Import custom modules so we can patch them into ultralytics
import custom_modules.dsconv as dsconv
import custom_modules.dsc_c3k2 as dsc_c3k2
import custom_modules.rescbam as rescbam

# Import ultralytics to patch it
import ultralytics.nn.modules
import ultralytics.nn.tasks

# 1. Patch sys.modules to fake the existence of these modules inside ultralytics
sys.modules['ultralytics.nn.modules.dsconv'] = dsconv
sys.modules['ultralytics.nn.modules.dsc_c3k2'] = dsc_c3k2
sys.modules['ultralytics.nn.modules.rescbam'] = rescbam

# 2. Attach classes directly to the ultralytics module namespaces
ultralytics.nn.modules.DSConv = dsconv.DSConv
ultralytics.nn.modules.DSC_C3k2 = dsc_c3k2.DSC_C3k2
ultralytics.nn.modules.ResCBAM = rescbam.ResCBAM

ultralytics.nn.tasks.DSConv = dsconv.DSConv
ultralytics.nn.tasks.DSC_C3k2 = dsc_c3k2.DSC_C3k2
ultralytics.nn.tasks.ResCBAM = rescbam.ResCBAM

# Now import YOLO after the patches are applied
from ultralytics import YOLO

# Global variable to hold the model instance
_model = None

def load_model():
    """
    Loads the YOLO model into memory. 
    This should be called exactly once during FastAPI startup.
    """
    global _model
    if _model is None:
        model_path = os.path.join(
            os.path.dirname(__file__),
            "models",
            "XrayDx.pt"
        )
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found at {model_path}. Please place XrayDx.pt in the backend directory.")
        
        print("Loading YOLO model...")
        _model = YOLO(model_path)
        print("YOLO model loaded successfully.")

def get_model():
    """
    Retrieves the loaded YOLO model.
    """
    if _model is None:
        raise RuntimeError("Model has not been loaded. Call load_model() first.")
    return _model
