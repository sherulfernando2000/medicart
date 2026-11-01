import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { PharmacyProvider, usePharmacy } from './context/PharmacyContext';
import Navbar from './components/Navbar';
import CatalogView from './pages/CatalogView';
import CheckoutModal from './components/CheckoutModal';
import OrderReceiptModal from './components/OrderReceiptModal';
import MedicineDetailModal from './components/MedicineDetailModal';
import HealthStatusModal from './components/HealthStatusModal';
import { CheckCircle2, AlertOctagon, Info, X, Shield, HeartPulse, Activity } from 'lucide-react';
import './App.css';

function MainAppShell() {
  const { toasts, removeToast, setIsHealthModalOpen, healthStatus } = usePharmacy();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* MediCart Online Pharmacy Header / Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Routes>
          <Route path="/" element={<CatalogView />} />
          <Route path="/catalog" element={<CatalogView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Modals & Overlays */}
      <CheckoutModal />
      <OrderReceiptModal />
      <MedicineDetailModal />
      <HealthStatusModal />

      {/* Global Toast Notification Center */}
      <div
        className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2.5 w-full max-w-sm pointer-events-none"
        aria-live="polite"
      >
        {toasts.map((toast) => {
          let Icon = Info;
          let colorClasses =
            'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/90 dark:text-emerald-200';

          if (toast.type === 'success') {
            Icon = CheckCircle2;
            colorClasses =
              'border-teal-200 bg-teal-50 text-teal-900 dark:border-teal-800 dark:bg-teal-950/90 dark:text-teal-200';
          } else if (toast.type === 'error') {
            Icon = AlertOctagon;
            colorClasses =
              'border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-800 dark:bg-rose-950/90 dark:text-rose-200';
          }

          return (
            <div
              key={toast.id}
              className={`p-3.5 rounded-2xl border shadow-xl flex items-start gap-3 pointer-events-auto backdrop-blur-md transition-all ${colorClasses}`}
            >
              <Icon className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
              <div className="flex-1 text-xs font-semibold leading-relaxed">
                {toast.message}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
                aria-label="Dismiss notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Application Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 py-8 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-slate-700 dark:text-slate-200">
              MediCart – Online Pharmacy Platform
            </span>
            <span>• DevOps CI/CD Automated Build</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsHealthModalOpen(true)}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Activity className="w-3.5 h-3.5" /> System Status: {healthStatus?.status || 'HEALTHY'}
            </button>
            <span>v1.0.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <PharmacyProvider>
        <BrowserRouter>
          <MainAppShell />
        </BrowserRouter>
      </PharmacyProvider>
    </ThemeProvider>
  );
}
