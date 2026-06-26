import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { VEHICLE_DATA, getSpecs } from './vehicleData';

export default function CyberPredictor() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [formData, setFormData] = useState({
    marca: '',
    modelo: '',
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

    // Fetch prediction from FastAPI backend
    const fetchPromise = fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    }).then(res => {
      if (!res.ok) throw new Error("API error");
      return res.json();
    });

    const delayPromise = new Promise(resolve => setTimeout(resolve, 2000));

    Promise.all([fetchPromise, delayPromise])
      .then(([apiResult]) => {
        const keyword = `${formData.marca} ${formData.modelo}`.trim().toLowerCase().replace(/\s+/g, ',');
        const imageUrl = `https://loremflickr.com/800/600/${keyword || 'futuristic,car'},car?random=${Math.random()}`;

        setResult({
          price: apiResult.price,
          deprecation: apiResult.deprecation,
          imageUrl: imageUrl,
          brand: `${formData.marca} ${formData.modelo}`.trim().toUpperCase() || 'CORE_SYSTEM'
        });
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch prediction from API, falling back to basic calculation", err);
        // Fallback calculation so that the app doesn't break if API is offline
        const fallbackPrice = 15000 + (formData.year - 2010) * 1000 - (formData.mileage * 0.05);
        const keyword = `${formData.marca} ${formData.modelo}`.trim().toLowerCase().replace(/\s+/g, ',');
        const imageUrl = `https://loremflickr.com/800/600/${keyword || 'futuristic,car'},car?random=${Math.random()}`;
        
        setResult({
          price: fallbackPrice < 500 ? 500 : fallbackPrice,
          deprecation: Math.floor(formData.mileage * 0.05),
          imageUrl: imageUrl,
          brand: `${formData.marca} ${formData.modelo}`.trim().toUpperCase() || 'CORE_SYSTEM'
        });
        setLoading(false);
      });
  };

  const specs = getSpecs(formData.marca, formData.modelo);
  const models = formData.marca ? Object.keys(VEHICLE_DATA[formData.marca.toLowerCase()] || {}) : [];
  const isFormLocked = !formData.marca || !formData.modelo;

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
                className="w-full bg-transparent border-b border-white/20 py-4 text-xl text-white font-light focus:outline-none focus:border-cyan-500 appearance-none capitalize animate-pulse-slow"
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

            <div className="cyber-input-group relative group">
              <select
                className="w-full bg-transparent border-b border-white/20 py-4 text-xl text-white font-light focus:outline-none focus:border-cyan-500 disabled:opacity-30 disabled:cursor-not-allowed appearance-none capitalize"
                value={formData.modelo}
                onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                disabled={!formData.marca}
                required
              >
                <option value="" className="bg-slate-950">
                  {!formData.marca ? '[ SELECT BRAND FIRST ]' : '[ SELECT MODEL ]'}
                </option>
                {models.map((m) => (
                  <option key={m} value={m} className="capitalize bg-slate-950">{m}</option>
                ))}
              </select>
              <label className="absolute left-0 -top-4 text-white/30 text-[10px] tracking-widest">
                [ VEHICLE_MODEL ]
              </label>
              <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-cyan-500 group-hover:w-full transition-all duration-500"></div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="cyber-input-group relative group">
                <select
                  className="w-full bg-transparent border-b border-white/20 py-4 text-white focus:outline-none focus:border-purple-500 disabled:opacity-30 disabled:cursor-not-allowed appearance-none"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || 2024 })}
                  disabled={isFormLocked}
                  required
                >
                  {specs.years.map((y) => (
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
                  className="w-full bg-transparent border-b border-white/20 py-4 text-white focus:outline-none focus:border-cyan-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all peer placeholder:opacity-0"
                  value={formData.mileage}
                  onChange={(e) => setFormData({ ...formData, mileage: parseInt(e.target.value) || 0 })}
                  disabled={isFormLocked}
                  placeholder="KILOMETER_COUNT"
                  required
                />
                <label className="absolute left-0 top-4 text-white/30 text-[10px] tracking-widest transition-all peer-focus:-top-4 peer-focus:text-cyan-400 peer-[&:not(:placeholder-shown)]:-top-4">
                  {isFormLocked ? 'KILOMETER_COUNT [LOCKED]' : 'KILOMETER_COUNT'}
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="cyber-input-group relative group">
                <select
                  className="w-full bg-transparent border-b border-white/20 py-4 text-white focus:outline-none focus:border-cyan-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all appearance-none"
                  value={formData.cylinders}
                  onChange={(e) => setFormData({ ...formData, cylinders: parseInt(e.target.value) })}
                  disabled={isFormLocked}
                >
                  {[3, 4, 5, 6, 8, 10, 12].map((cyl) => {
                    const isAvailable = specs.cylinders.includes(cyl);
                    if (!isAvailable) return null;
                    return (
                      <option key={cyl} value={cyl} className="bg-slate-950">{cyl} Cylinders</option>
                    );
                  })}
                </select>
                <label className="absolute left-0 -top-4 text-white/30 text-[10px] tracking-widest">
                  CYLINDER_ACTUATORS
                </label>
              </div>
              <div className="cyber-input-group relative group">
                <select
                  className="w-full bg-transparent border-b border-white/20 py-4 text-white focus:outline-none focus:border-purple-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all appearance-none"
                  value={formData.fuel}
                  onChange={(e) => setFormData({ ...formData, fuel: e.target.value })}
                  disabled={isFormLocked}
                >
                  {[
                    { val: 'gas', label: 'Gasoline' },
                    { val: 'diesel', label: 'Diesel' },
                    { val: 'hybrid', label: 'Hybrid' },
                    { val: 'electric', label: 'Electric' }
                  ].map((f) => {
                    const isAvailable = specs.fuels.includes(f.val);
                    if (!isAvailable) return null;
                    return (
                      <option key={f.val} value={f.val} className="bg-slate-950">{f.label}</option>
                    );
                  })}
                </select>
                <label className="absolute left-0 -top-4 text-white/30 text-[10px] tracking-widest">
                  ENERGY_SOURCE
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="cyber-input-group relative group">
                <select
                  className="w-full bg-transparent border-b border-white/20 py-4 text-white focus:outline-none focus:border-purple-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all appearance-none"
                  value={formData.transmission}
                  onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                  disabled={isFormLocked}
                >
                  {[
                    { val: 'automatic', label: 'Automatic' },
                    { val: 'manual', label: 'Manual' },
                    { val: 'other', label: 'Other' }
                  ].map((t) => {
                    const isAvailable = specs.transmissions.includes(t.val);
                    if (!isAvailable) return null;
                    return (
                      <option key={t.val} value={t.val} className="bg-slate-950">{t.label}</option>
                    );
                  })}
                </select>
                <label className="absolute left-0 -top-4 text-white/30 text-[10px] tracking-widest">
                  GEARBOX_SYSTEM
                </label>
              </div>
              <div className="cyber-input-group relative group">
                <select
                  className="w-full bg-transparent border-b border-white/20 py-4 text-white focus:outline-none focus:border-cyan-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all appearance-none capitalize"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  disabled={isFormLocked}
                >
                  {[
                    { val: 'sedan', label: 'Sedan' },
                    { val: 'suv', label: 'SUV' },
                    { val: 'pickup', label: 'Pickup' },
                    { val: 'truck', label: 'Truck' },
                    { val: 'coupe', label: 'Coupe' },
                    { val: 'hatchback', label: 'Hatchback' },
                    { val: 'mini-van', label: 'Mini-van' },
                    { val: 'convertible', label: 'Convertible' },
                    { val: 'van', label: 'Van' },
                    { val: 'wagon', label: 'Wagon' },
                    { val: 'offroad', label: 'Offroad' },
                    { val: 'bus', label: 'Bus' },
                    { val: 'other', label: 'Other' }
                  ].map((t) => {
                    const isAvailable = specs.types.includes(t.val);
                    if (!isAvailable) return null;
                    return (
                      <option key={t.val} value={t.val} className="bg-slate-950">{t.label}</option>
                    );
                  })}
                </select>
                <label className="absolute left-0 -top-4 text-white/30 text-[10px] tracking-widest">
                  CHASSIS_GEOMETRY
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="cyber-input-group relative group">
                <select
                  className="w-full bg-transparent border-b border-white/20 py-4 text-white focus:outline-none focus:border-cyan-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all appearance-none"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  disabled={isFormLocked}
                >
                  {[
                    { val: 'sub-compact', label: 'Sub-Compact' },
                    { val: 'compact', label: 'Compact' },
                    { val: 'mid-size', label: 'Mid-Size' },
                    { val: 'full-size', label: 'Full-Size' }
                  ].map((s) => {
                    const isAvailable = specs.sizes.includes(s.val);
                    if (!isAvailable) return null;
                    return (
                      <option key={s.val} value={s.val} className="bg-slate-950">{s.label}</option>
                    );
                  })}
                </select>
                <label className="absolute left-0 -top-4 text-white/30 text-[10px] tracking-widest">
                  DIMENSION_SCALE
                </label>
              </div>
              <div className="cyber-input-group relative group">
                <select
                  className="w-full bg-transparent border-b border-white/20 py-4 text-white focus:outline-none focus:border-purple-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all appearance-none"
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                  disabled={isFormLocked}
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
                  className="w-full bg-transparent border-b border-white/20 py-4 text-white focus:outline-none focus:border-purple-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all appearance-none"
                  value={formData.titleStatus}
                  onChange={(e) => setFormData({ ...formData, titleStatus: e.target.value })}
                  disabled={isFormLocked}
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
                  {['fwd', 'rwd', '4wd'].map((drive) => {
                    const isAvailable = specs.drives.includes(drive);
                    const isDriveChecked = formData.drive === drive;
                    return (
                      <label key={drive} className={`cursor-pointer flex-1 ${(!isAvailable || isFormLocked) ? 'opacity-30 cursor-not-allowed' : ''}`}>
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
                        <div className="py-2 text-center rounded border border-white/10 text-[10px] tracking-wider text-white/40 peer-checked:border-cyan-500 peer-checked:text-cyan-400 peer-checked:bg-cyan-950/20 uppercase font-mono font-bold transition-all">
                          {drive}
                        </div>
                      </label>
                    );
                  })}
                </div>
                <label className="absolute left-0 -top-4 text-white/30 text-[10px] tracking-widest">
                  DRIVE_ACTUATION
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full relative group/btn py-6 border border-cyan-500/50 disabled:border-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:border-cyan-400 transition-colors overflow-hidden"
              disabled={loading || isFormLocked}
            >
              <div className="absolute inset-0 bg-cyan-500/10 -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500"></div>
              <span className="relative z-10 text-cyan-400 disabled:text-slate-600 font-black tracking-[0.3em] uppercase text-sm italic group-hover/btn:text-white transition-colors">
                {loading ? 'ANALYZING_DATA...' : isFormLocked ? 'SYSTEM_LOCKED' : 'EXECUTE_PREDICTION'}
              </span>
              {/* Corner Accents */}
              {!isFormLocked && (
                <>
                  <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-500"></div>
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-500"></div>
                </>
              )}
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
                    <div className="text-cyan-400 font-mono text-lg md:text-xl font-bold">95.6%</div>
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
