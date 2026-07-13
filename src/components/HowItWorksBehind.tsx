import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface Step {
  title: string;
  desc: string;
}

const STEPS: Step[] = [
  { title: '1. Recolección UI', desc: 'El usuario ajusta los selectores y el estado formData se actualiza reactivamente.' },
  { title: '2. Orquestación', desc: 'Se dispara handlePredict() y se inicia el Camino A. Si falla, cae al Camino B.' },
  { title: '3. Procesamiento ML', desc: 'El modelo procesa la entrada (remotamente en Python o localmente en JS).' },
  { title: '4. Renderizado UI', desc: 'El precio se inyecta en la vista, se anima el auto y se escriben los logs en consola.' }
];

export default function HowItWorksBehind() {
  const [activePath, setActivePath] = useState<'API' | 'LOCAL'>('API');
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const playIntervalRef = useRef<any>(null);
  const flowRef = useRef<HTMLDivElement>(null);

  // Auto-play simulation loop
  useEffect(() => {
    if (isPlaying) {
      playIntervalRef.current = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % STEPS.length);
      }, 5000);
    } else {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    }
    return () => {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    };
  }, [isPlaying]);

  // Animate diagram transition on step changes
  useEffect(() => {
    if (flowRef.current) {
      gsap.fromTo(flowRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, [activeStep, activePath]);

  // Code snippets depending on the path and current step
  const getCodeSnippet = () => {
    if (activePath === 'API') {
      switch (activeStep) {
        case 0:
          return `// 1. Recolección de datos en PredictorForm.tsx
const [formData, setFormData] = useState({
  marca: 'Toyota',
  modelo: 'Tacoma',
  year: 2018,
  mileage: 45000,
  fuel: 'gas',
  transmission: 'automatic',
  type: 'pickup',
  drive: '4wd',
  size: 'mid-size',
  condition: 'excellent',
  titleStatus: 'clean',
  cylinders: 6
});

// El formulario inyecta las selecciones directamente al estado padre.`;
        case 1:
          return `// 2. Disparo de la llamada HTTP en Predictor.tsx
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

const fetchPromise = fetch("https://actroid-web.onrender.com/predict", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(formData),
  signal: controller.signal,
});

// Se ejecutan en paralelo la llamada a la API y el spinner de carga (1.5s).`;
        case 2:
          return `# 3. api.py (FastAPI Server en Render)
@app.post("/predict")
def predict(data: VehicleInput):
    # El servidor recibe el JSON y lo codifica usando el pipeline de Python
    brand_te = manufacturer_to_TE.get(data.marca.lower(), 15400.0)
    model_te = model_to_TE.get(data.modelo.lower(), 18200.0)
    
    # Crea el vector de 29 características numéricas
    features = assemble_vector(data, brand_te, model_te)
    
    # Ejecuta el Random Forest cargado en memoria de Python (.joblib)
    price = rf_model.predict([features])[0]
    
    return {
        "price": float(price),
        "deprecation": calculate_deprecation(data),
        "brand_te": brand_te,
        "model_te": model_te
    }`;
        case 3:
          return `// 4. Inyección en UI y Disparo de Eventos en Predictor.tsx
setResult({
  price: apiResult.price,
  deprecation: apiResult.deprecation,
  make: encodeURIComponent(formData.marca.toLowerCase()),
  model: encodeURIComponent(formData.modelo.toLowerCase()),
  year: formData.year,
  brand: "Toyota Tacoma"
});

// Emite evento global para que HowItWorks actualice su simulador de árboles
window.dispatchEvent(new CustomEvent('car-prediction-made', {
  detail: { finalPrice: Math.round(apiResult.price), ... }
}));

setLoading(false);`;
        default:
          return '';
      }
    } else {
      switch (activeStep) {
        case 0:
          return `// 1. Recolección de datos en PredictorForm.tsx
const [formData, setFormData] = useState({
  marca: 'Toyota',
  modelo: 'Tacoma',
  year: 2018,
  mileage: 45000,
  fuel: 'gas',
  transmission: 'automatic',
  type: 'pickup',
  drive: '4wd',
  size: 'mid-size',
  condition: 'excellent',
  titleStatus: 'clean',
  cylinders: 6
});

// Mismo estado inicial de la UI que en el flujo online.`;
        case 1:
          return `// 2. Timeout o Fallo detectado. Activación del bloque catch
const fetchPromise = fetch("https://actroid-web.onrender.com/predict", { ... });

fetchPromise
  .then(...)
  .catch(err => {
    console.warn("API offline, using high-precision client-side Random Forest model");
    
    // Entra al fallback local
    runLocalRandomForestEngine(formData);
  });`;
        case 2:
          return `// 3. mlEngine.ts (Random Forest local en JavaScript)
// A) Calcula target encoding local
const brandTE = manufacturerToTE[formData.marca.toLowerCase()] || GLOBAL_BRAND_TE;
const modelTE = modelToTE[formData.modelo.toLowerCase()] || GLOBAL_MODEL_TE;

// B) Mapea inputs crudos al vector de 29 features numéricas
const features = rfModel.features.map(name => featureMap[name]);

// C) Recorre los árboles binarios del Random Forest local en JSON
const evaluation = predictForest(rfModel.trees, features); // -> $19,850
let finalPrice = evaluation.price;`;
        case 3:
          return `// 4. Inyección en UI y Carga de Logs en ApiInspector.tsx
setResult({ price: finalPrice, deprecation: localDeprec, ... });

// Escribe logs específicos detallando que se usó el Fallback Local
setApiConsoleData({
  method: 'POST (Offline Fallback)',
  url: 'Client-Side Random Forest Engine (React JS)',
  status: 'Executed Local Random Forest',
  request: formData,
  response: { price: finalPrice, brand_te: brandTE, model_te: modelTE },
  features: features
});

setLoading(false);`;
        default:
          return '';
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto glass-card rounded-3xl p-6 md:p-8 border border-slate-800 shadow-2xl relative bg-[#040813]/60 backdrop-blur-md overflow-hidden select-none">
      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.02)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none z-0"></div>

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-850 pb-6 mb-8 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-white font-display tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
            Flujo de Conexión y Arquitectura ML
          </h2>
          <p className="text-slate-400 text-xs md:text-sm mt-1">Explora cómo viajan tus especificaciones desde la UI hasta los modelos (remoto y local).</p>
        </div>

        {/* Path selectors & play controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => { setActivePath('API'); setActiveStep(0); }}
              className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold tracking-wider transition-all uppercase ${
                activePath === 'API'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Camino A: API Remota
            </button>
            <button
              type="button"
              onClick={() => { setActivePath('LOCAL'); setActiveStep(0); }}
              className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold tracking-wider transition-all uppercase ${
                activePath === 'LOCAL'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Camino B: Fallback Local
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-2.5 rounded-xl border transition-all ${
              isPlaying
                ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20'
                : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20'
            }`}
            title={isPlaying ? "Pausar" : "Simular flujo"}
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            )}
          </button>
        </div>
      </div>

      {/* Stepper Progress */}
      <div className="relative z-10 flex gap-2 mb-8">
        {STEPS.map((step, idx) => (
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
            <span className={`block text-[10px] font-medium mt-1 truncate ${
              activeStep === idx ? 'text-white' : 'text-slate-500'
            }`}>
              {step.title}
            </span>
          </button>
        ))}
      </div>

      {/* Main Workspace: Diagram vs Code */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left: Interactive Diagram Pipeline */}
        <div className="lg:col-span-6 border border-slate-800 bg-[#02050c]/85 rounded-2xl p-6 shadow-inner flex flex-col justify-between min-h-[360px]">
          
          <div className="flex justify-between items-center mb-6">
            <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest font-black flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
              DIAGRAMA DE FLUJO: PASO {activeStep + 1}
            </span>
            <span className="text-[9px] font-mono text-slate-500">
              {activePath === 'API' ? 'Servicio Web API' : 'JavaScript Engine'}
            </span>
          </div>

          <div ref={flowRef} className="flex-1 flex flex-col items-center justify-center p-4">
            
            {/* STEP 1: UI Recolección */}
            {activeStep === 0 && (
              <div className="space-y-6 w-full text-center">
                <div className="flex justify-around items-center max-w-sm mx-auto">
                  <div className="p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs font-semibold text-slate-300">
                    Marca & Modelo
                  </div>
                  <div className="text-cyan-400 font-bold">➔</div>
                  <div className="p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs font-semibold text-slate-300">
                    Año & Millas
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400 font-bold bg-cyan-500/10">
                  ↓
                </div>
                <div className="border border-cyan-500/40 bg-cyan-950/20 p-4 rounded-2xl max-w-sm mx-auto shadow-[0_0_20px_rgba(6,182,212,0.15)] relative">
                  <div className="absolute -top-2.5 left-4 bg-slate-950 px-2 text-[9px] font-mono text-cyan-400 font-bold">formData (React State)</div>
                  <pre className="text-[10px] text-slate-300 text-left font-mono">
                    {`{\n  marca: "Toyota",\n  modelo: "Tacoma",\n  year: 2018,\n  mileage: 45000\n}`}
                  </pre>
                </div>
              </div>
            )}

            {/* STEP 2: Orquestación */}
            {activeStep === 1 && (
              <div className="space-y-6 w-full text-center">
                <div className="border border-cyan-500/20 bg-slate-900/60 p-4.5 rounded-2xl max-w-xs mx-auto shadow-md">
                  <span className="block text-[8px] font-mono text-slate-500 uppercase mb-1">Iniciador</span>
                  <span className="text-xs font-black text-white font-mono">handlePredict()</span>
                </div>

                {activePath === 'API' ? (
                  <>
                    <div className="flex flex-col items-center">
                      <div className="h-6 w-0.5 bg-cyan-500/50"></div>
                      <span className="text-[8px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/20 uppercase tracking-widest my-1">
                        POST FETCH (Timeout 5s)
                      </span>
                      <div className="h-6 w-0.5 bg-cyan-500/50"></div>
                    </div>
                    <div className="border border-cyan-500 bg-cyan-950/30 p-4 rounded-2xl max-w-sm mx-auto shadow-[0_0_25px_rgba(6,182,212,0.2)] animate-pulse">
                      <span className="text-xs font-bold text-white block">Request HTTP enviada a:</span>
                      <span className="font-mono text-[10px] text-cyan-400 block mt-1">https://actroid-web.onrender.com/predict</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col items-center">
                      <div className="h-6 w-0.5 bg-red-500/50"></div>
                      <span className="text-[8px] font-mono text-red-400 bg-red-950/40 px-2 py-0.5 rounded border border-red-500/20 uppercase tracking-widest my-1">
                        API OFFLINE / TIMEOUT
                      </span>
                      <div className="h-6 w-0.5 bg-red-500/50"></div>
                    </div>
                    <div className="border border-yellow-500 bg-yellow-950/20 p-4 rounded-2xl max-w-sm mx-auto shadow-md">
                      <span className="text-xs font-bold text-yellow-400 block">Fallback Automático:</span>
                      <span className="text-[10px] text-slate-300 block mt-1">Se activa el cálculo local en JS. Sin llamadas de red.</span>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* STEP 3: Procesamiento ML */}
            {activeStep === 2 && (
              <div className="w-full text-center">
                {activePath === 'API' ? (
                  <div className="space-y-6">
                    {/* FastAPI cloud card */}
                    <div className="border border-cyan-500/30 bg-cyan-950/10 p-5 rounded-2xl max-w-md mx-auto relative shadow-lg">
                      <div className="absolute -top-3 right-4 bg-cyan-500 text-slate-950 font-mono text-[8px] font-bold px-2 py-0.5 rounded">FASTAPI SERVER</div>
                      <span className="block text-[8px] font-mono text-slate-500 uppercase text-left">PROCESO EN LA NUBE</span>
                      <div className="flex justify-between items-center mt-3 text-xs text-left">
                        <div>
                          <span className="block text-[10px] text-slate-400">1. Target Encoding</span>
                          <span className="font-mono text-slate-200">Tacoma ➔ $18,200.0</span>
                        </div>
                        <div className="text-cyan-500 font-bold font-mono">➔</div>
                        <div>
                          <span className="block text-[10px] text-slate-400">2. Random Forest</span>
                          <span className="font-mono text-slate-200">scikit-learn en Python</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-slate-500 font-mono text-[9px] uppercase tracking-widest animate-pulse">
                      Calculando sobre +250,000 registros...
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 max-w-md mx-auto">
                    {/* Target encoding local */}
                    <div className="grid grid-cols-2 gap-3 text-left">
                      <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                        <span className="text-[8px] font-mono text-slate-500 uppercase block">Codificación Local</span>
                        <span className="text-[10px] text-cyan-400 font-bold font-mono">Tacoma TE ➔ $18,200</span>
                      </div>
                      <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                        <span className="text-[8px] font-mono text-slate-500 uppercase block">Vector Armado</span>
                        <span className="text-[10px] text-slate-300 font-bold font-mono">[45000, 2018, 15400, ...]</span>
                      </div>
                    </div>

                    <div className="text-slate-400 font-mono text-xs">➔</div>

                    {/* Local RF walk */}
                    <div className="border border-yellow-500/30 bg-yellow-950/10 p-4 rounded-xl relative shadow-md">
                      <div className="absolute top-0 right-0 bg-yellow-500/10 text-yellow-400 text-[8px] font-mono px-2 py-0.5 border-b border-l border-yellow-500/20">rf_model.json</div>
                      <span className="text-[9px] font-mono text-slate-500 uppercase block text-left">predictForest() en navegador</span>
                      <span className="text-[11px] text-slate-300 block text-left mt-2 leading-relaxed">
                        Se recorren los nodos binarios del JSON local. El promedio de votos resulta en <strong className="text-yellow-400">$19,850.0</strong>.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 4: Renderizado de la UI */}
            {activeStep === 3 && (
              <div className="space-y-6 w-full text-center">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
                  <div className="border border-cyan-500/30 bg-cyan-950/15 p-4 rounded-xl text-left relative overflow-hidden flex flex-col justify-between">
                    <span className="text-[8.5px] font-mono text-slate-400 uppercase tracking-wider">CARVIEWER.TSX</span>
                    <h5 className="text-2xl font-black text-white mt-3 shadow-inner">$19,850</h5>
                    <span className="text-[8.5px] text-cyan-400 font-bold mt-2">Render Imagen 3D Rotable</span>
                  </div>

                  <div className="border border-slate-800 bg-[#030610] p-4 rounded-xl text-left flex flex-col justify-between">
                    <span className="text-[8.5px] font-mono text-slate-400 uppercase tracking-wider">APIINSPECTOR.TSX</span>
                    <div className="bg-black/50 p-1.5 rounded font-mono text-[7.5px] text-green-400 mt-2 overflow-x-auto select-all max-h-[50px]">
                      {`{"status": "200", "price": 19850}`}
                    </div>
                    <span className="text-[8.5px] text-slate-500 mt-2 font-bold uppercase">Logs Inyectados</span>
                  </div>
                </div>

                <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl max-w-xs mx-auto">
                  <span className="text-[9px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                    Evento: car-prediction-made
                  </span>
                </div>
              </div>
            )}

          </div>

          <div className="text-[10px] text-slate-500 text-center font-medium mt-4">
            {STEPS[activeStep].desc}
          </div>
        </div>

        {/* Right: Code Editor */}
        <div className="lg:col-span-6 border border-slate-850 bg-[#030610] rounded-2xl overflow-hidden shadow-2xl flex flex-col min-h-[360px]">
          {/* Editor Topbar */}
          <div className="bg-[#050b16] px-4 py-3 border-b border-slate-850 flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
              </div>
              <span className="text-[11px] font-mono text-slate-400 pl-4 flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" className="text-yellow-500"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                {activePath === 'API' && activeStep === 2 ? 'api.py' : activePath === 'LOCAL' && activeStep === 2 ? 'mlEngine.ts' : 'Predictor.tsx'}
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-600 font-bold uppercase tracking-widest">
              {activePath === 'API' && activeStep === 2 ? 'PYTHON' : 'TYPESCRIPT'}
            </span>
          </div>

          {/* Editor Code Area */}
          <div className="p-5 flex-1 overflow-x-auto font-mono text-xs leading-relaxed text-slate-400 bg-[#02050c]/80 select-text select-all">
            <pre className="text-[10.5px] text-slate-300 whitespace-pre">
              {getCodeSnippet()}
            </pre>
          </div>
        </div>

      </div>
    </div>
  );
}
