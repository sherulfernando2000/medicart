import React from 'react';
import { usePharmacy } from '../context/PharmacyContext';
import { useTheme } from '../context/ThemeContext';
import {
  ShoppingBag,
  Activity,
  Search,
  Sun,
  Moon,
  Pill,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

export default function Navbar() {
  const {
    cartTotalCount,
    cartTotalPrice,
    setIsCartOpen,
    setIsCheckoutModalOpen,
    setIsHealthModalOpen,
    searchQuery,
    setSearchQuery,
    healthStatus,
    resetCatalog,
  } = usePharmacy();
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-emerald-100 dark:border-slate-800 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & Brand Name */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/25 shrink-0">
              <Pill className="w-6 h-6 rotate-45" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                <span>MediCart – Online Pharmacy</span>
              </h1>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Licensed Digital Pharmacy
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="text-slate-500 dark:text-slate-400 font-normal">CI/CD Ready</span>
              </div>
            </div>
          </div>

          {/* Search bar (Center / Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search medicines (e.g. Paracetamol, Amoxicillin)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:bg-white dark:focus:bg-slate-900 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Action buttons (Right) */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* System Health Check Button */}
            <button
              onClick={() => setIsHealthModalOpen(true)}
              title="Internal App Health Check (DevOps Diagnostic)"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors cursor-pointer"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <Activity className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {healthStatus?.status || 'HEALTHY'}
              </span>
            </button>

            {/* Reset Catalog button */}
            <button
              onClick={resetCatalog}
              title="Reset inventory to default sample data"
              className="hidden lg:flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-650 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Data</span>
            </button>

            {/* Dark/Light mode toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            {/* Cart & Checkout Trigger Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              id="cart-button"
              className="relative flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-4.5 h-4.5" />
              <span className="hidden sm:inline">Cart</span>
              <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-extrabold rounded-full bg-white text-emerald-700">
                {cartTotalCount}
              </span>
              {cartTotalPrice > 0 && (
                <span className="hidden md:inline font-mono text-emerald-100 font-semibold border-l border-emerald-500/50 pl-2">
                  ${cartTotalPrice.toFixed(2)}
                </span>
              )}
            </button>

            {/* Quick Checkout Button if cart has items */}
            {cartTotalCount > 0 && (
              <button
                onClick={() => setIsCheckoutModalOpen(true)}
                id="quick-checkout-header-btn"
                className="hidden sm:inline-flex items-center px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
              >
                Checkout Now
              </button>
            )}

          </div>
        </div>

        {/* Mobile Search input bar */}
        <div className="pb-3 md:hidden">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search medicines..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
