import React from 'react';
import { usePharmacy } from '../context/PharmacyContext';
import {
  CheckCircle2,
  Package,
  Calendar,
  MapPin,
  CreditCard,
  Printer,
  X,
  FileCheck2,
  Sparkles
} from 'lucide-react';

export default function OrderReceiptModal() {
  const { orderReceipt, setOrderReceipt } = usePharmacy();

  if (!orderReceipt) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleClose = () => {
    setOrderReceipt(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="receipt-title"
      data-testid="order-confirmation-receipt"
    >
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-emerald-200 dark:border-emerald-900/40 overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Success Header Banner */}
        <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 text-white p-6 text-center relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close Confirmation"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto mb-3 shadow-inner">
            <CheckCircle2 className="w-9 h-9 text-white" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" /> Order Confirmed
          </span>

          <h2 id="receipt-title" className="text-2xl font-black mt-2">
            Order Confirmation
          </h2>
          <p className="text-emerald-100 text-xs mt-1">
            Thank you! Your pharmacy prescription order has been received and confirmed.
          </p>
        </div>

        {/* Receipt Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {/* Order Meta Card */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400 font-medium block">Order Number</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                #{orderReceipt.orderId}
              </span>
            </div>

            <div>
              <span className="text-slate-400 font-medium block">Order Status</span>
              <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                <FileCheck2 className="w-3.5 h-3.5" /> {orderReceipt.status}
              </span>
            </div>

            <div>
              <span className="text-slate-400 font-medium block">Date & Time</span>
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                {new Date(orderReceipt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} •{' '}
                {new Date(orderReceipt.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>

            <div>
              <span className="text-slate-400 font-medium block">Estimated Delivery</span>
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                {orderReceipt.deliveryEstimatedDate}
              </span>
            </div>
          </div>

          {/* Patient and Shipping Details */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 uppercase tracking-wide">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Delivery Details
            </h4>
            <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/40 space-y-1">
              <p className="font-bold text-slate-900 dark:text-white">{orderReceipt.customer.name}</p>
              <p className="text-slate-600 dark:text-slate-300">{orderReceipt.customer.address}</p>
              <p className="text-slate-400 text-[11px]">
                Paid via {orderReceipt.customer.paymentMethod}
              </p>
            </div>
          </div>

          {/* Ordered Medicine Items */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5 uppercase tracking-wide">
              <Package className="w-3.5 h-3.5 text-emerald-600" /> Prescribed Items
            </h4>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-800/40">
              {orderReceipt.items.map((item) => (
                <div
                  key={item.medicine.id}
                  className="p-3 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {item.medicine.name}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                      Qty: {item.quantity} × ${item.medicine.price.toFixed(2)}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    ${(item.medicine.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Summary */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Subtotal</span>
              <span className="font-mono">${orderReceipt.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Healthcare Surcharge / Tax (5%)</span>
              <span className="font-mono">${orderReceipt.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Express Delivery</span>
              <span className="text-emerald-600 font-bold uppercase">Free</span>
            </div>
            <div className="pt-2 border-t border-emerald-200/50 dark:border-emerald-900/50 flex justify-between text-sm font-black text-slate-900 dark:text-white">
              <span>Total Paid</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 text-base">
                ${orderReceipt.total.toFixed(2)}
              </span>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <Printer className="w-4 h-4" /> Print Receipt
          </button>
          <button
            onClick={handleClose}
            className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
          >
            Done & Continue Shopping
          </button>
        </div>

      </div>
    </div>
  );
}
