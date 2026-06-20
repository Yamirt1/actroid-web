import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import rfModel from './rf_model.json';

export default function Predictor() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [formData, setFormData] = useState({
    marca: '',
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

    // Run ML prediction
    setTimeout(() => {
      const mapSize = (s: string) => {
        switch(s) {
          case 'sub-compact': return 0;
          case 'compact': return 1;
          case 'mid-size': return 2;
          case 'full-size': return 3;
          default: return 2;
        }
      };

      const mapTitleStatus = (t: string) => {
        switch(t) {
          case 'parts only': return 0;
          case 'missing': return 1;
          case 'salvage': return 2;
          case 'rebuilt': return 3;
          case 'lien': return 4;
          case 'clean': return 5;
          default: return 5;
        }
      };

      const mapCondition = (c: string) => {
        switch(c) {
          case 'salvage': return 0;
          case 'fair': return 1;
          case 'good': return 2;
          case 'excellent': return 3;
          case 'like new': return 4;
          case 'new': return 5;
          default: return 3;
        }
      };

      const featureMap: Record<string, number> = {
        odometer: formData.mileage,
        size: mapSize(formData.size),
        title_status: mapTitleStatus(formData.titleStatus),
        year: formData.year,
        condition_encoding: mapCondition(formData.condition),
        cylinders_int: formData.cylinders,
        fuel_diesel: formData.fuel === 'diesel' ? 1 : 0,
        fuel_electric: formData.fuel === 'electric' ? 1 : 0,
        fuel_gas: formData.fuel === 'gas' ? 1 : 0,
        fuel_hybrid: formData.fuel === 'hybrid' ? 1 : 0,
        drive_4wd: formData.drive === '4wd' ? 1 : 0,
        drive_fwd: formData.drive === 'fwd' ? 1 : 0,
        drive_rwd: formData.drive === 'rwd' ? 1 : 0,
        transmission_automatic: formData.transmission === 'automatic' ? 1 : 0,
        transmission_manual: formData.transmission === 'manual' ? 1 : 0,
        transmission_other: formData.transmission === 'other' ? 1 : 0,
        type_SUV: formData.type === 'suv' ? 1 : 0,
        type_bus: formData.type === 'bus' ? 1 : 0,
        type_convertible: formData.type === 'convertible' ? 1 : 0,
        type_coupe: formData.type === 'coupe' ? 1 : 0,
        type_hatchback: formData.type === 'hatchback' ? 1 : 0,
        'type_mini-van': formData.type === 'mini-van' ? 1 : 0,
        type_offroad: formData.type === 'offroad' ? 1 : 0,
        type_other: formData.type === 'other' ? 1 : 0,
        type_pickup: formData.type === 'pickup' ? 1 : 0,
        type_sedan: formData.type === 'sedan' ? 1 : 0,
        type_truck: formData.type === 'truck' ? 1 : 0,
        type_van: formData.type === 'van' ? 1 : 0,
        type_wagon: formData.type === 'wagon' ? 1 : 0,
      };

      // Construct feature vector in exact order
      const inputVector = rfModel.features.map(feat => featureMap[feat] ?? 0);

      // Evaluate the Random Forest trees
      let totalPrediction = 0;
      const trees = rfModel.trees;
      
      for (let t = 0; t < trees.length; t++) {
        const tree = trees[t];
        let nodeIdx = 0;
        
        while (true) {
          const node = tree[nodeIdx];
          const isLeaf = node[0];
          
          if (isLeaf) {
            totalPrediction += node[1] as number;
            break;
          } else {
            const featIdx = node[1] as number;
            const threshold = node[2] as number;
            const leftChild = node[3] as number;
            const rightChild = node[4] as number;
            
            if (inputVector[featIdx] <= threshold) {
              nodeIdx = leftChild;
            } else {
              nodeIdx = rightChild;
            }
          }
        }
      }

      let predictedPrice = totalPrediction / trees.length;
      
      // Post-processing prediction thresholds (matching data cleanups)
      if (predictedPrice < 200) predictedPrice = 200;

      // Calculate simulated depreciation for comparison/display
      // Depreciation = Odometer effect on prediction (visual estimation)
      const deprecation = Math.floor(formData.mileage * 0.05);

      const keyword = formData.marca.toLowerCase().replace(/\s+/g, ',');
      const imageUrl = `https://loremflickr.com/600/400/${keyword || 'car'},car?random=${Math.random()}`;

      setResult({
        price: predictedPrice,
        deprecation: deprecation,
        imageUrl: imageUrl,
        brand: formData.marca || 'Vehículo'
      });
      setLoading(false);
    }, 1500);
  };

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
              <label className="block text-sm font-medium text-slate-300 mb-2">Año (Year)</label>
              <select
                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl p-3.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 appearance-none"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || 2018 })}
                required
              >
                {Array.from({ length: 2026 - 1980 + 1 }, (_, i) => 2026 - i).map((y) => (
                  <option key={y} value={y} className="bg-slate-950">{y}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Millaje (Odometer)</label>
              <input
                type="number"
                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl p-3.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
                placeholder="Ej. 45000"
                value={formData.mileage}
                onChange={(e) => setFormData({ ...formData, mileage: parseInt(e.target.value) || 0 })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Cilindrada (Cylinders)</label>
              <select
                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl p-3.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 appearance-none"
                value={formData.cylinders}
                onChange={(e) => setFormData({ ...formData, cylinders: parseInt(e.target.value) })}
              >
                <option value={3}>3 Cilindros</option>
                <option value={4}>4 Cilindros</option>
                <option value={5}>5 Cilindros</option>
                <option value={6}>6 Cilindros</option>
                <option value={8}>8 Cilindros</option>
                <option value={10}>10 Cilindros</option>
                <option value={12}>12 Cilindros</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Combustible (Fuel)</label>
              <select
                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl p-3.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 appearance-none"
                value={formData.fuel}
                onChange={(e) => setFormData({ ...formData, fuel: e.target.value })}
              >
                <option value="gas">Gasolina (Gas)</option>
                <option value="diesel">Diésel</option>
                <option value="hybrid">Híbrido</option>
                <option value="electric">Eléctrico</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Transmisión</label>
              <select
                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl p-3.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 appearance-none"
                value={formData.transmission}
                onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
              >
                <option value="automatic">Automática</option>
                <option value="manual">Manual</option>
                <option value="other">Otra</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Tipo de carrocería (Type)</label>
              <select
                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl p-3.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 appearance-none"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="sedan">Sedán</option>
                <option value="suv">SUV</option>
                <option value="pickup">Pickup</option>
                <option value="truck">Truck / Camión</option>
                <option value="coupe">Coupé</option>
                <option value="hatchback">Hatchback</option>
                <option value="mini-van">Mini-van</option>
                <option value="convertible">Convertible</option>
                <option value="van">Van / Furgoneta</option>
                <option value="wagon">Wagon / Familiar</option>
                <option value="offroad">Offroad / Todo Terreno</option>
                <option value="bus">Bus / Colectivo</option>
                <option value="other">Otro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Tamaño (Size)</label>
              <select
                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl p-3.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 appearance-none"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
              >
                <option value="sub-compact">Sub-compacto</option>
                <option value="compact">Compacto</option>
                <option value="mid-size">Mediano (Mid-size)</option>
                <option value="full-size">Grande (Full-size)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Condición (Condition)</label>
              <select
                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl p-3.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 appearance-none"
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
              >
                <option value="salvage">Salvamento / Chatarra</option>
                <option value="fair">Aceptable (Fair)</option>
                <option value="good">Bueno (Good)</option>
                <option value="excellent">Excelente (Excellent)</option>
                <option value="like new">Como Nuevo</option>
                <option value="new">Nuevo</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Estado del Título (Title Status)</label>
              <select
                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl p-3.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 appearance-none"
                value={formData.titleStatus}
                onChange={(e) => setFormData({ ...formData, titleStatus: e.target.value })}
              >
                <option value="clean">Limpio (Clean)</option>
                <option value="rebuilt">Reconstruido (Rebuilt)</option>
                <option value="salvage">Salvamento (Salvage)</option>
                <option value="lien">Embargo (Lien)</option>
                <option value="missing">Faltante</option>
                <option value="parts only">Solo Partes</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">Tracción (Drive)</label>
            <div className="flex flex-wrap gap-3">
              {['fwd', 'rwd', '4wd'].map((drive) => (
                <label key={drive} className="cursor-pointer">
                  <input
                    type="radio"
                    name="drive"
                    className="peer sr-only"
                    checked={formData.drive === drive}
                    onChange={() => setFormData({ ...formData, drive })}
                  />
                  <div className="px-5 py-2.5 rounded-lg border border-slate-700 text-slate-400 peer-checked:bg-cyan-500/20 peer-checked:border-cyan-500 peer-checked:text-cyan-400 transition-all text-sm font-medium uppercase">
                    {drive} {drive === 'fwd' ? '(Delantera)' : drive === 'rwd' ? '(Trasera)' : '/ AWD'}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 mt-6 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 text-lg flex justify-center items-center gap-2"
            disabled={loading}
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
                      <span className="text-cyan-400 font-bold text-sm">69.1%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 mb-6">
                      <div className="bg-cyan-500 h-1.5 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]" style={{ width: '69.1%' }}></div>
                    </div>
                  </div>

                  <div className="w-full rounded-xl overflow-hidden border border-slate-800 shadow-lg relative bg-slate-900 animate-float">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050B14]/90 to-transparent z-10"></div>
                    <img src={result.imageUrl} className="w-full h-40 object-cover opacity-90" alt="Vehículo Analizado" />
                    <div className="absolute bottom-3 left-4 z-20">
                      <span className="text-xs font-bold text-white bg-cyan-600/90 px-2.5 py-1 rounded-md backdrop-blur-md uppercase tracking-wider shadow-md">
                        {result.brand}
                      </span>
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
                <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase">Demanda ML</span>
                  <span className="font-mono text-sm text-green-400">Normal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

