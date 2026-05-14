import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function CyberPredictor() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [formData, setFormData] = useState({
    marca: '',
    year: 2024,
    mileage: 0,
    fuel: 'electric'
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
        stagger: 0.1,
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
      let basePrice = 55000;
      const deprecation = Math.floor(formData.mileage * 0.12);
      basePrice -= deprecation;
      
      const imageUrl = `https://loremflickr.com/800/600/${formData.marca.toLowerCase() || 'futuristic,car'},car?random=${Math.random()}`;

      setResult({
        price: basePrice,
        deprecation: deprecation,
        imageUrl: imageUrl,
        brand: formData.marca.toUpperCase() || 'CORE_SYSTEM'
      });
      setLoading(false);
    }, 2100);
  };

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center p-6 perspective-1000">
      
      {/* LEFT: Cyber Form */}
      <div className="lg:col-span-6 relative z-10" ref={cardRef}>
        {/* Animated Borders */}
        <div className="absolute -inset-[1px] bg-gradient-to-tr from-cyan-500 via-transparent to-purple-500 opacity-50 rounded-lg"></div>
        <div className="absolute inset-0 bg-black/90 backdrop-blur-3xl rounded-lg"></div>
        
        <div className="relative p-10 overflow-hidden">
          {/* Background data patterns */}
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <div className="text-[8px] font-mono leading-none">
              {Array.from({length: 10}).map((_, i) => (
                <div key={i}>0x{Math.random().toString(16).slice(2, 10).toUpperCase()}</div>
              ))}
            </div>
          </div>

          <div className="mb-12 relative">
            <span className="text-[10px] font-mono text-cyan-500 tracking-[0.5em] block mb-2">INITIALIZING_PROTOCOL</span>
            <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase flex items-center gap-4">
              <span className="w-8 h-[2px] bg-cyan-500"></span>
              Data Input
            </h2>
          </div>

          <form className="space-y-10" onSubmit={(e) => { e.preventDefault(); handlePredict(); }} ref={formRef}>
            <div className="cyber-input-group relative group">
              <input
                type="text"
                className="w-full bg-transparent border-b border-white/20 py-4 text-xl text-white font-light focus:outline-none focus:border-cyan-500 transition-all peer placeholder:opacity-0"
                placeholder="Brand"
                value={formData.marca}
                onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                required
              />
              <label className="absolute left-0 top-4 text-white/30 text-xs tracking-widest transition-all peer-focus:-top-4 peer-focus:text-cyan-400 peer-[&:not(:placeholder-shown)]:-top-4">
                [ VEHICLE_IDENTIFIER ]
              </label>
              <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-cyan-500 group-hover:w-full transition-all duration-500"></div>
            </div>

            <div className="grid grid-cols-2 gap-10">
              <div className="cyber-input-group relative group">
                <input
                  type="number"
                  className="w-full bg-transparent border-b border-white/20 py-4 text-white focus:outline-none focus:border-purple-500 transition-all peer placeholder:opacity-0"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                />
                <label className="absolute left-0 top-4 text-white/30 text-[10px] tracking-widest transition-all peer-focus:-top-4 peer-focus:text-purple-400 peer-[&:not(:placeholder-shown)]:-top-4">
                  MANUFACTURE_YEAR
                </label>
              </div>
              <div className="cyber-input-group relative group">
                <input
                  type="number"
                  className="w-full bg-transparent border-b border-white/20 py-4 text-white focus:outline-none focus:border-cyan-500 transition-all peer placeholder:opacity-0"
                  value={formData.mileage}
                  onChange={(e) => setFormData({ ...formData, mileage: parseInt(e.target.value) })}
                />
                <label className="absolute left-0 top-4 text-white/30 text-[10px] tracking-widest transition-all peer-focus:-top-4 peer-focus:text-cyan-400 peer-[&:not(:placeholder-shown)]:-top-4">
                  KILOMETER_COUNT
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
                {loading ? 'ANALYZING_FLUX...' : 'EXECUTE_PREDICTION'}
              </span>
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-500"></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-500"></div>
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT: Results / Visuals */}
      <div className="lg:col-span-6 relative flex flex-col justify-center min-h-[500px]">
        {loading && (
          <div className="w-full px-12 text-center">
            <div className="mb-8">
              <div className="text-[10px] font-mono text-cyan-400 mb-2 animate-pulse tracking-widest uppercase">Accessing_Global_Market_Data...</div>
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
                  <div className="text-7xl font-black text-white tracking-tighter italic flex items-start gap-2">
                    <span className="text-3xl text-cyan-500 mt-2">$</span>
                    {result.price.toLocaleString()}
                  </div>
                </div>
                <div className="text-right space-y-4">
                  <div>
                    <div className="text-[10px] text-white/40 uppercase mb-1">Accuracy</div>
                    <div className="text-cyan-400 font-mono text-xl font-bold">99.8%</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-white/40 uppercase mb-1">Loss_Delta</div>
                    <div className="text-red-500 font-mono">-${result.deprecation}</div>
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
