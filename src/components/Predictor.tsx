import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { VEHICLE_DATA, getSpecs } from './vehicleData';
import rfModel from './rf_model.json';
import manufacturerToTE from './manufacturer_to_TE.json';
import modelToTE from './model_to_TE.json';

// Helper mapping functions for client-side model
function map_size(s: string): number {
  if (s === 'sub-compact') return 0;
  if (s === 'compact') return 1;
  if (s === 'mid-size') return 2;
  if (s === 'full-size') return 3;
  return 2;
}

function map_title_status(t: string): number {
  if (t === 'parts only') return 0;
  if (t === 'missing') return 1;
  if (t === 'salvage') return 2;
  if (t === 'rebuilt') return 3;
  if (t === 'lien') return 4;
  if (t === 'clean') return 5;
  return 5;
}

function map_condition(c: string): number {
  if (c === 'salvage') return 0;
  if (c === 'fair') return 1;
  if (c === 'good') return 2;
  if (c === 'excellent') return 3;
  if (c === 'like new') return 4;
  if (c === 'new') return 5;
  return 3;
}

function predictTree(tree: any[], features: number[]): number {
  let nodeIndex = 0;
  let count = 0;
  while (count < 1000) {
    const node = tree[nodeIndex];
    if (!node) return 0;
    const isLeaf = node[0];
    if (isLeaf) {
      return node[1]; // Leaf value is at index 1
    }
    const featureIdx = node[1];
    const threshold = node[2];
    const val = features[featureIdx];
    if (val <= threshold) {
      nodeIndex = node[3];
    } else {
      nodeIndex = node[4];
    }
    count++;
  }
  return 0;
}

function predictForest(forest: any[][], features: number[]): { price: number; votes: number[] } {
  let sum = 0;
  let count = 0;
  const votes: number[] = [];
  for (let i = 0; i < forest.length; i++) {
    const p = predictTree(forest[i], features);
    if (p !== null && !isNaN(p)) {
      sum += p;
      votes.push(p);
      count++;
    }
  }
  return {
    price: count > 0 ? sum / count : 0,
    votes: votes
  };
}

function getDemandStatus(formData: any): { text: string; colorClass: string; bgClass: string } {
  // Low demand: title is not clean, or mileage is extremely high (e.g. > 180,000 miles), or vehicle condition is salvage/fair
  const isLowDemand = 
    ['rebuilt', 'salvage', 'lien', 'missing', 'parts only'].includes(formData.titleStatus) ||
    formData.mileage > 180000 ||
    ['salvage', 'fair'].includes(formData.condition);
  
  if (isLowDemand) {
    return { text: 'Baja', colorClass: 'text-red-400', bgClass: 'bg-red-500/10' };
  }

  // High demand: title is clean, low mileage, excellent or better condition, recent year, popular brand
  const popularBrands = ['toyota', 'honda', 'ford', 'chevrolet', 'jeep', 'nissan'];
  const isHighDemand = 
    formData.titleStatus === 'clean' &&
    formData.mileage < 60000 &&
    ['excellent', 'like new', 'new'].includes(formData.condition) &&
    formData.year >= 2018 &&
    popularBrands.includes(formData.marca.toLowerCase());

  if (isHighDemand) {
    return { text: 'Alta', colorClass: 'text-cyan-400', bgClass: 'bg-cyan-500/10' };
  }

  // Default
  return { text: 'Normal', colorClass: 'text-green-400', bgClass: 'bg-green-500/10' };
}

export default function Predictor() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [currentAngle, setCurrentAngle] = useState(21);
  const [showApiConsole, setShowApiConsole] = useState(false);
  const [apiConsoleData, setApiConsoleData] = useState<any>(null);

  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startAngleRef = useRef(21);

  const handleDragStart = (clientX: number) => {
    isDraggingRef.current = true;
    startXRef.current = clientX;
    startAngleRef.current = currentAngle;
  };

  const handleDragMove = (clientX: number) => {
    if (!isDraggingRef.current) return;
    const dx = clientX - startXRef.current;
    // 12px of movement rotates 1 step
    const stepDiff = Math.floor(dx / 12);
    let newAngle = (startAngleRef.current - stepDiff) % 32;
    if (newAngle <= 0) newAngle += 32;
    setCurrentAngle(newAngle);
  };

  const handleDragEnd = () => {
    isDraggingRef.current = false;
  };

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

  const resultRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Dynamic filter validation
  useEffect(() => {
    if (!formData.marca) {
      setFormData(prev => ({ ...prev, modelo: '' }));
      return;
    }

    const brandLower = formData.marca.toLowerCase();
    const validModels = VEHICLE_DATA[brandLower] ? Object.keys(VEHICLE_DATA[brandLower]) : [];
    if (formData.modelo && !validModels.includes(formData.modelo.toLowerCase())) {
      setFormData(prev => ({ ...prev, modelo: '' }));
      return;
    }

    if (formData.modelo) {
      const specs = getSpecs(formData.marca, formData.modelo);
      setFormData(prev => {
        let updated = { ...prev };
        let changed = false;

        if (specs.years.length > 0 && !specs.years.includes(prev.year)) {
          updated.year = specs.years[0];
          changed = true;
        }
        if (specs.cylinders.length > 0 && !specs.cylinders.includes(prev.cylinders)) {
          updated.cylinders = specs.cylinders[0];
          changed = true;
        }
        if (specs.fuels.length > 0 && !specs.fuels.includes(prev.fuel)) {
          updated.fuel = specs.fuels[0];
          changed = true;
        }
        if (specs.transmissions.length > 0 && !specs.transmissions.includes(prev.transmission)) {
          updated.transmission = specs.transmissions[0];
          changed = true;
        }
        if (specs.types.length > 0 && !specs.types.includes(prev.type)) {
          updated.type = specs.types[0];
          changed = true;
        }
        if (specs.sizes.length > 0 && !specs.sizes.includes(prev.size)) {
          updated.size = specs.sizes[0];
          changed = true;
        }
        if (specs.drives.length > 0 && !specs.drives.includes(prev.drive)) {
          updated.drive = specs.drives[0];
          changed = true;
        }

        return changed ? updated : prev;
      });
    }
  }, [formData.marca, formData.modelo]);

  useEffect(() => {
    if (result && resultRef.current) {
      gsap.fromTo(resultRef.current, 
        { opacity: 0, scale: 0.9, y: 20 }, 
        { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'back.out(1.7)' }
      );
    }
  }, [result]);

  const handlePredict = () => {
    setLoading(true);
    setResult(null);

    // Animate progress bar
    setTimeout(() => {
      if (progressBarRef.current) {
        gsap.fromTo(progressBarRef.current, 
          { width: '0%' }, 
          { width: '100%', duration: 1.5, ease: 'power1.inOut' }
        );
      }
    }, 10);

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
        
        // 3. Evaluate random forest model client-side
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
  const specs = getSpecs(formData.marca, formData.modelo);
  const models = formData.marca ? Object.keys(VEHICLE_DATA[formData.marca.toLowerCase()] || {}) : [];
  const isFormLocked = !formData.marca || !formData.modelo;
  const demandInfo = getDemandStatus(formData);

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
      {/* Left: Form */}
      <div className="lg:col-span-7 glass-card p-8 rounded-3xl shadow-2xl">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Parámetros del Vehículo</h2>
          <p className="text-slate-400 text-sm">Ajusta las variables basadas en el dataset para obtener la predicción del modelo Random Forest.</p>
        </div>

        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handlePredict(); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Marca del Vehículo</label>
              <select
                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl p-3.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 appearance-none capitalize"
                value={formData.marca}
                onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                required
              >
                <option value="" className="bg-slate-950">Selecciona una marca...</option>
                {['acura', 'alfa-romeo', 'aston-martin', 'audi', 'bmw', 'buick', 'cadillac', 'chevrolet', 'chrysler', 'datsun', 'dodge', 'ferrari', 'fiat', 'ford', 'gmc', 'harley-davidson', 'honda', 'hyundai', 'infiniti', 'jaguar', 'jeep', 'kia', 'land rover', 'lexus', 'lincoln', 'mazda', 'mercedes-benz', 'mercury', 'mini', 'mitsubishi', 'nissan', 'pontiac', 'porsche', 'ram', 'rover', 'saturn', 'subaru', 'tesla', 'toyota', 'volkswagen', 'volvo'].map((m) => (
                  <option key={m} value={m} className="capitalize bg-slate-950">{m.replace('-', ' ')}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Modelo del Vehículo</label>
              <select
                className="w-full bg-slate-950/50 border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed disabled:border-slate-800 disabled:bg-slate-950/20 rounded-xl p-3.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 appearance-none capitalize"
                value={formData.modelo}
                onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                disabled={!formData.marca}
                required
              >
                <option value="" className="bg-slate-950">
                  {!formData.marca ? 'Selecciona una marca primero...' : 'Selecciona un modelo...'}
                </option>
                {models.map((m) => (
                  <option key={m} value={m} className="capitalize bg-slate-950">{m}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Año (Year)</label>
              <select
                className="w-full bg-slate-950/50 border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed disabled:border-slate-800 disabled:bg-slate-950/20 rounded-xl p-3.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 appearance-none"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || 2018 })}
                disabled={isFormLocked}
                required
              >
                {specs.years.map((y) => (
                  <option key={y} value={y} className="bg-slate-950">{y}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Millaje (Odometer)</label>
              <input
                type="number"
                className="w-full bg-slate-950/50 border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed disabled:border-slate-800 disabled:bg-slate-950/20 rounded-xl p-3.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
                placeholder={isFormLocked ? "Bloqueado" : "Ej. 45000"}
                value={formData.mileage}
                onChange={(e) => setFormData({ ...formData, mileage: parseInt(e.target.value) || 0 })}
                disabled={isFormLocked}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Cilindrada (Cylinders)</label>
              <select
                className="w-full bg-slate-950/50 border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed disabled:border-slate-800 disabled:bg-slate-950/20 rounded-xl p-3.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 appearance-none"
                value={formData.cylinders}
                onChange={(e) => setFormData({ ...formData, cylinders: parseInt(e.target.value) })}
                disabled={isFormLocked}
              >
                {[3, 4, 5, 6, 8, 10, 12].map((cyl) => {
                  const isAvailable = specs.cylinders.includes(cyl);
                  if (!isAvailable) return null;
                  return (
                    <option key={cyl} value={cyl} className="bg-slate-950">{cyl} Cilindros</option>
                  );
                })}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Combustible (Fuel)</label>
              <select
                className="w-full bg-slate-950/50 border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed disabled:border-slate-800 disabled:bg-slate-950/20 rounded-xl p-3.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 appearance-none"
                value={formData.fuel}
                onChange={(e) => setFormData({ ...formData, fuel: e.target.value })}
                disabled={isFormLocked}
              >
                {[
                  { val: 'gas', label: 'Gasolina (Gas)' },
                  { val: 'diesel', label: 'Diésel' },
                  { val: 'hybrid', label: 'Híbrido' },
                  { val: 'electric', label: 'Eléctrico' }
                ].map((f) => {
                  const isAvailable = specs.fuels.includes(f.val);
                  if (!isAvailable) return null;
                  return (
                    <option key={f.val} value={f.val} className="bg-slate-950">{f.label}</option>
                  );
                })}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Transmisión</label>
              <select
                className="w-full bg-slate-950/50 border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed disabled:border-slate-800 disabled:bg-slate-950/20 rounded-xl p-3.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 appearance-none"
                value={formData.transmission}
                onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                disabled={isFormLocked}
              >
                {[
                  { val: 'automatic', label: 'Automática' },
                  { val: 'manual', label: 'Manual' },
                  { val: 'other', label: 'Otra' }
                ].map((t) => {
                  const isAvailable = specs.transmissions.includes(t.val);
                  if (!isAvailable) return null;
                  return (
                    <option key={t.val} value={t.val} className="bg-slate-950">{t.label}</option>
                  );
                })}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Tipo de carrocería (Type)</label>
              <select
                className="w-full bg-slate-950/50 border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed disabled:border-slate-800 disabled:bg-slate-950/20 rounded-xl p-3.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 appearance-none capitalize"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                disabled={isFormLocked}
              >
                {[
                  { val: 'sedan', label: 'Sedán' },
                  { val: 'suv', label: 'SUV' },
                  { val: 'pickup', label: 'Pickup' },
                  { val: 'truck', label: 'Truck / Camión' },
                  { val: 'coupe', label: 'Coupé' },
                  { val: 'hatchback', label: 'Hatchback' },
                  { val: 'mini-van', label: 'Mini-van' },
                  { val: 'convertible', label: 'Convertible' },
                  { val: 'van', label: 'Van / Furgoneta' },
                  { val: 'wagon', label: 'Wagon / Familiar' },
                  { val: 'offroad', label: 'Offroad / Todo Terreno' },
                  { val: 'bus', label: 'Bus / Colectivo' },
                  { val: 'other', label: 'Otro' }
                ].map((t) => {
                  const isAvailable = specs.types.includes(t.val);
                  if (!isAvailable) return null;
                  return (
                    <option key={t.val} value={t.val} className="bg-slate-950">{t.label}</option>
                  );
                })}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Tamaño (Size)</label>
              <select
                className="w-full bg-slate-950/50 border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed disabled:border-slate-800 disabled:bg-slate-950/20 rounded-xl p-3.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 appearance-none"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                disabled={isFormLocked}
              >
                {[
                  { val: 'sub-compact', label: 'Sub-compacto' },
                  { val: 'compact', label: 'Compacto' },
                  { val: 'mid-size', label: 'Mediano (Mid-size)' },
                  { val: 'full-size', label: 'Grande (Full-size)' }
                ].map((s) => {
                  const isAvailable = specs.sizes.includes(s.val);
                  if (!isAvailable) return null;
                  return (
                    <option key={s.val} value={s.val} className="bg-slate-950">{s.label}</option>
                  );
                })}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Condición (Condition)</label>
              <select
                className="w-full bg-slate-950/50 border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed disabled:border-slate-800 disabled:bg-slate-950/20 rounded-xl p-3.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 appearance-none"
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                disabled={isFormLocked}
              >
                <option value="salvage">Salvamento / Chatarra</option>
                <option value="fair">Aceptable (Fair)</option>
                <option value="good">Bueno (Good)</option>
                <option value="excellent">Excelente (Excellent)</option>
                <option value="like new">Como Nuevo</option>
                <option value="new">Nuevo</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Estado del Título (Title Status)</label>
              <select
                className="w-full bg-slate-950/50 border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed disabled:border-slate-800 disabled:bg-slate-950/20 rounded-xl p-3.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 appearance-none"
                value={formData.titleStatus}
                onChange={(e) => setFormData({ ...formData, titleStatus: e.target.value })}
                disabled={isFormLocked}
              >
                <option value="clean">Limpio (Clean)</option>
                <option value="rebuilt">Reconstruido (Rebuilt)</option>
                <option value="salvage">Salvamento (Salvage)</option>
                <option value="lien">Embargo (Lien)</option>
                <option value="missing">Faltante</option>
                <option value="parts only">Solo Partes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">Tracción (Drive)</label>
              <div className="flex flex-wrap gap-3">
                {['fwd', 'rwd', '4wd'].map((drive) => {
                  const isAvailable = specs.drives.includes(drive);
                  const isDriveChecked = formData.drive === drive;
                  return (
                    <label key={drive} className={`cursor-pointer ${(!isAvailable || isFormLocked) ? 'opacity-30 cursor-not-allowed' : ''}`}>
                      <input
                        type="radio"
                        name="drive"
                        className="peer sr-only"
                        checked={isDriveChecked}
                        onChange={() => {
                          if (isAvailable && !isFormLocked) {
                            setFormData({ ...formData, drive });
                          }
                        }}
                        disabled={!isAvailable || isFormLocked}
                      />
                      <div className="px-5 py-2.5 rounded-lg border border-slate-700 text-slate-400 peer-checked:bg-cyan-500/20 peer-checked:border-cyan-500 peer-checked:text-cyan-400 transition-all text-sm font-medium uppercase">
                        {drive} {drive === 'fwd' ? '(Delantera)' : drive === 'rwd' ? '(Trasera)' : '/ AWD'}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 mt-6 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-slate-800 disabled:to-slate-900 disabled:text-slate-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 text-lg flex justify-center items-center gap-2"
            disabled={loading || isFormLocked}
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"/><path d="m14 7 3 3"/><path d="M5 6v4"/><path d="M19 14v4"/><path d="M10 2v2"/><path d="M7 8H3"/><path d="M21 16h-4"/><path d="M11 3H9"/></svg>
                Predecir Precio
              </>
            )}
          </button>
        </form>
      </div>

      {/* Right: Result */}
      <div className="lg:col-span-5 sticky top-12">
        <div className="bg-[#050B14] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative group h-full min-h-[500px] flex flex-col">
          <div className="relative flex-1 flex flex-col p-10 overflow-hidden">
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]"></div>

            {loading && (
              <div className="text-center relative z-10 flex flex-col items-center justify-center h-full w-full px-10">
                <div className="w-full bg-slate-800/50 rounded-full h-3 border border-slate-700 overflow-hidden mb-4 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                  <div 
                    ref={progressBarRef}
                    className="bg-gradient-to-r from-cyan-600 to-blue-500 h-full shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                    style={{ width: '0%' }}
                  ></div>
                </div>
                <p className="text-sm text-cyan-400 font-bold tracking-[0.2em] animate-pulse">EVALUANDO MODELO ML...</p>
              </div>
            )}

            {!loading && !result && (
              <div className="text-center relative z-10 flex flex-col items-center justify-center h-full">
                <div className="w-16 h-16 mx-auto mb-4 bg-slate-900 rounded-full flex items-center justify-center border border-slate-800 text-slate-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                </div>
                <p className="text-sm text-slate-400 font-medium tracking-wide">ESPERANDO PARÁMETROS</p>
              </div>
            )}

            {!loading && result && (
              <div className="text-center relative z-10 w-full flex flex-col justify-between h-full" ref={resultRef}>
                <div className="mt-4">
                  <p className="text-white text-sm mb-4 uppercase tracking-[0.2em] font-semibold">
                    PRECIO ESTIMADO
                  </p>
                  <h3 className="text-6xl lg:text-7xl font-extrabold text-white mb-8 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] tracking-tight">
                    ${Math.round(result.price).toLocaleString('en-US')}
                  </h3>
                </div>

                <div className="mt-auto">
                  <div className="w-full text-left">
                    <div className="flex justify-between text-xs mb-2 items-center">
                      <span className="text-slate-100 font-medium text-sm">Precisión del Modelo (R²)</span>
                      <span className="text-cyan-400 font-bold text-sm">77.9%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 mb-6">
                      <div className="bg-cyan-500 h-1.5 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]" style={{ width: '77.9%' }}></div>
                    </div>
                  </div>

                  <div 
                    className="w-full rounded-2xl overflow-hidden border border-slate-800 shadow-lg relative bg-slate-900 animate-float cursor-grab active:cursor-grabbing select-none"
                    onMouseDown={(e) => { e.preventDefault(); handleDragStart(e.clientX); }}
                    onMouseMove={(e) => { if (isDraggingRef.current) { e.preventDefault(); handleDragMove(e.clientX); } }}
                    onMouseUp={handleDragEnd}
                    onMouseLeave={handleDragEnd}
                    onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
                    onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
                    onTouchEnd={handleDragEnd}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050B14]/90 to-transparent z-10 pointer-events-none"></div>
                    <img 
                      src={`https://cdn.imagin.studio/getImage?customer=img&make=${result.make}&modelFamily=${result.model}&modelYear=${result.year}&angle=${String(currentAngle).padStart(2, '0')}&zoomType=fullscreen`} 
                      className="w-full h-60 md:h-72 object-cover opacity-90 transition-all duration-300 pointer-events-none select-none" 
                      alt="Vehículo Analizado" 
                      draggable="false"
                    />
                    <div className="absolute bottom-3 left-4 z-20">
                      <span className="text-xs font-bold text-white bg-cyan-600/90 px-2.5 py-1 rounded-md backdrop-blur-md uppercase tracking-wider shadow-md">
                        {result.brand}
                      </span>
                    </div>
                  </div>

                  {/* Hint text */}
                  <div className="text-[10px] text-slate-500 font-medium text-center mt-2.5 flex items-center justify-center gap-1.5 select-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" className="text-slate-500 animate-pulse"><path d="M7 15h10M4 9h16M14 4h-4"/><circle cx="12" cy="12" r="10"/></svg>
                    Haz clic y arrastra horizontalmente para rotar el carro 360°
                  </div>

                  {/* Selector de Ángulo de Cámara */}
                  <div className="mt-4 flex justify-between items-center bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 backdrop-blur-md">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider pl-1 flex items-center gap-1.5 select-none">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" className="text-cyan-400"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                      Ángulo Cámara
                    </span>
                    <div className="flex gap-1.5">
                      {[
                        { id: 21, label: 'Diag 1' },
                        { id: 29, label: 'Diag 2' },
                        { id: 23, label: 'Perfil' },
                        { id: 1, label: 'Trasero' }
                      ].map((angle) => (
                        <button
                          key={angle.id}
                          type="button"
                          onClick={() => setCurrentAngle(angle.id)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all ${
                            currentAngle === angle.id
                              ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                          }`}
                        >
                          {angle.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 bg-slate-900/90 border-t border-slate-800 backdrop-blur-md">
            <h4 className="text-white font-semibold mb-3 text-sm">Factores determinantes</h4>
            <div className="flex gap-3">
              <div className="flex-1 bg-slate-950 rounded-lg p-3 border border-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase">Fuga Estimada</span>
                  <span className="font-mono text-sm text-red-400">-${result ? result.deprecation.toLocaleString('en-US') : '0'}</span>
                </div>
              </div>
              <div className="flex-1 bg-slate-950 rounded-lg p-3 border border-slate-800 flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full ${demandInfo.bgClass} flex items-center justify-center ${demandInfo.colorClass}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase">Demanda ML</span>
                  <span className={`font-mono text-sm ${demandInfo.colorClass}`}>{demandInfo.text}</span>
                </div>
              </div>
            </div>
          </div>

          {/* API Inspector Panel */}
          <div className="p-5 bg-slate-950/90 border-t border-slate-850/80 backdrop-blur-md">
            <button
              type="button"
              onClick={() => setShowApiConsole(!showApiConsole)}
              className="w-full flex items-center justify-between text-xs text-slate-400 hover:text-white font-mono uppercase tracking-wider py-1.5 select-none transition-colors"
            >
              <span className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-400 animate-ping' : result ? 'bg-green-400' : 'bg-slate-600'}`}></span>
                {showApiConsole ? '[-] Ocultar' : '[+] Mostrar'} Inspector de la API (JSON)
              </span>
              <span className="text-[10px] text-cyan-400/80 font-bold bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/30">
                LIVE LOG
              </span>
            </button>
            
            {showApiConsole && (
              <div className="mt-4 space-y-4 font-mono text-[10px] text-slate-300 text-left bg-black/70 p-4 rounded-xl border border-slate-850 overflow-y-auto max-h-[260px] scrollbar-thin">
                {apiConsoleData ? (
                  <>
                    <div className="flex flex-wrap gap-x-2">
                      <span className="text-cyan-400 font-bold">Request:</span>
                      <span className="text-purple-400 font-semibold">{apiConsoleData.method}</span>
                      <span className="text-slate-400 select-all">{apiConsoleData.url}</span>
                    </div>
                    <div>
                      <span className="text-cyan-400 font-bold">Status:</span>
                      <span className="text-green-400 font-semibold">{apiConsoleData.status}</span>
                    </div>
                    <div className="border-t border-slate-900 pt-2.5 mt-2">
                      <span className="text-yellow-400/90 block mb-1.5">// JSON enviado por el cliente:</span>
                      <pre className="text-slate-300 bg-slate-950/60 p-2.5 rounded border border-slate-900 overflow-x-auto text-[9px]">
                        {JSON.stringify(apiConsoleData.request, null, 2)}
                      </pre>
                    </div>
                    <div className="border-t border-slate-900 pt-2.5 mt-2">
                      <span className="text-yellow-400/90 block mb-1.5">// Vector de Características procesado (X Input):</span>
                      <pre className="text-slate-300 bg-slate-950/60 p-2.5 rounded border border-slate-900 overflow-x-auto text-[9px]">
                        {JSON.stringify(apiConsoleData.features, null, 2)}
                      </pre>
                    </div>
                    <div className="border-t border-slate-900 pt-2.5 mt-2">
                      <span className="text-yellow-400/90 block mb-1.5">// JSON devuelto por la API / Modelo:</span>
                      <pre className="text-slate-300 bg-slate-950/60 p-2.5 rounded border border-slate-900 overflow-x-auto text-[9px]">
                        {JSON.stringify(apiConsoleData.response, null, 2)}
                      </pre>
                    </div>
                  </>
                ) : (
                  <div className="text-slate-500 text-center py-4 select-none">
                    Realiza una predicción para ver el flujo de datos y cargas JSON de la API.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

