import React, { useState, useEffect } from 'react';
import rfModel from './rf_model.json';
import manufacturerToTE from './manufacturer_to_TE.json';
import modelToTE from './model_to_TE.json';

// Import subcomponents
import PredictorForm from './predictor/PredictorForm';
import CarViewer from './predictor/CarViewer';
import ApiInspector from './predictor/ApiInspector';

// Import local ML Engine helpers
import {
  map_size,
  map_title_status,
  map_condition,
  predictForest,
  getDemandStatus
} from '../utils/mlEngine';

export default function Predictor() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showApiConsole, setShowApiConsole] = useState(false);
  const [apiConsoleData, setApiConsoleData] = useState<any>(null);

  const [formData, setFormData] = useState({
    marca: '',
    modelo: '',
    year: 2018,
    mileage: 45000,
    fuel: 'gas',
    transmission: 'automatic',
    type: 'sedan',
    drive: 'fwd',
    size: 'mid-size',
    condition: 'excellent',
    titleStatus: 'clean',
    cylinders: 4
  });

  const handlePredict = () => {
    setLoading(true);
    setResult(null);

    // Setup abort controller for 5 second timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    // Fetch prediction from FastAPI backend
    const fetchPromise = fetch("https://actroid-web.onrender.com/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
      signal: controller.signal,
    }).then(res => {
      clearTimeout(timeoutId);
      if (!res.ok) throw new Error("API error");
      return res.json();
    }).catch(err => {
      clearTimeout(timeoutId);
      throw err;
    });

    const delayPromise = new Promise(resolve => setTimeout(resolve, 1500));

    Promise.all([fetchPromise, delayPromise])
      .then(([apiResult]) => {
        const make = encodeURIComponent(formData.marca.toLowerCase());
        const model = encodeURIComponent(formData.modelo.toLowerCase());

        setResult({
          price: apiResult.price,
          deprecation: apiResult.deprecation,
          make: make,
          model: model,
          year: formData.year,
          brand: `${formData.marca} ${formData.modelo}`.trim() || 'Vehículo'
        });

        // Set API console data
        setApiConsoleData({
          method: 'POST',
          url: 'https://actroid-web.onrender.com/predict',
          status: '200 OK (Served by FastAPI)',
          request: formData,
          response: {
            price: apiResult.price,
            deprecation: apiResult.deprecation,
            base_price: apiResult.base_price || apiResult.price,
            brand_te: apiResult.brand_te || 15400.0,
            model_te: apiResult.model_te || 18200.0
          },
          features: apiResult.features || ['(Vector de características procesado en servidor)']
        });

        // Dispatch custom event to notify simulator
        const event = new CustomEvent('car-prediction-made', {
          detail: {
            name: 'Tu Consulta',
            marca: formData.marca,
            modelo: formData.modelo,
            year: formData.year,
            mileage: formData.mileage,
            fuel: formData.fuel === 'gas' ? 'Gas' : formData.fuel === 'electric' ? 'Electric' : formData.fuel === 'hybrid' ? 'Hybrid' : 'Diesel',
            brandTE: apiResult.brand_te || 15400.0,
            modelTE: apiResult.model_te || 18200.0,
            treeVotes: [
              Math.round(apiResult.price * 0.98),
              Math.round(apiResult.price * 1.03),
              Math.round(apiResult.price * 0.99)
            ],
            finalPrice: Math.round(apiResult.price)
          }
        });
        window.dispatchEvent(event);

        setLoading(false);
      })
      .catch(err => {
        console.warn("API offline or timed out, using high-precision client-side Random Forest model", err);

        // 1. Calculate target encodings for brand and model
        const brand_clean = formData.marca.toLowerCase().trim();
        const model_clean = formData.modelo.toLowerCase().trim();

        const mTE = manufacturerToTE as Record<string, number>;
        const modTE = modelToTE as Record<string, number>;

        const GLOBAL_MANUFACTURER_TE = Object.values(mTE).reduce((a, b) => a + b, 0) / Object.keys(mTE).length;
        const GLOBAL_MODEL_TE = Object.values(modTE).reduce((a, b) => a + b, 0) / Object.keys(modTE).length;

        const man_te_val = mTE[brand_clean] || GLOBAL_MANUFACTURER_TE;
        const mod_te_val = modTE[model_clean] || GLOBAL_MODEL_TE;

        // 2. Map features to the exact order in client-side model (29 features)
        const featureMap: Record<string, number> = {
          'odometer': formData.mileage,
          'size': map_size(formData.size),
          'title_status': map_title_status(formData.titleStatus),
          'year': formData.year,
          'condition_encoding': map_condition(formData.condition),
          'cylinders_int': formData.cylinders,
          'fuel_diesel': formData.fuel === 'diesel' ? 1 : 0,
          'fuel_electric': formData.fuel === 'electric' ? 1 : 0,
          'fuel_gas': formData.fuel === 'gas' ? 1 : 0,
          'fuel_hybrid': formData.fuel === 'hybrid' ? 1 : 0,
          'drive_4wd': formData.drive === '4wd' ? 1 : 0,
          'drive_fwd': formData.drive === 'fwd' ? 1 : 0,
          'drive_rwd': formData.drive === 'rwd' ? 1 : 0,
          'transmission_automatic': formData.transmission === 'automatic' ? 1 : 0,
          'transmission_manual': formData.transmission === 'manual' ? 1 : 0,
          'transmission_other': formData.transmission === 'other' ? 1 : 0,
          'type_SUV': formData.type === 'suv' ? 1 : 0,
          'type_bus': formData.type === 'bus' ? 1 : 0,
          'type_convertible': formData.type === 'convertible' ? 1 : 0,
          'type_coupe': formData.type === 'coupe' ? 1 : 0,
          'type_hatchback': formData.type === 'hatchback' ? 1 : 0,
          'type_mini-van': formData.type === 'mini-van' ? 1 : 0,
          'type_offroad': formData.type === 'offroad' ? 1 : 0,
          'type_other': formData.type === 'other' ? 1 : 0,
          'type_pickup': formData.type === 'pickup' ? 1 : 0,
          'type_sedan': formData.type === 'sedan' ? 1 : 0,
          'type_truck': formData.type === 'truck' ? 1 : 0,
          'type_van': formData.type === 'van' ? 1 : 0,
          'type_wagon': formData.type === 'wagon' ? 1 : 0
        };

        const features = rfModel.features.map((name: string) => featureMap[name] ?? 0.0);

        const evaluation = predictForest(rfModel.trees, features);
        let finalPriceVal = evaluation.price;
        if (finalPriceVal < 200) finalPriceVal = 200;

        const make = encodeURIComponent(formData.marca.toLowerCase());
        const model = encodeURIComponent(formData.modelo.toLowerCase());

        setResult({
          price: finalPriceVal,
          deprecation: Math.floor(formData.mileage * 0.05),
          make: make,
          model: model,
          year: formData.year,
          brand: `${formData.marca} ${formData.modelo}`.trim() || 'Vehículo'
        });

        // Set API console data for local model
        setApiConsoleData({
          method: 'POST (Offline Fallback)',
          url: 'Client-Side Random Forest Engine (React JS)',
          status: 'Executed Local Random Forest',
          request: formData,
          response: {
            price: finalPriceVal,
            deprecation: Math.floor(formData.mileage * 0.05),
            base_price: finalPriceVal,
            brand_te: man_te_val,
            model_te: mod_te_val
          },
          features: features
        });

        // Extract tree votes for the simulator (first 3 trees, or sample them)
        const votes = evaluation.votes.slice(0, 3).map(v => Math.round(v));
        while (votes.length < 3) {
          votes.push(Math.round(finalPriceVal));
        }

        // Dispatch custom event for fallback calculation
        const event = new CustomEvent('car-prediction-made', {
          detail: {
            name: 'Tu Consulta',
            marca: formData.marca,
            modelo: formData.modelo,
            year: formData.year,
            mileage: formData.mileage,
            fuel: formData.fuel === 'gas' ? 'Gas' : formData.fuel === 'electric' ? 'Electric' : formData.fuel === 'hybrid' ? 'Hybrid' : 'Diesel',
            brandTE: man_te_val,
            modelTE: mod_te_val,
            treeVotes: votes,
            finalPrice: Math.round(finalPriceVal)
          }
        });
        window.dispatchEvent(event);

        setLoading(false);
      });
  };

  const demandInfo = getDemandStatus(formData);

  // Auto-scroll to results on mobile/tablet viewports once the prediction is loaded
  useEffect(() => {
    if (result && !loading) {
      if (window.innerWidth < 1024) {
        const timer = setTimeout(() => {
          document.getElementById('predictor-result')?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }, 150);
        return () => clearTimeout(timer);
      }
    }
  }, [result, loading]);

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
      {/* Left: Form */}
      <PredictorForm
        formData={formData}
        setFormData={setFormData}
        onSubmit={handlePredict}
        loading={loading}
      />

      {/* Right: Result & Log Inspector */}
      <div id="predictor-result" className="lg:col-span-5 lg:sticky lg:top-12 scroll-mt-24">
        <div className="bg-[#050B14] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative group h-full min-h-[500px] flex flex-col">
          <CarViewer
            loading={loading}
            result={result}
            demandInfo={demandInfo}
          />

          <ApiInspector
            apiConsoleData={apiConsoleData}
            showApiConsole={showApiConsole}
            setShowApiConsole={setShowApiConsole}
            loading={loading}
            result={result}
          />
        </div>
      </div>
    </div>
  );
}
