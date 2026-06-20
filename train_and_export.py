import json
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor

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
    
    # Train Random Forest Regressor
    print("Training Random Forest Regressor (10 trees, max_depth=10)...")
    rf = RandomForestRegressor(n_estimators=10, max_depth=10, random_state=42, n_jobs=-1)
    rf.fit(X, y)
    
    # Serialize the trees
    serialized_trees = []
    for tree_estimator in rf.estimators_:
        tree = tree_estimator.tree_
        nodes = []
        
        for i in range(tree.node_count):
            left_child = int(tree.children_left[i])
            right_child = int(tree.children_right[i])
            
            if left_child == -1:  # Leaf node
                val = float(tree.value[i][0][0])
                # Format: [is_leaf (bool), leaf_value, None, None]
                nodes.append([True, val, None, None])
            else:  # Split node
                feat = int(tree.feature[i])
                thresh = float(tree.threshold[i])
                # Format: [is_leaf (bool), feature_index, threshold, left_child_index, right_child_index]
                nodes.append([False, feat, thresh, left_child, right_child])
                
        serialized_trees.append(nodes)
        
    # Combine metadata and trees
    model_data = {
        "features": feature_names,
        "trees": serialized_trees
    }
    
    # Save to src/components/rf_model.json
    output_path = 'src/components/rf_model.json'
    with open(output_path, 'w') as f:
        json.dump(model_data, f)
        
    print(f"Model successfully saved to {output_path}!")

if __name__ == '__main__':
    main()
