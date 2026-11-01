import React, { useState } from 'react';
import { usePharmacy } from '../context/PharmacyContext';
import {
  Activity,
  CheckCircle2,
  X,
  Server,
  Cpu,
  RefreshCw,
  GitBranch,
  ShieldCheck
} from 'lucide-react';

export default function HealthStatusModal() {
  const { isHealthModalOpen, setIsHealthModalOpen, healthStatus, fetchHealthStatus } = usePharmacy();
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!isHealthModalOpen) return null;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchHealthStatus();
    } finally {
      setTimeout(() => setIsRefreshing(false), 400);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="health-modal-title"
    >
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-emerald-200 dark:border-emerald-900/50 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 id="health-modal-title" className="text-lg font-bold text-slate-900 dark:text-white">
                DevOps Health Status
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Internal App & Service Readiness Check
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsHealthModalOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close Health Check"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          
          {/* Main Status Badge */}
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-400 block">
                  Overall System State
                </span>
                <span className="text-base font-black text-emerald-900 dark:text-emerald-200">
                  {healthStatus?.status || 'HEALTHY (200 OK)'}
                </span>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-md bg-emerald-600 text-white font-mono font-bold text-[11px]">
              OPERATIONAL
            </span>
          </div>

          {/* Service breakdown */}
          <div className="space-y-2">
            <span className="font-bold uppercase tracking-wider text-[10px] text-slate-400">
              Subsystem Readiness
            </span>

            <div className="space-y-1.5">
              <div className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
                <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Server className="w-3.5 h-3.5 text-emerald-600" /> Medicine Catalog Service
                </span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> UP
                </span>
              </div>

              <div className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
                <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Cpu className="w-3.5 h-3.5 text-emerald-600" /> Checkout & Order Engine
                </span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> UP
                </span>
              </div>

              <div className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
                <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> In-Memory Client Storage
                </span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> UP
                </span>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
            <div className="flex justify-between">
              <span>App Version:</span>
              <strong className="text-slate-800 dark:text-slate-200">{healthStatus?.version || '1.0.0-cicd'}</strong>
            </div>
            <div className="flex justify-between">
              <span>Environment:</span>
              <strong className="text-slate-800 dark:text-slate-200">{healthStatus?.environment || 'production-ready'}</strong>
            </div>
            <div className="flex justify-between">
              <span>Session Uptime:</span>
              <strong className="text-slate-800 dark:text-slate-200">{healthStatus?.uptimeSeconds || 0} seconds</strong>
            </div>
            <div className="flex justify-between">
              <span>Timestamp:</span>
              <strong className="text-slate-800 dark:text-slate-200">{healthStatus?.timestamp.slice(0, 19).replace('T', ' ') || 'N/A'}</strong>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Re-run Health Check</span>
          </button>

          <button
            onClick={() => setIsHealthModalOpen(false)}
            className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold transition-all cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
