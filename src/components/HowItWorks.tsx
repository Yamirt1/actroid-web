import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface SampleVehicle {
  name: string;
  marca: string;
  modelo: string;
  year: number;
  mileage: number;
  fuel: string;
  brandTE: number;
  modelTE: number;
  treeVotes: number[];
  finalPrice: number;
}

const SAMPLES: SampleVehicle[] = [
  {
    name: 'Ford Mustang 2018',
    marca: 'Ford',
    modelo: 'Mustang',
    year: 2018,
    mileage: 45000,
    fuel: 'Gas',
    brandTE: 16800.5,
    modelTE: 24500.2,
    treeVotes: [23800, 25200, 24100],
    finalPrice: 24366
  },
  {
    name: 'Toyota Corolla 2020',
    marca: 'Toyota',
    modelo: 'Corolla',
    year: 2020,
    mileage: 30000,
    fuel: 'Gas',
    brandTE: 14200.8,
    modelTE: 17800.4,
    treeVotes: [18100, 17200, 17900],
    finalPrice: 17733
  },
  {
    name: 'Tesla Model 3 2022',
    marca: 'Tesla',
    modelo: 'Model 3',
    year: 2022,
    mileage: 15000,
    fuel: 'Electric',
    brandTE: 32000.1,
    modelTE: 35100.9,
    treeVotes: [36200, 34800, 35500],
    finalPrice: 35500
  }
];

export default function HowItWorks() {
  const [selectedSampleIndex, setSelectedSampleIndex] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const playIntervalRef = useRef<any>(null);

  const [customVehicle, setCustomVehicle] = useState<SampleVehicle | null>(null);
  const samplesList = customVehicle ? [...SAMPLES, customVehicle] : SAMPLES;
  const vehicle = samplesList[selectedSampleIndex] || SAMPLES[0];
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePrediction = (e: Event) => {
      const customEvent = e as CustomEvent<SampleVehicle>;
      if (customEvent.detail) {
        setCustomVehicle(customEvent.detail);
        setSelectedSampleIndex(SAMPLES.length); // index 3
        setActiveStep(0);
        setIsPlaying(false);
      }
    };
    window.addEventListener('car-prediction-made', handlePrediction);
    return () => {
      window.removeEventListener('car-prediction-made', handlePrediction);
    };
  }, []);

  const steps = [
    { title: '1. Entrada de Datos', desc: 'Captura y serialización de parámetros crudos del vehículo.' },
    { title: '2. Target Encoding', desc: 'Búsqueda en base de datos para mapear textos a promedios históricos.' },
    { title: '3. Vector de Características', desc: 'Alineación de datos en una matriz numérica unidimensional.' },
    { title: '4. Bosque Aleatorio', desc: 'Evaluación paralela a través de múltiples árboles de decisión.' },
    { title: '5. Promedio de Ensamble', desc: 'Combinación y promedio de estimadores para el veredicto final.' }
  ];

  // Code lines structure
  const codeLines = [
    { num: 1, text: 'import joblib', step: -1 },
    { num: 2, text: 'model_data = joblib.load("rf_model.joblib")', step: -1 },
    { num: 3, text: '# 1. Obtener entradas del usuario', step: 0 },
    { num: 4, text: `raw_input = {"marca": "${vehicle.marca}", "modelo": "${vehicle.modelo}", "year": ${vehicle.year}, "mileage": ${vehicle.mileage}}`, step: 0 },
    { num: 5, text: '# 2. Buscar codificación promedio (Target Encoding)', step: 1 },
    { num: 6, text: `brand_te = manufacturer_to_TE.get(raw_input["marca"], 15400.0)  # -> ${vehicle.brandTE}`, step: 1 },
    { num: 7, text: `model_te = model_to_TE.get(raw_input["modelo"], 18200.0)       # -> ${vehicle.modelTE}`, step: 1 },
    { num: 8, text: '# 3. Ensamblar array de características (X Input)', step: 2 },
    { num: 9, text: `x_vector = [raw_input["mileage"], raw_input["year"], brand_te, model_te, ...]`, step: 2 },
    { num: 10, text: '# 4. Evaluar árboles del Bosque Aleatorio', step: 3 },
    { num: 11, text: `votes = [tree.predict([x_vector]) for tree in model_data["model"].estimators_]`, step: 3 },
    { num: 12, text: '# 5. Calcular el promedio para el precio final', step: 4 },
    { num: 13, text: `final_price = sum(votes) / len(votes)                         # -> $${vehicle.finalPrice.toLocaleString()}`, step: 4 }
  ];

  // Auto-play steps
  useEffect(() => {
    if (isPlaying) {
      playIntervalRef.current = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % steps.length);
      }, 4500);
    } else {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    }
    return () => {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    };
  }, [isPlaying]);

  // Animate step change in viewport
  useEffect(() => {
    if (previewRef.current) {
      gsap.fromTo(previewRef.current, 
        { opacity: 0, scale: 0.98 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, [activeStep, selectedSampleIndex]);

  return (
    <div className="max-w-4xl mx-auto glass-card rounded-3xl p-6 md:p-8 border border-slate-800 shadow-2xl relative bg-[#040813]/60 backdrop-blur-md overflow-hidden select-none">
      
      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.02)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none z-0"></div>

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-850 pb-6 mb-8 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-white font-display tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
            Simulador de Ejecución ML
          </h2>
          <p className="text-slate-400 text-xs md:text-sm mt-1">Mira el paso a paso del código y del flujo de datos en tiempo real.</p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            {samplesList.map((s, idx) => (
              <button
                key={s.name}
                type="button"
                onClick={() => { setSelectedSampleIndex(idx); setActiveStep(0); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all uppercase ${
                  selectedSampleIndex === idx
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {s.name === 'Tu Consulta' ? 'Tu Consulta' : s.marca}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-2 rounded-xl border transition-all ${
              isPlaying
                ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20'
                : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20'
            }`}
            title={isPlaying ? "Pausar" : "Simular código"}
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            )}
          </button>
        </div>
      </div>

      {/* Stepper progress */}
      <div className="relative z-10 flex gap-2 mb-6">
        {steps.map((step, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => { setActiveStep(idx); setIsPlaying(false); }}
            className="flex-1 text-left focus:outline-none"
          >
            <div className={`h-1.5 rounded-full transition-all duration-500 ${
              activeStep === idx 
                ? 'bg-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.7)]' 
                : activeStep > idx 
                  ? 'bg-slate-700' 
                  : 'bg-slate-900'
            }`}></div>
            <span className={`block text-[9px] font-bold uppercase tracking-widest mt-2 transition-colors ${
              activeStep === idx ? 'text-cyan-400 font-extrabold' : 'text-slate-500'
            }`}>
              PASO 0{idx + 1}
            </span>
          </button>
        ))}
      </div>

      {/* Simulated Window: 1. LIVE PREVIEW */}
      <div className="relative z-10 border border-slate-800 bg-[#02050c]/85 rounded-2xl p-6 mb-6 shadow-inner overflow-hidden min-h-[220px]" ref={previewRef}>
        
        {/* Red blinking live preview indicator */}
        <div className="absolute top-4 left-4 flex items-center gap-1.5 select-none">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="text-[9px] font-mono text-red-500 uppercase tracking-widest font-black">LIVE PREVIEW</span>
        </div>

        <div className="absolute top-4 right-4 text-[9px] font-mono text-slate-600">
          STEP {activeStep + 1} / 5
        </div>

        <div className="flex flex-col items-center justify-center h-full pt-8 pb-2">
          
          {/* STEP 1 PREVIEW: INPUT PARAMETERS */}
          {activeStep === 0 && (
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full">
              {/* 3D-Like Cylinder Database Node */}
              <div className="flex flex-col items-center">
                <div className="relative w-16 h-20 bg-slate-900/90 rounded-2xl border-2 border-cyan-500 flex flex-col items-center justify-between p-2 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                  <div className="w-14 h-4 bg-cyan-950 border border-cyan-500/50 rounded-full flex items-center justify-center">
                    <span className="text-[7px] font-mono text-cyan-400 font-black">API_IN</span>
                  </div>
                  <div className="w-12 h-6 border-b border-t border-dashed border-slate-800 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" className="text-cyan-400 animate-bounce"><path d="M12 2v20"/><path d="m19 15-7 7-7-7"/></svg>
                  </div>
                  <span className="text-[8px] font-mono text-slate-500 uppercase tracking-wider">REQUEST</span>
                </div>
              </div>

              {/* Glowing parameters sheet */}
              <div className="border border-cyan-500/30 bg-cyan-950/10 p-4 rounded-xl max-w-sm w-full relative shadow-[0_0_20px_rgba(6,182,212,0.05)] border-dashed">
                <div className="absolute -top-2.5 left-4 bg-slate-950 px-2 text-[9px] font-mono text-cyan-400">VEHICLE_DATA</div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
                  <div><span className="text-slate-500">Marca:</span> <strong className="text-white capitalize">{vehicle.marca}</strong></div>
                  <div><span className="text-slate-500">Modelo:</span> <strong className="text-white capitalize">{vehicle.modelo}</strong></div>
                  <div><span className="text-slate-500">Año:</span> <strong className="text-white">{vehicle.year}</strong></div>
                  <div><span className="text-slate-500">Millaje:</span> <strong className="text-white">{vehicle.mileage.toLocaleString()} mi</strong></div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 PREVIEW: TARGET ENCODING */}
          {activeStep === 1 && (
            <div className="w-full max-w-xl">
              <span className="text-[9px] font-mono text-slate-500 block mb-2 text-center uppercase tracking-widest">TABLE: TARGET_ENCODINGS</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Brand map card */}
                <div className="border border-cyan-500/30 bg-cyan-950/10 p-3.5 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.05)] flex flex-col justify-between relative overflow-hidden group">
                  <div className="absolute top-0 right-0 bg-cyan-500/10 text-cyan-400 text-[8px] font-mono px-2 py-0.5 border-b border-l border-cyan-500/20">MANUFACTURERS</div>
                  <span className="text-[8px] font-mono text-slate-500 uppercase">Clave ➔ Valor TE</span>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">{vehicle.marca}</span>
                    <span className="text-cyan-400 font-bold font-mono">➔</span>
                    <span className="font-mono text-xs font-black text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded shadow-[0_0_8px_rgba(6,182,212,0.2)]">
                      ${vehicle.brandTE.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Model map card */}
                <div className="border border-indigo-500/30 bg-indigo-950/10 p-3.5 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.05)] flex flex-col justify-between relative overflow-hidden group">
                  <div className="absolute top-0 right-0 bg-indigo-500/10 text-indigo-400 text-[8px] font-mono px-2 py-0.5 border-b border-l border-indigo-500/20">MODELS</div>
                  <span className="text-[8px] font-mono text-slate-500 uppercase">Clave ➔ Valor TE</span>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">{vehicle.modelo}</span>
                    <span className="text-indigo-400 font-bold font-mono">➔</span>
                    <span className="font-mono text-xs font-black text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded shadow-[0_0_8px_rgba(99,102,241,0.2)]">
                      ${vehicle.modelTE.toLocaleString()}
                    </span>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* STEP 3 PREVIEW: FEATURE VECTOR */}
          {activeStep === 2 && (
            <div className="w-full max-w-2xl text-center space-y-4">
              <span className="text-[9px] font-mono text-slate-500 block uppercase tracking-widest">ARRAY_BUILDER: INPUT_VECTOR_X</span>
              
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2 font-mono text-[11px]">
                {[
                  { name: 'Odometer', val: vehicle.mileage, type: 'int' },
                  { name: 'Year', val: vehicle.year, type: 'int' },
                  { name: 'Brand_TE', val: Math.round(vehicle.brandTE), type: 'float' },
                  { name: 'Model_TE', val: Math.round(vehicle.modelTE), type: 'float' },
                  { name: 'Fuel_Gas', val: vehicle.fuel === 'Gas' ? 1 : 0, type: 'bin' },
                  { name: 'Fuel_Elec', val: vehicle.fuel === 'Electric' ? 1 : 0, type: 'bin' }
                ].map((item, idx) => (
                  <div key={idx} className="border border-cyan-500/40 bg-cyan-950/20 p-2.5 rounded-lg flex flex-col justify-between shadow-[0_0_10px_rgba(6,182,212,0.1)] border-dashed">
                    <span className="text-[7.5px] text-slate-500 uppercase tracking-wider font-sans font-black truncate">{item.name}</span>
                    <span className="font-bold text-white text-xs mt-1">{item.val.toLocaleString()}</span>
                    <span className="text-[7px] text-cyan-400/50 mt-1 font-sans font-bold uppercase">{item.type}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4 PREVIEW: RANDOM FOREST */}
          {activeStep === 3 && (
            <div className="w-full max-w-xl space-y-3">
              <span className="text-[9px] font-mono text-slate-500 block text-center uppercase tracking-widest">ENSEMBLE: DECISION_PATHWAYS</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {vehicle.treeVotes.map((vote, idx) => (
                  <div key={idx} className="border border-cyan-500/20 bg-cyan-950/5 p-4 rounded-xl flex flex-col justify-between text-center relative shadow-[0_0_15px_rgba(6,182,212,0.03)]">
                    <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block mb-2">TREE_ESTIMATOR_0{idx + 1}</span>
                    
                    {/* SVG Branch Tree graphic */}
                    <div className="flex flex-col items-center justify-center gap-1.5 py-1">
                      <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_#06b6d4]"></div>
                      <div className="w-[1.5px] h-3 bg-cyan-500/50"></div>
                      <div className="flex justify-center gap-4 w-full">
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_4px_#06b6d4]"></div>
                          <span className="text-[7px] font-mono text-cyan-400 font-bold uppercase">TRUE</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 opacity-20">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
                          <span className="text-[7px] font-mono text-slate-600 font-bold uppercase">FALSE</span>
                        </div>
                      </div>
                    </div>

                    <div className="font-mono text-xs font-black text-cyan-400 mt-2 bg-cyan-950/30 border border-cyan-500/20 py-1 rounded shadow-inner">
                      Est: ${vote.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5 PREVIEW: ENSEMBLE AVERAGE & RESULT */}
          {activeStep === 4 && (
            <div className="w-full max-w-md text-center space-y-4">
              <div className="space-y-1">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">AVERAGE_CALCULATION</span>
                <div className="inline-flex items-center gap-2 text-[10px] md:text-xs font-mono text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                  <span>({vehicle.treeVotes.map(v => `$${v.toLocaleString()}`).join(' + ')})</span>
                  <span>/ 3</span>
                </div>
              </div>

              <div className="pt-2 animate-float">
                <span className="text-[8px] font-mono text-cyan-400 uppercase tracking-[0.25em] block mb-1">FINAL_PREDICTED_VALUE</span>
                <h4 className="text-4xl md:text-5xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(6,182,212,0.45)]">
                  ${vehicle.finalPrice.toLocaleString('en-US')}
                </h4>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Simulated Window: 2. CODE EDITOR ("predict_price.py") */}
      <div className="relative z-10 border border-slate-850 bg-[#030610] rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        
        {/* Editor Topbar */}
        <div className="bg-[#050b16] px-4 py-3 border-b border-slate-850 flex justify-between items-center select-none">
          <div className="flex gap-2 items-center">
            {/* Mac-like colored windows buttons */}
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
            </div>
            
            {/* Code tab name */}
            <span className="text-[11px] font-mono text-slate-400 pl-4 flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" className="text-yellow-500"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              predict_price.py
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-600 font-bold uppercase tracking-widest">PYTHON_DDL</span>
        </div>

        {/* Code Area */}
        <div className="p-4 overflow-x-auto font-mono text-xs md:text-sm leading-relaxed text-slate-400 bg-[#02050c]/80 min-h-[220px]">
          {codeLines.map((line) => {
            const isHighlighted = line.step === activeStep;
            return (
              <div 
                key={line.num} 
                className={`flex w-full items-stretch transition-all duration-300 ${
                  isHighlighted 
                    ? 'bg-cyan-950/40 text-white font-bold border-l-2 border-cyan-500 pl-1 shadow-[inset_4px_0_12px_rgba(6,182,212,0.1)]' 
                    : 'opacity-40 pl-1.5'
                }`}
              >
                {/* Line Number */}
                <span className="w-8 select-none text-slate-600 text-right pr-4 font-mono text-xs self-center">
                  {line.num}
                </span>
                
                {/* Code Content */}
                <span className="flex-1 whitespace-pre py-0.5">
                  {line.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
