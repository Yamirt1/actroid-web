import React, { useEffect } from 'react';
import { VEHICLE_DATA, getSpecs } from '../vehicleData';

interface PredictorFormProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  onSubmit: () => void;
  loading: boolean;
}

export default function PredictorForm({ formData, setFormData, onSubmit, loading }: PredictorFormProps) {
  const specs = getSpecs(formData.marca, formData.modelo);
  const models = formData.marca ? Object.keys(VEHICLE_DATA[formData.marca.toLowerCase()] || {}) : [];
  const isFormLocked = !formData.marca || !formData.modelo;

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
  }, [formData.marca, formData.modelo, setFormData]);

  // Form submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="lg:col-span-7 glass-card p-8 rounded-3xl shadow-2xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Parámetros del Vehículo</h2>
        <p className="text-slate-400 text-sm">Ajusta las variables basadas en el dataset para obtener la predicción del modelo Random Forest.</p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
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
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z" /><path d="m14 7 3 3" /><path d="M5 6v4" /><path d="M19 14v4" /><path d="M10 2v2" /><path d="M7 8H3" /><path d="M21 16h-4" /><path d="M11 3H9" /></svg>
              Predecir Precio
            </>
          )}
        </button>
      </form>
    </div>
  );
}
