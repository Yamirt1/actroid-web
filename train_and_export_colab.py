import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
import joblib

def main():
    print("Loading dataset...")
    df = pd.read_csv('data_final.csv')
    
    # Target variable
    y = df['price']
    
    # Keep target encoding features (Colab model)
    X = df.drop(columns=['price'])
    
    feature_names = list(X.columns)
    print(f"Features for training ({len(feature_names)}):")
    print(feature_names)
    
    # Train Random Forest Regressor (Colab configuration optimized for size/generalization)
    print("Training Random Forest Regressor (max_depth=18, min_samples_leaf=2, random_state=13)...")
    rf = RandomForestRegressor(n_estimators=100, max_depth=18, min_samples_leaf=2, random_state=13, n_jobs=-1)
    rf.fit(X, y)
    
    # Save the model and feature names using joblib
    output_path = 'rf_model.joblib'
    joblib.dump({
        'model': rf,
        'features': feature_names
    }, output_path)
        
    print(f"Model and feature names successfully saved to {output_path}!")

if __name__ == '__main__':
    main()
