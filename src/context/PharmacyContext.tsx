import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  Medicine,
  CartItem,
  OrderConfirmation,
  HealthStatus,
  CustomerDetails,
  getHealthStatus,
  getMedicineList,
  getMedicineDetails,
  checkoutOrder,
  resetMockMedicines,
} from '../services/mockApiService';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface PharmacyContextType {
  medicines: Medicine[];
  filteredMedicines: Medicine[];
  cart: CartItem[];
  selectedMedicine: Medicine | null;
  orderReceipt: OrderConfirmation | null;
  healthStatus: HealthStatus | null;
  isLoading: boolean;
  searchQuery: string;
  selectedCategory: string;
  isCartOpen: boolean;
  isCheckoutModalOpen: boolean;
  isHealthModalOpen: boolean;
  toasts: Toast[];
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (cat: string) => void;
  setIsCartOpen: (open: boolean) => void;
  setIsCheckoutModalOpen: (open: boolean) => void;
  setIsHealthModalOpen: (open: boolean) => void;
  setSelectedMedicine: (med: Medicine | null) => void;
  setOrderReceipt: (receipt: OrderConfirmation | null) => void;
  addToCart: (medicine: Medicine, quantity?: number) => void;
  removeFromCart: (medicineId: string) => void;
  updateQuantity: (medicineId: string, quantity: number) => void;
  clearCart: () => void;
  viewMedicineDetails: (id: string) => Promise<Medicine | null>;
  performCheckout: (customer?: Partial<CustomerDetails>) => Promise<OrderConfirmation>;
  fetchHealthStatus: () => Promise<HealthStatus>;
  resetCatalog: () => void;
  triggerToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  cartTotalCount: number;
  cartTotalPrice: number;
}

const PharmacyContext = createContext<PharmacyContextType | undefined>(undefined);

export function PharmacyProvider({ children }: { children: ReactNode }) {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [orderReceipt, setOrderReceipt] = useState<OrderConfirmation | null>(null);
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState<boolean>(false);
  const [isHealthModalOpen, setIsHealthModalOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const triggerToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch medicines on mount
  const refreshMedicines = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getMedicineList();
      setMedicines(data);
    } catch (err) {
      triggerToast('Failed to load medicines: ' + String(err), 'error');
    } finally {
      setIsLoading(false);
    }
  }, [triggerToast]);

  const fetchHealthStatus = useCallback(async (): Promise<HealthStatus> => {
    const status = await getHealthStatus();
    setHealthStatus(status);
    return status;
  }, []);

  useEffect(() => {
    refreshMedicines();
    fetchHealthStatus();
  }, [refreshMedicines, fetchHealthStatus]);

  // Filter medicines when searchQuery or selectedCategory change
  useEffect(() => {
    let result = [...medicines];
    if (selectedCategory !== 'All') {
      result = result.filter((m) => m.category === selectedCategory);
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.genericName.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q) ||
          m.category.toLowerCase().includes(q)
      );
    }
    setFilteredMedicines(result);
  }, [medicines, searchQuery, selectedCategory]);

  const addToCart = useCallback((medicine: Medicine, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.medicine.id === medicine.id);
      if (existing) {
        return prev.map((item) =>
          item.medicine.id === medicine.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { medicine, quantity }];
    });
    triggerToast(`Added ${quantity}x ${medicine.name} to cart.`, 'success');
  }, [triggerToast]);

  const removeFromCart = useCallback((medicineId: string) => {
    setCart((prev) => prev.filter((item) => item.medicine.id !== medicineId));
    triggerToast('Item removed from cart.', 'info');
  }, [triggerToast]);

  const updateQuantity = useCallback((medicineId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(medicineId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.medicine.id === medicineId ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const viewMedicineDetails = useCallback(async (id: string): Promise<Medicine | null> => {
    const med = await getMedicineDetails(id);
    setSelectedMedicine(med);
    return med;
  }, []);

  const performCheckout = useCallback(
    async (customer?: Partial<CustomerDetails>): Promise<OrderConfirmation> => {
      if (cart.length === 0) {
        throw new Error('Your cart is empty.');
      }
      const receipt = await checkoutOrder(cart, customer);
      setOrderReceipt(receipt);
      clearCart();
      setIsCartOpen(false);
      setIsCheckoutModalOpen(false);
      triggerToast(`Order placed successfully! Order #${receipt.orderId}`, 'success');
      await refreshMedicines();
      return receipt;
    },
    [cart, clearCart, triggerToast, refreshMedicines]
  );

  const resetCatalog = useCallback(() => {
    resetMockMedicines();
    refreshMedicines();
    triggerToast('Catalog inventory reset to default.', 'info');
  }, [refreshMedicines, triggerToast]);

  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotalPrice = Number(
    cart.reduce((sum, item) => sum + item.medicine.price * item.quantity, 0).toFixed(2)
  );

  return (
    <PharmacyContext.Provider
      value={{
        medicines,
        filteredMedicines,
        cart,
        selectedMedicine,
        orderReceipt,
        healthStatus,
        isLoading,
        searchQuery,
        selectedCategory,
        isCartOpen,
        isCheckoutModalOpen,
        isHealthModalOpen,
        toasts,
        setSearchQuery,
        setSelectedCategory,
        setIsCartOpen,
        setIsCheckoutModalOpen,
        setIsHealthModalOpen,
        setSelectedMedicine,
        setOrderReceipt,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        viewMedicineDetails,
        performCheckout,
        fetchHealthStatus,
        resetCatalog,
        triggerToast,
        removeToast,
        cartTotalCount,
        cartTotalPrice,
      }}
    >
      {children}
    </PharmacyContext.Provider>
  );
}

export function usePharmacy() {
  const context = useContext(PharmacyContext);
  if (!context) {
    throw new Error('usePharmacy must be used within a PharmacyProvider');
  }
  return context;
}
