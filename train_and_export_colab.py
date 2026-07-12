import pandas as pd
# pyrefly: ignore [missing-import]
import numpy as np
from sklearn.ensemble import RandomForestRegressor
# pyrefly: ignore [missing-import]
import joblib

def main():
    print("Cargando el conjunto de datos...")
    df = pd.read_csv('data_final.csv')
    
    # Variable objetivo
    y = df['price']
    
    # Mantener las columnas de Target Encoding (Modelo optimizado)
    X = df.drop(columns=['price'])
    
    feature_names = list(X.columns)
    print(f"Características para el entrenamiento ({len(feature_names)}):")
    print(feature_names)
    
    # Entrenar el modelo Random Forest (Configuración optimizada para tamaño/generalización)
    print("Entrenando el Random Forest Regressor (max_depth=18, min_samples_leaf=2, random_state=13)...")
    rf = RandomForestRegressor(n_estimators=100, max_depth=18, min_samples_leaf=2, random_state=13, n_jobs=-1)
    rf.fit(X, y)
    
    # Guardar el modelo y los nombres de las características usando joblib
    output_path = 'rf_model.joblib'
    joblib.dump({
        'model': rf,
        'features': feature_names
    }, output_path)
        
    print("Modelo y nombres de características guardados exitosamente en", output_path)

if __name__ == '__main__':
    main()

