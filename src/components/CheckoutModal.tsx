import React, { useState } from 'react';
import { usePharmacy } from '../context/PharmacyContext';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  CreditCard,
  Truck,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function CheckoutModal() {
  const {
    isCheckoutModalOpen,
    setIsCheckoutModalOpen,
    isCartOpen,
    setIsCartOpen,
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartTotalPrice,
    performCheckout,
    orderReceipt,
  } = usePharmacy();

  const [customerName, setCustomerName] = useState('John Doe');
  const [customerEmail, setCustomerEmail] = useState('john.doe@example.com');
  const [deliveryAddress, setDeliveryAddress] = useState('456 Wellness Way, Medical District');
  const [paymentMethod, setPaymentMethod] = useState<'Credit Card' | 'Cash on Delivery' | 'Digital Wallet'>('Credit Card');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If neither cart drawer nor checkout modal is open, return null
  const isOpen = isCheckoutModalOpen || isCartOpen;
  if (!isOpen) return null;

  const handleClose = () => {
    setIsCheckoutModalOpen(false);
    setIsCartOpen(false);
  };

  const handleCompleteCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setIsSubmitting(true);
    try {
      await performCheckout({
        name: customerName,
        email: customerEmail,
        address: deliveryAddress,
        paymentMethod,
      });
      // The receipt is stored in state, modal closes, and receipt modal/receipt view is shown!
    } finally {
      setIsSubmitting(false);
    }
  };

  const taxAmount = Number((cartTotalPrice * 0.05).toFixed(2));
  const finalTotal = Number((cartTotalPrice + taxAmount).toFixed(2));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
    >
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 id="checkout-modal-title" className="text-xl font-bold text-slate-900 dark:text-white">
                {isCheckoutModalOpen ? 'Pharmacy Checkout & Payment' : 'Your MediCart Bag'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {cart.length} unique medicine{cart.length === 1 ? '' : 's'} selected
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Your cart is empty</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Select medicines from the MediCart catalog to proceed with your checkout.
              </p>
              <button
                onClick={handleClose}
                className="mt-4 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all cursor-pointer"
              >
                Browse Medicines
              </button>
            </div>
          ) : (
            <>
              {/* Cart Items List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold uppercase text-slate-400 tracking-wider">
                  <span>Prescriptions & Medicines</span>
                  <button
                    onClick={clearCart}
                    className="text-rose-500 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Clear Cart
                  </button>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {cart.map((item) => (
                    <div
                      key={item.medicine.id}
                      className="py-3.5 flex items-center justify-between gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                            {item.medicine.name}
                          </h4>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {item.medicine.dosage}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          ${item.medicine.price.toFixed(2)} each
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.medicine.id, item.quantity - 1)}
                            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                            aria-label={`Decrease quantity of ${item.medicine.name}`}
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-bold text-slate-800 dark:text-slate-200">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.medicine.id, item.quantity + 1)}
                            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                            aria-label={`Increase quantity of ${item.medicine.name}`}
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="font-mono font-bold text-sm text-slate-900 dark:text-white w-16 text-right">
                          ${(item.medicine.price * item.quantity).toFixed(2)}
                        </span>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.medicine.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Patient & Delivery Information */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  Patient & Delivery Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Patient Name
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Delivery Address
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Payment Method
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['Credit Card', 'Cash on Delivery', 'Digital Wallet'] as const).map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setPaymentMethod(method)}
                          className={`p-2 rounded-xl text-center font-semibold transition-all cursor-pointer ${
                            paymentMethod === method
                              ? 'bg-emerald-50 dark:bg-emerald-950/50 border-2 border-emerald-500 text-emerald-800 dark:text-emerald-300'
                              : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Cost Breakdown */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/60 p-4 rounded-2xl space-y-2 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-mono font-medium">${cartTotalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Pharmacy Processing & Tax (5%)</span>
                  <span className="font-mono font-medium">${taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Express Medical Delivery</span>
                  <span className="text-emerald-600 font-bold uppercase">Free</span>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between text-sm font-extrabold text-slate-900 dark:text-white">
                  <span>Total Due</span>
                  <span className="font-mono text-base text-emerald-600 dark:text-emerald-400">
                    ${finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Verified by MediCart Healthcare Safety Protocol & PCI Compliant</span>
              </div>
            </>
          )}
        </div>

        {/* Modal Action Footer */}
        {cart.length > 0 && (
          <div className="p-4 sm:px-6 bg-slate-50/70 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              Continue Shopping
            </button>

            {/* Core Checkout Button: Triggers order confirmation */}
            <button
              type="button"
              onClick={handleCompleteCheckout}
              disabled={isSubmitting}
              id="checkout-submit-btn"
              data-testid="checkout-button"
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm shadow-md shadow-emerald-600/25 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              <CreditCard className="w-4 h-4" />
              <span>{isSubmitting ? 'Processing...' : `Place Order ($${finalTotal.toFixed(2)})`}</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
