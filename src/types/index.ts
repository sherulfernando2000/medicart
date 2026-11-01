export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
}

export interface StockLog {
  id: string;
  timestamp: string;
  productId: string;
  productName: string;
  type: 'INCOMING' | 'OUTGOING';
  quantity: number;
  prevStock: number;
  newStock: number;
  notes: string;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface InventoryContextType {
  products: Product[];
  categories: string[];
  historyLog: StockLog[];
  toasts: Toast[];
  triggerToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  addProduct: (productData: Omit<Product, 'id'>) => boolean;
  editProduct: (sku: string, updatedData: Omit<Product, 'id' | 'sku'>) => boolean;
  deleteProduct: (sku: string) => void;
  adjustStock: (sku: string, changeAmount: number, notes?: string) => boolean;
  addCategory: (categoryName: string) => boolean;
  bulkDelete: (skus: string[]) => void;
  bulkRestock: (skus: string[], amount: number) => boolean;
  triggerCSVExport: () => void;
}

export interface ThemeContextType {
  theme: string;
  toggleTheme: () => void;
  isDark: boolean;
}
