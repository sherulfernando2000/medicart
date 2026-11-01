import React from 'react';
import { usePharmacy } from '../context/PharmacyContext';
import {
  X,
  Plus,
  ShieldCheck,
  AlertTriangle,
  Building2,
  Layers,
  Sparkles,
  Check
} from 'lucide-react';

export default function MedicineDetailModal() {
  const { selectedMedicine, setSelectedMedicine, addToCart, cart } = usePharmacy();

  if (!selectedMedicine) return null;

  const inCart = cart.find((ci) => ci.medicine.id === selectedMedicine.id);
  const inCartQty = inCart ? inCart.quantity : 0;
  const isOutOfStock = selectedMedicine.stock <= 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="medicine-detail-title"
    >
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                {selectedMedicine.category}
              </span>
              {selectedMedicine.prescriptionRequired && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                  Prescription Only
                </span>
              )}
            </div>
            <h2 id="medicine-detail-title" className="text-xl font-extrabold text-slate-900 dark:text-white">
              {selectedMedicine.name}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {selectedMedicine.genericName} • {selectedMedicine.dosage}
            </p>
          </div>

          <button
            onClick={() => setSelectedMedicine(null)}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5 text-sm">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-1.5">
              Medical Indications & Description
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs sm:text-sm">
              {selectedMedicine.description}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-slate-400 block font-medium">SKU / Code</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                {selectedMedicine.sku}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block font-medium">Dosage Form</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {selectedMedicine.form}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block font-medium">Manufacturer</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {selectedMedicine.manufacturer}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block font-medium">Available Inventory</span>
              <span className={`font-bold ${selectedMedicine.stock > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                {selectedMedicine.stock > 0 ? `${selectedMedicine.stock} units in stock` : 'Out of stock'}
              </span>
            </div>
          </div>

          {/* Safety Notice */}
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 flex items-start gap-2.5 text-xs text-amber-805 dark:text-amber-300">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <div>
              <p className="font-bold">Usage Guidance</p>
              <p className="text-[11px] text-amber-700 dark:text-amber-400/90 mt-0.5">
                Always adhere to licensed medical practitioner instructions. Keep medicines out of reach of children.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-5 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Unit Price</span>
            <span className="font-mono text-2xl font-black text-slate-900 dark:text-white">
              ${selectedMedicine.price.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedMedicine(null)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              Close
            </button>

            <button
              onClick={() => {
                addToCart(selectedMedicine, 1);
                setSelectedMedicine(null);
              }}
              disabled={isOutOfStock}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{inCartQty > 0 ? `Add Another (${inCartQty} in cart)` : 'Add to Cart'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
