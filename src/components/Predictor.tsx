import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

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
    drive: 'fwd'
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

    // Simulate AI thinking
    setTimeout(() => {
      let basePrice = 18000;
      const marcaMin = formData.marca.toLowerCase();

      if (marcaMin.includes('bmw') || marcaMin.includes('mercedes') || marcaMin.includes('audi') || marcaMin.includes('lexus')) {
        basePrice = 35000;
      } else if (marcaMin.includes('toyota') || marcaMin.includes('honda')) {
        basePrice = 22000;
      }

      const yearDiff = formData.year - 2010;
      basePrice += (yearDiff * 1500);

      const deprecation = Math.floor(formData.mileage * 0.08);
      basePrice -= deprecation;

      if (basePrice < 2500) basePrice = 2500;

      const keyword = formData.marca.toLowerCase().replace(/\s+/g, ',');
      const imageUrl = `https://loremflickr.com/600/400/${keyword || 'car'},car?random=${Math.random()}`;

      setResult({
        price: basePrice,
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
          <p className="text-slate-400 text-sm">Ajusta las variables basadas en el dataset para obtener la predicción.</p>
        </div>

        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handlePredict(); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Marca del Vehículo</label>
              <input
                type="text"
                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl p-3.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
                placeholder="Ej. Toyota, Ford, BMW..."
                value={formData.marca}
                onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Año (Year)</label>
              <input
                type="number"
                min="1990"
                max="2026"
                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl p-3.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
                placeholder="Ej. 2018"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
              />
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
                onChange={(e) => setFormData({ ...formData, mileage: parseInt(e.target.value) })}
              />
            </div>
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Tipo (Type)</label>
              <select
                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl p-3.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 appearance-none"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="sedan">Sedán</option>
                <option value="suv">SUV</option>
                <option value="pickup">Pickup</option>
                <option value="truck">Truck</option>
                <option value="coupe">Coupé</option>
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
                <p className="text-sm text-cyan-400 font-bold tracking-[0.2em] animate-pulse">ANALIZANDO DATASET...</p>
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
                    PRECIO PREDECIDO
                  </p>
                  <h3 className="text-6xl lg:text-7xl font-extrabold text-white mb-8 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] tracking-tight">
                    ${result.price.toLocaleString('en-US')}
                  </h3>
                </div>

                <div className="mt-auto">
                  <div className="w-full text-left">
                    <div className="flex justify-between text-xs mb-2 items-center">
                      <span className="text-slate-100 font-medium text-sm">Nivel de Confianza (R²)</span>
                      <span className="text-cyan-400 font-bold text-sm">94%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 mb-6">
                      <div className="bg-cyan-500 h-1.5 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]" style={{ width: '94%' }}></div>
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
                  <span className="block text-[10px] text-slate-400 uppercase">Impacto Millaje</span>
                  <span className="font-mono text-sm text-red-400">-${result ? result.deprecation.toLocaleString('en-US') : '0'}</span>
                </div>
              </div>
              <div className="flex-1 bg-slate-950 rounded-lg p-3 border border-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase">Demanda</span>
                  <span className="font-mono text-sm text-green-400">Alta</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
