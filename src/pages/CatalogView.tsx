import React from 'react';
import { usePharmacy } from '../context/PharmacyContext';
import { Medicine } from '../services/mockApiService';
import {
  Plus,
  ShoppingCart,
  Info,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Check,
  PackageCheck,
  CreditCard
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Pain Relief',
  'Antibiotics',
  'Vitamins & Supplements',
  'Allergy & Cold',
  'Chronic Care',
  'Digestive Health',
];

export default function CatalogView() {
  const {
    filteredMedicines,
    selectedCategory,
    setSelectedCategory,
    addToCart,
    cart,
    cartTotalCount,
    cartTotalPrice,
    viewMedicineDetails,
    setIsCheckoutModalOpen,
    setIsCartOpen,
    isLoading,
  } = usePharmacy();

  return (
    <div className="space-y-8 pb-16">
      
      {/* Hero / Announcement Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-800 text-white p-6 sm:p-10 shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fast, Reliable Prescription & Over-The-Counter Medicine</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Certified Pharmaceutical Catalog
          </h2>
          <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
            Browse verified essential medications, antibiotics, pain relievers, and daily vitamins. 
            Automated ordering, safe delivery, and zero-downtime CI/CD infrastructure.
          </p>

          <div className="pt-2 flex flex-wrap gap-4 text-xs font-medium text-emerald-100">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-300" /> 100% Genuine Medicines
            </div>
            <div className="flex items-center gap-1.5">
              <PackageCheck className="w-4 h-4 text-emerald-300" /> Tamper-Proof Packaging
            </div>
            <div className="flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-emerald-300" /> Secure Instant Checkout
            </div>
          </div>
        </div>

        {/* Subtle decorative circles */}
        <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute right-32 top-4 w-48 h-48 rounded-full bg-emerald-400/10 blur-2xl pointer-events-none" />
      </section>

      {/* Floating Active Cart Summary Bar (When items exist in cart) */}
      {cartTotalCount > 0 && (
        <div className="sticky top-24 z-30 flex items-center justify-between p-4 rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-700/20 border border-emerald-500 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/20">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-sm">
                You have {cartTotalCount} item{cartTotalCount > 1 ? 's' : ''} in your cart
              </p>
              <p className="text-xs text-emerald-100">
                Subtotal: <span className="font-mono font-bold">${cartTotalPrice.toFixed(2)}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCartOpen(true)}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 transition-colors"
            >
              View Cart
            </button>
            <button
              onClick={() => setIsCheckoutModalOpen(true)}
              id="catalog-checkout-btn"
              data-testid="catalog-checkout-btn"
              className="px-4 py-2 rounded-xl text-xs font-extrabold bg-white text-emerald-800 hover:bg-emerald-50 shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              Proceed to Checkout (${cartTotalPrice.toFixed(2)})
            </button>
          </div>
        </div>
      )}

      {/* Category Pills Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-white dark:bg-slate-800 text-slate-650 dark:text-slate-350 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Catalog Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="h-72 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse border border-slate-200/60 dark:border-slate-700/60"
            />
          ))}
        </div>
      ) : filteredMedicines.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800/60 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 p-8">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No medicines found</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Try adjusting your search query or switching to another pharmaceutical category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMedicines.map((medicine: Medicine) => {
            const inCartItem = cart.find((ci) => ci.medicine.id === medicine.id);
            const inCartQuantity = inCartItem ? inCartItem.quantity : 0;
            const isOutOfStock = medicine.stock <= 0;

            return (
              <div
                key={medicine.id}
                data-testid={`medicine-card-${medicine.id}`}
                className="group flex flex-col justify-between bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700/70 p-5 shadow-xs hover:shadow-xl hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition-all duration-200"
              >
                <div>
                  {/* Category & Badge Header */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700/70 text-slate-600 dark:text-slate-300">
                      {medicine.category}
                    </span>

                    {medicine.prescriptionRequired ? (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900/40">
                        Rx Required
                      </span>
                    ) : (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/40">
                        OTC Available
                      </span>
                    )}
                  </div>

                  {/* Title & Generic Name */}
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-lg text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {medicine.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium italic">
                      {medicine.genericName} • {medicine.dosage}
                    </p>
                  </div>

                  {/* Description preview */}
                  <p className="text-xs text-slate-600 dark:text-slate-350 line-clamp-2 mt-2 leading-relaxed">
                    {medicine.description}
                  </p>

                  {/* Stock and Form details */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>Form: <strong className="text-slate-700 dark:text-slate-200">{medicine.form}</strong></span>
                    <span className={medicine.stock > 10 ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-amber-600 dark:text-amber-400 font-semibold'}>
                      {medicine.stock > 0 ? `${medicine.stock} in stock` : 'Out of stock'}
                    </span>
                  </div>
                </div>

                {/* Footer: Price + Actions */}
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block -mb-0.5">Price</span>
                    <span className="text-xl font-black text-slate-900 dark:text-white font-mono">
                      ${medicine.price.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* View Details Button (Core Action 3) */}
                    <button
                      onClick={() => viewMedicineDetails(medicine.id)}
                      title="View Medicine Information"
                      className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                    >
                      <Info className="w-4 h-4" />
                    </button>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => addToCart(medicine, 1)}
                      disabled={isOutOfStock}
                      aria-label={`Add to Cart ${medicine.name}`}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isOutOfStock
                          ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                          : inCartQuantity > 0
                          ? 'bg-emerald-650 hover:bg-emerald-750 text-white shadow-sm'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md active:scale-95'
                      }`}
                    >
                      {inCartQuantity > 0 ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Add to Cart ({inCartQuantity})</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
