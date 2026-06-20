import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import rfModel from './rf_model.json';

export default function CyberPredictor() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [formData, setFormData] = useState({
    marca: '',
    year: 2024,
    mileage: 0,
    fuel: 'electric',
    transmission: 'automatic',
    type: 'sedan',
    drive: 'fwd',
    size: 'mid-size',
    condition: 'excellent',
    titleStatus: 'clean',
    cylinders: 4
  });

  const resultRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Parallax Effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const xPos = (clientX / innerWidth - 0.5) * 20;
      const yPos = (clientY / innerHeight - 0.5) * 20;

      gsap.to(cardRef.current, {
        rotationY: xPos,
        rotationX: -yPos,
        duration: 1.2,
        ease: 'power2.out',
        transformPerspective: 1000
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Entrance Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.cyber-input-group', {
        x: -50,
        opacity: 0,
        stagger: 0.05,
        duration: 1,
        ease: 'power4.out',
        delay: 0.5
      });
    }, formRef);
    return () => ctx.revert();
  }, []);

  const handlePredict = () => {
    setLoading(true);
    setResult(null);

    // Initial glitch on start
    gsap.to(cardRef.current, {
      x: () => (Math.random() - 0.5) * 10,
      y: () => (Math.random() - 0.5) * 10,
      duration: 0.1,
      repeat: 5,
      yoyo: true,
      onComplete: () => gsap.to(cardRef.current, { x: 0, y: 0 })
    });

    setTimeout(() => {
      if (progressRef.current) {
        gsap.fromTo(progressRef.current, 
          { width: '0%', backgroundColor: '#06b6d4', boxShadow: '0 0 0px #06b6d4' }, 
          { width: '100%', backgroundColor: '#f0abfc', boxShadow: '0 0 20px #f0abfc', duration: 2, ease: 'power2.inOut' }
        );
      }
    }, 50);

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
      if (predictedPrice < 200) predictedPrice = 200;

      const deprecation = Math.floor(formData.mileage * 0.05);
      const imageUrl = `https://loremflickr.com/800/600/${formData.marca.toLowerCase() || 'futuristic,car'},car?random=${Math.random()}`;

      setResult({
        price: predictedPrice,
        deprecation: deprecation,
        imageUrl: imageUrl,
        brand: formData.marca.toUpperCase() || 'CORE_SYSTEM'
      });
      setLoading(false);
    }, 2100);
  };

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center p-4 md:p-6 perspective-1000">
      
      {/* LEFT: Cyber Form */}
      <div className="lg:col-span-6 relative z-10 w-full" ref={cardRef}>
        {/* Animated Borders */}
        <div className="absolute -inset-[1px] bg-gradient-to-tr from-cyan-500 via-transparent to-purple-500 opacity-50 rounded-lg"></div>
        <div className="absolute inset-0 bg-black/90 backdrop-blur-3xl rounded-lg"></div>
        
        <div className="relative p-6 md:p-10 overflow-hidden">
          {/* Background data patterns */}
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <div className="text-[8px] font-mono leading-none">
              {Array.from({length: 10}).map((_, i) => (
                <div key={i}>0x{Math.random().toString(16).slice(2, 10).toUpperCase()}</div>
              ))}
            </div>
          </div>

          <div className="mb-8 md:mb-12 relative">
            <span className="text-[8px] md:text-[10px] font-mono text-cyan-500 tracking-[0.5em] block mb-2">INITIALIZING_PROTOCOL</span>
            <h2 className="text-2xl md:text-4xl font-black text-white italic tracking-tighter uppercase flex items-center gap-4">
              <span className="w-8 h-[2px] bg-cyan-500"></span>
              Data Input
            </h2>
          </div>

          <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); handlePredict(); }} ref={formRef}>
            <div className="cyber-input-group relative group">
              <select
                className="w-full bg-transparent border-b border-white/20 py-4 text-xl text-white font-light focus:outline-none focus:border-cyan-500 appearance-none capitalize"
                value={formData.marca}
                onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                required
              >
                <option value="" className="bg-slate-950">[ SELECT BRAND ]</option>
                {['acura', 'alfa-romeo', 'aston-martin', 'audi', 'bmw', 'buick', 'cadillac', 'chevrolet', 'chrysler', 'datsun', 'dodge', 'ferrari', 'fiat', 'ford', 'gmc', 'harley-davidson', 'honda', 'hyundai', 'infiniti', 'jaguar', 'jeep', 'kia', 'land rover', 'lexus', 'lincoln', 'mazda', 'mercedes-benz', 'mercury', 'mini', 'mitsubishi', 'nissan', 'pontiac', 'porsche', 'ram', 'rover', 'saturn', 'subaru', 'tesla', 'toyota', 'volkswagen', 'volvo'].map((m) => (
                  <option key={m} value={m} className="capitalize bg-slate-950">{m.replace('-', ' ')}</option>
                ))}
              </select>
              <label className="absolute left-0 -top-4 text-white/30 text-[10px] tracking-widest">
                [ VEHICLE_IDENTIFIER ]
              </label>
              <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-cyan-500 group-hover:w-full transition-all duration-500"></div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="cyber-input-group relative group">
                <select
                  className="w-full bg-transparent border-b border-white/20 py-4 text-white focus:outline-none focus:border-purple-500 appearance-none"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || 2024 })}
                  required
                >
                  {Array.from({ length: 2026 - 1980 + 1 }, (_, i) => 2026 - i).map((y) => (
                    <option key={y} value={y} className="bg-slate-950">{y}</option>
                  ))}
                </select>
                <label className="absolute left-0 -top-4 text-white/30 text-[10px] tracking-widest">
                  MANUFACTURE_YEAR
                </label>
              </div>
              <div className="cyber-input-group relative group">
                <input
                  type="number"
                  className="w-full bg-transparent border-b border-white/20 py-4 text-white focus:outline-none focus:border-cyan-500 transition-all peer placeholder:opacity-0"
                  value={formData.mileage}
                  onChange={(e) => setFormData({ ...formData, mileage: parseInt(e.target.value) || 0 })}
                  required
                />
                <label className="absolute left-0 top-4 text-white/30 text-[10px] tracking-widest transition-all peer-focus:-top-4 peer-focus:text-cyan-400 peer-[&:not(:placeholder-shown)]:-top-4">
                  KILOMETER_COUNT
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="cyber-input-group relative group">
                <select
                  className="w-full bg-transparent border-b border-white/20 py-4 text-white focus:outline-none focus:border-cyan-500 transition-all appearance-none"
                  value={formData.cylinders}
                  onChange={(e) => setFormData({ ...formData, cylinders: parseInt(e.target.value) })}
                >
                  <option value={3} className="bg-slate-950">3 Cylinders</option>
                  <option value={4} className="bg-slate-950">4 Cylinders</option>
                  <option value={5} className="bg-slate-950">5 Cylinders</option>
                  <option value={6} className="bg-slate-950">6 Cylinders</option>
                  <option value={8} className="bg-slate-950">8 Cylinders</option>
                  <option value={10} className="bg-slate-950">10 Cylinders</option>
                  <option value={12} className="bg-slate-950">12 Cylinders</option>
                </select>
                <label className="absolute left-0 -top-4 text-white/30 text-[10px] tracking-widest">
                  CYLINDER_ACTUATORS
                </label>
              </div>
              <div className="cyber-input-group relative group">
                <select
                  className="w-full bg-transparent border-b border-white/20 py-4 text-white focus:outline-none focus:border-purple-500 transition-all appearance-none"
                  value={formData.fuel}
                  onChange={(e) => setFormData({ ...formData, fuel: e.target.value })}
                >
                  <option value="gas" className="bg-slate-950">Gasoline</option>
                  <option value="diesel" className="bg-slate-950">Diesel</option>
                  <option value="hybrid" className="bg-slate-950">Hybrid</option>
                  <option value="electric" className="bg-slate-950">Electric</option>
                </select>
                <label className="absolute left-0 -top-4 text-white/30 text-[10px] tracking-widest">
                  ENERGY_SOURCE
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="cyber-input-group relative group">
                <select
                  className="w-full bg-transparent border-b border-white/20 py-4 text-white focus:outline-none focus:border-purple-500 transition-all appearance-none"
                  value={formData.transmission}
                  onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                >
                  <option value="automatic" className="bg-slate-950">Automatic</option>
                  <option value="manual" className="bg-slate-950">Manual</option>
                  <option value="other" className="bg-slate-950">Other</option>
                </select>
                <label className="absolute left-0 -top-4 text-white/30 text-[10px] tracking-widest">
                  GEARBOX_SYSTEM
                </label>
              </div>
              <div className="cyber-input-group relative group">
                <select
                  className="w-full bg-transparent border-b border-white/20 py-4 text-white focus:outline-none focus:border-cyan-500 transition-all appearance-none"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="sedan" className="bg-slate-950">Sedan</option>
                  <option value="suv" className="bg-slate-950">SUV</option>
                  <option value="pickup" className="bg-slate-950">Pickup</option>
                  <option value="truck" className="bg-slate-950">Truck</option>
                  <option value="coupe" className="bg-slate-950">Coupe</option>
                  <option value="hatchback" className="bg-slate-950">Hatchback</option>
                  <option value="mini-van" className="bg-slate-950">Mini-van</option>
                  <option value="convertible" className="bg-slate-950">Convertible</option>
                  <option value="van" className="bg-slate-950">Van</option>
                  <option value="wagon" className="bg-slate-950">Wagon</option>
                  <option value="offroad" className="bg-slate-950">Offroad</option>
                  <option value="bus" className="bg-slate-950">Bus</option>
                  <option value="other" className="bg-slate-950">Other</option>
                </select>
                <label className="absolute left-0 -top-4 text-white/30 text-[10px] tracking-widest">
                  CHASSIS_GEOMETRY
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="cyber-input-group relative group">
                <select
                  className="w-full bg-transparent border-b border-white/20 py-4 text-white focus:outline-none focus:border-cyan-500 transition-all appearance-none"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                >
                  <option value="sub-compact" className="bg-slate-950">Sub-Compact</option>
                  <option value="compact" className="bg-slate-950">Compact</option>
                  <option value="mid-size" className="bg-slate-950">Mid-Size</option>
                  <option value="full-size" className="bg-slate-950">Full-Size</option>
                </select>
                <label className="absolute left-0 -top-4 text-white/30 text-[10px] tracking-widest">
                  DIMENSION_SCALE
                </label>
              </div>
              <div className="cyber-input-group relative group">
                <select
                  className="w-full bg-transparent border-b border-white/20 py-4 text-white focus:outline-none focus:border-purple-500 transition-all appearance-none"
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                >
                  <option value="salvage" className="bg-slate-950">Salvage</option>
                  <option value="fair" className="bg-slate-950">Fair</option>
                  <option value="good" className="bg-slate-950">Good</option>
                  <option value="excellent" className="bg-slate-950">Excellent</option>
                  <option value="like new" className="bg-slate-950">Like New</option>
                  <option value="new" className="bg-slate-950">New</option>
                </select>
                <label className="absolute left-0 -top-4 text-white/30 text-[10px] tracking-widest">
                  INTEGRITY_INDEX
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="cyber-input-group relative group">
                <select
                  className="w-full bg-transparent border-b border-white/20 py-4 text-white focus:outline-none focus:border-purple-500 transition-all appearance-none"
                  value={formData.titleStatus}
                  onChange={(e) => setFormData({ ...formData, titleStatus: e.target.value })}
                >
                  <option value="clean" className="bg-slate-950">Clean</option>
                  <option value="rebuilt" className="bg-slate-950">Rebuilt</option>
                  <option value="salvage" className="bg-slate-950">Salvage</option>
                  <option value="lien" className="bg-slate-950">Lien</option>
                  <option value="missing" className="bg-slate-950">Missing</option>
                  <option value="parts only" className="bg-slate-950">Parts Only</option>
                </select>
                <label className="absolute left-0 -top-4 text-white/30 text-[10px] tracking-widest">
                  REGISTRATION_HEX
                </label>
              </div>
              <div className="cyber-input-group relative">
                <div className="flex gap-2 mt-2">
                  {['fwd', 'rwd', '4wd'].map((drive) => (
                    <label key={drive} className="cursor-pointer flex-1">
                      <input
                        type="radio"
                        name="drive"
                        className="peer sr-only"
                        checked={formData.drive === drive}
                        onChange={() => setFormData({ ...formData, drive })}
                      />
                      <div className="py-2 text-center rounded border border-white/10 text-[10px] tracking-wider text-white/40 peer-checked:border-cyan-500 peer-checked:text-cyan-400 peer-checked:bg-cyan-950/20 uppercase font-mono font-bold transition-all">
                        {drive}
                      </div>
                    </label>
                  ))}
                </div>
                <label className="absolute left-0 -top-4 text-white/30 text-[10px] tracking-widest">
                  DRIVE_ACTUATION
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full relative group/btn py-6 border border-cyan-500/50 hover:border-cyan-400 transition-colors overflow-hidden"
              disabled={loading}
            >
              <div className="absolute inset-0 bg-cyan-500/10 -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500"></div>
              <span className="relative z-10 text-cyan-400 font-black tracking-[0.3em] uppercase text-sm italic group-hover/btn:text-white transition-colors">
                {loading ? 'ANALYZING_DATA...' : 'EXECUTE_PREDICTION'}
              </span>
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-500"></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-500"></div>
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT: Results / Visuals */}
      <div className="lg:col-span-6 relative flex flex-col justify-center min-h-[350px] md:min-h-[500px] w-full">
        {loading && (
          <div className="w-full px-6 md:px-12 text-center">
            <div className="mb-8">
              <div className="text-[8px] md:text-[10px] font-mono text-cyan-400 mb-2 animate-pulse tracking-widest uppercase">Evaluating_Random_Forest_Ensemble...</div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div ref={progressRef} className="h-full w-0 bg-cyan-500 shadow-[0_0_15px_#06b6d4]"></div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {Array.from({length: 12}).map((_, i) => (
                <div key={i} className="h-1 bg-white/5 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}></div>
              ))}
            </div>
          </div>
        )}

        {!loading && !result && (
          <div className="relative w-full aspect-video border border-white/5 flex items-center justify-center group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#06b6d415_0%,transparent_70%)]"></div>
            <div className="text-white/5 font-black text-9xl italic tracking-tighter select-none group-hover:scale-110 transition-transform duration-1000">
              ACTROID
            </div>
            <div className="absolute top-0 left-0 p-4">
              <div className="w-4 h-4 border-t border-l border-white/20"></div>
            </div>
            <div className="absolute bottom-0 right-0 p-4">
              <div className="w-4 h-4 border-b border-r border-white/20"></div>
            </div>
            <p className="absolute bottom-10 text-[8px] font-mono text-white/20 tracking-[1em] uppercase">System_Standby</p>
          </div>
        )}

        {!loading && result && (
          <div className="w-full space-y-8" ref={resultRef}>
            <div className="relative group overflow-hidden rounded-sm border border-white/10">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
              <img src={result.imageUrl} className="w-full h-80 object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" alt="Result" />
              
              {/* Scanline Animation */}
              <div className="absolute inset-0 pointer-events-none z-20">
                <div className="w-full h-[2px] bg-cyan-500/50 shadow-[0_0_10px_#06b6d4] animate-scanline"></div>
              </div>

              <div className="absolute bottom-6 left-6 z-20">
                <span className="text-[10px] font-mono text-cyan-400 block mb-1">DATA_MATCH_FOUND</span>
                <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">{result.brand}</h3>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-8 backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] text-white/40 uppercase tracking-[0.4em] mb-4">Neural_Predicted_Value</p>
                  <h3 className="text-5xl md:text-7xl font-black text-white tracking-tighter italic flex items-start gap-2">
                    <span className="text-xl md:text-3xl text-cyan-500 mt-1 md:mt-2">$</span>
                    {Math.round(result.price).toLocaleString()}
                  </h3>
                </div>
                <div className="text-right space-y-2 md:space-y-4">
                  <div>
                    <div className="text-[8px] md:text-[10px] text-white/40 uppercase mb-1">R² Accuracy</div>
                    <div className="text-cyan-400 font-mono text-lg md:text-xl font-bold">69.1%</div>
                  </div>
                  <div>
                    <div className="text-[8px] md:text-[10px] text-white/40 uppercase mb-1">Est_Depreciation</div>
                    <div className="text-red-500 font-mono text-sm md:text-base">-${result.deprecation}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
