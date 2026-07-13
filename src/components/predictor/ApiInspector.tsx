import React from 'react';

interface ApiInspectorProps {
  apiConsoleData: any;
  showApiConsole: boolean;
  setShowApiConsole: (show: boolean) => void;
  loading: boolean;
  result: any;
}

export default function ApiInspector({
  apiConsoleData,
  showApiConsole,
  setShowApiConsole,
  loading,
  result
}: ApiInspectorProps) {
  return (
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
  );
}
