import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import uvicorn

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
    raise FileNotFoundError(f"Model file {MODEL_PATH} not found. Run train_and_export.py first.")

model_data = joblib.load(MODEL_PATH)
rf_model = model_data['model']
feature_names = model_data['features']

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

# Brand and Model multipliers for realistic prices
BRAND_MULTIPLIERS = {
    'acura': 1.1,
    'alfa-romeo': 1.3,
    'aston-martin': 4.5,
    'audi': 1.3,
    'bmw': 1.35,
    'buick': 0.9,
    'cadillac': 1.2,
    'chevrolet': 0.95,
    'chrysler': 0.9,
    'datsun': 0.8,
    'dodge': 1.0,
    'ferrari': 6.5,
    'fiat': 0.75,
    'ford': 0.95,
    'gmc': 1.1,
    'harley-davidson': 1.0,
    'honda': 1.0,
    'hyundai': 0.85,
    'infiniti': 1.1,
    'jaguar': 1.4,
    'jeep': 1.15,
    'kia': 0.85,
    'land rover': 1.8,
    'lexus': 1.3,
    'lincoln': 1.15,
    'mazda': 0.95,
    'mercedes-benz': 1.45,
    'mercury': 0.8,
    'mini': 1.05,
    'mitsubishi': 0.8,
    'nissan': 0.9,
    'pontiac': 0.85,
    'porsche': 2.5,
    'ram': 1.25,
    'rover': 0.75,
    'saturn': 0.7,
    'subaru': 1.05,
    'tesla': 1.6,
    'toyota': 1.05,
    'volkswagen': 0.95,
    'volvo': 1.2,
}

MODEL_MULTIPLIERS = {
    'ferrari:458': 1.5,
    'ferrari:488': 1.7,
    'ferrari:california': 1.0,
    'audi:r8': 3.2,
    'chevrolet:corvette': 1.8,
    'ford:mustang': 1.15,
    'porsche:911': 2.2,
    'nissan:gt-r': 3.0,
}

@app.post("/predict")
def predict(request: PredictRequest):
    # 1. Map features
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
    }
    
    # Match the exact feature columns order
    input_vector = [feature_map.get(feat, 0.0) for feat in feature_names]
    
    # 2. Get base prediction from the model
    base_price = float(rf_model.predict([input_vector])[0])
    if base_price < 200:
        base_price = 200
        
    # 3. Apply brand and model multipliers
    brand_clean = request.marca.lower().strip()
    model_clean = request.modelo.lower().strip()
    
    brand_mult = BRAND_MULTIPLIERS.get(brand_clean, 1.0)
    
    # Check model specific multiplier
    model_key = f"{brand_clean}:{model_clean}"
    model_mult = MODEL_MULTIPLIERS.get(model_key, 1.0)
    
    final_price = base_price * brand_mult * model_mult
    
    # 4. Calculate simulated depreciation
    deprecation = int(request.mileage * 0.05)
    
    return {
        "price": final_price,
        "deprecation": deprecation,
        "base_price": base_price
    }

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
