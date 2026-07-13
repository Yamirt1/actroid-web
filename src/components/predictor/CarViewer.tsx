import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface CarViewerProps {
  loading: boolean;
  result: any;
  demandInfo: {
    text: string;
    colorClass: string;
    bgClass: string;
  };
}

export default function CarViewer({ loading, result, demandInfo }: CarViewerProps) {
  const [currentAngle, setCurrentAngle] = useState(21);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startAngleRef = useRef(21);

  const resultRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

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

  // Animate progress bar when loading triggers
  useEffect(() => {
    if (loading && progressBarRef.current) {
      gsap.fromTo(progressBarRef.current,
        { width: '0%' },
        { width: '100%', duration: 1.5, ease: 'power1.inOut' }
      );
    }
  }, [loading]);

  // Animate result card when new result is loaded
  useEffect(() => {
    if (result && resultRef.current) {
      gsap.fromTo(resultRef.current,
        { opacity: 0, scale: 0.9, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'back.out(1.7)' }
      );
    }
  }, [result]);

  return (
    <>
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
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
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
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" className="text-slate-500 animate-pulse"><path d="M7 15h10M4 9h16M14 4h-4" /><circle cx="12" cy="12" r="10" /></svg>
                Haz clic y arrastra horizontalmente para rotar el carro 360°
              </div>

              {/* Selector de Ángulo de Cámara */}
              <div className="mt-4 flex justify-between items-center bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 backdrop-blur-md">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider pl-1 flex items-center gap-1.5 select-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" className="text-cyan-400"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
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
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all ${currentAngle === angle.id
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
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 uppercase">Fuga Estimada</span>
              <span className="font-mono text-sm text-red-400">-${result ? result.deprecation.toLocaleString('en-US') : '0'}</span>
            </div>
          </div>
          <div className="flex-1 bg-slate-950 rounded-lg p-3 border border-slate-800 flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full ${demandInfo.bgClass} flex items-center justify-center ${demandInfo.colorClass}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" /><path d="M15 18H9" /><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></svg>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 uppercase">Demanda ML</span>
              <span className={`font-mono text-sm ${demandInfo.colorClass}`}>{demandInfo.text}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
