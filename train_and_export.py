import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
import joblib

def main():
    # Load dataset
    df = pd.read_csv('data_final.csv')
    
    # Target variable
    y = df['price']
    
    # Drop target and target encodings (Option B)
    X = df.drop(columns=['price', 'model_TE', 'manufacturer_TE'])
    
    # Store the feature list in order
    feature_names = list(X.columns)
    
    print(f"Features for training ({len(feature_names)}):")
    print(feature_names)
    
    # Evaluate model R2 score using train/test split (15% validation)
    print("Evaluating model performance (15% test split)...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.15, random_state=42)
    rf_eval = RandomForestRegressor(n_estimators=100, max_depth=25, random_state=42, n_jobs=-1)
    rf_eval.fit(X_train, y_train)
    r2_score = rf_eval.score(X_test, y_test)
    print(f"R² Score: {r2_score:.5f} ({r2_score * 100:.2f}%)")
    
    # Train Random Forest Regressor (Optimized: 100 trees, max_depth=25)
    print("Training Random Forest Regressor on full dataset (100 trees, max_depth=25)...")
    rf = RandomForestRegressor(n_estimators=100, max_depth=25, random_state=42, n_jobs=-1)
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
