import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import uvicorn
import json

app = FastAPI(title="Actroid Web ML Predictor API")

# Enable CORS for frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the trained model and feature list
MODEL_PATH = 'rf_model.joblib'
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model file {MODEL_PATH} not found. Run train_and_export_colab.py first.")

model_data = joblib.load(MODEL_PATH)
rf_model = model_data['model']
feature_names = model_data['features']

# Load brand and model target encodings
with open('manufacturer_to_TE.json', 'r') as f:
    manufacturer_to_TE = json.load(f)
with open('model_to_TE.json', 'r') as f:
    model_to_TE = json.load(f)

# Global fallbacks for brands or models not in the training set
GLOBAL_MANUFACTURER_TE = float(sum(manufacturer_to_TE.values()) / len(manufacturer_to_TE))
GLOBAL_MODEL_TE = float(sum(model_to_TE.values()) / len(model_to_TE))

class PredictRequest(BaseModel):
    marca: str
    modelo: str
    year: int
    mileage: float
    fuel: str
    transmission: str
    type: str
    drive: str
    size: str
    condition: str
    titleStatus: str
    cylinders: int

# Helpers
def map_size(s: str) -> int:
    if s == 'sub-compact': return 0
    elif s == 'compact': return 1
    elif s == 'mid-size': return 2
    elif s == 'full-size': return 3
    return 2

def map_title_status(t: str) -> int:
    if t == 'parts only': return 0
    elif t == 'missing': return 1
    elif t == 'salvage': return 2
    elif t == 'rebuilt': return 3
    elif t == 'lien': return 4
    elif t == 'clean': return 5
    return 5

def map_condition(c: str) -> int:
    if c == 'salvage': return 0
    elif c == 'fair': return 1
    elif c == 'good': return 2
    elif c == 'excellent': return 3
    elif c == 'like new': return 4
    elif c == 'new': return 5
    return 3

@app.post("/predict")
def predict(request: PredictRequest):
    # 1. Look up target encodings for brand and model
    brand_clean = request.marca.lower().strip()
    model_clean = request.modelo.lower().strip()
    
    man_te_val = manufacturer_to_TE.get(brand_clean, GLOBAL_MANUFACTURER_TE)
    mod_te_val = model_to_TE.get(model_clean, GLOBAL_MODEL_TE)
    
    # 2. Map features
    feature_map = {
        'odometer': request.mileage,
        'size': map_size(request.size),
        'title_status': map_title_status(request.titleStatus),
        'year': request.year,
        'condition_encoding': map_condition(request.condition),
        'cylinders_int': request.cylinders,
        'fuel_diesel': 1 if request.fuel == 'diesel' else 0,
        'fuel_electric': 1 if request.fuel == 'electric' else 0,
        'fuel_gas': 1 if request.fuel == 'gas' else 0,
        'fuel_hybrid': 1 if request.fuel == 'hybrid' else 0,
        'drive_4wd': 1 if request.drive == '4wd' else 0,
        'drive_fwd': 1 if request.drive == 'fwd' else 0,
        'drive_rwd': 1 if request.drive == 'rwd' else 0,
        'transmission_automatic': 1 if request.transmission == 'automatic' else 0,
        'transmission_manual': 1 if request.transmission == 'manual' else 0,
        'transmission_other': 1 if request.transmission == 'other' else 0,
        'type_SUV': 1 if request.type == 'suv' else 0,
        'type_bus': 1 if request.type == 'bus' else 0,
        'type_convertible': 1 if request.type == 'convertible' else 0,
        'type_coupe': 1 if request.type == 'coupe' else 0,
        'type_hatchback': 1 if request.type == 'hatchback' else 0,
        'type_mini-van': 1 if request.type == 'mini-van' else 0,
        'type_offroad': 1 if request.type == 'offroad' else 0,
        'type_other': 1 if request.type == 'other' else 0,
        'type_pickup': 1 if request.type == 'pickup' else 0,
        'type_sedan': 1 if request.type == 'sedan' else 0,
        'type_truck': 1 if request.type == 'truck' else 0,
        'type_van': 1 if request.type == 'van' else 0,
        'type_wagon': 1 if request.type == 'wagon' else 0,
        'manufacturer_TE': man_te_val,
        'model_TE': mod_te_val,
    }
    
    # Match the exact feature columns order
    input_vector = [feature_map.get(feat, 0.0) for feat in feature_names]
    
    # 3. Get base prediction from the model
    base_price = float(rf_model.predict([input_vector])[0])
    if base_price < 200:
        base_price = 200
        
    # The model already predicts the price directly utilizing TE columns
    final_price = base_price
    
    # 4. Calculate simulated depreciation
    deprecation = int(request.mileage * 0.05)
    
    return {
        "price": final_price,
        "deprecation": deprecation,
        "base_price": base_price,
        "brand_te": man_te_val,
        "model_te": mod_te_val
    }

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
