import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, StockLog, Toast, InventoryContextType } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '../utils/mockData';
import { exportToCSV as csvExportHelper } from '../utils/csvExport';

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryProvider({ children }: { children: ReactNode }) {
  // Load initial products from localStorage, or use mockData
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('inventory_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  // Load initial categories from localStorage, or use mockData
  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('inventory_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  // Load initial stock history from localStorage
  const [historyLog, setHistoryLog] = useState<StockLog[]>(() => {
    const saved = localStorage.getItem('inventory_history');
    return saved ? JSON.parse(saved) : [];
  });

  // In-context simple toast system
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('inventory_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('inventory_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('inventory_history', JSON.stringify(historyLog));
  }, [historyLog]);

  // Toast trigger function
  const triggerToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Log stock changes helper
  const logStockChange = (
    product: { sku: string; name: string; stock: number },
    changeType: 'INCOMING' | 'OUTGOING',
    quantity: number,
    notes: string = ''
  ) => {
    const logItem: StockLog = {
      id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      productId: product.sku,
      productName: product.name,
      type: changeType,
      quantity: Number(quantity),
      prevStock: product.stock,
      newStock: changeType === 'INCOMING' ? product.stock + Number(quantity) : product.stock - Number(quantity),
      notes: notes || (changeType === 'INCOMING' ? 'Stock Added' : 'Stock Dispatched'),
    };
    setHistoryLog((prev) => [logItem, ...prev]);
  };

  // Add Product
  const addProduct = (productData: Omit<Product, 'id'>) => {
    if (products.some(p => p.sku.toUpperCase() === productData.sku.toUpperCase())) {
      triggerToast(`Product SKU ${productData.sku} already exists!`, 'error');
      return false;
    }
    const newProduct: Product = {
      ...productData,
      id: productData.sku,
      price: Number(productData.price),
      stock: Number(productData.stock),
    };
    setProducts((prev) => [...prev, newProduct]);
    
    if (newProduct.stock > 0) {
      logStockChange(
        { sku: newProduct.sku, name: newProduct.name, stock: 0 },
        'INCOMING',
        newProduct.stock,
        'Initial Stock Entry'
      );
    }
    
    triggerToast(`Product "${newProduct.name}" added successfully!`, 'success');
    return true;
  };

  // Edit Product
  const editProduct = (sku: string, updatedData: Omit<Product, 'id' | 'sku'>) => {
    const oldProduct = products.find(p => p.sku === sku);
    if (!oldProduct) {
      triggerToast('Product not found!', 'error');
      return false;
    }

    const priceNum = Number(updatedData.price);
    const stockNum = Number(updatedData.stock);

    if (stockNum !== oldProduct.stock) {
      const diff = stockNum - oldProduct.stock;
      const type = diff > 0 ? 'INCOMING' : 'OUTGOING';
      logStockChange(oldProduct, type, Math.abs(diff), 'Direct Detail Edit');
    }

    setProducts((prev) =>
      prev.map((p) =>
        p.sku === sku
          ? {
              ...p,
              ...updatedData,
              price: priceNum,
              stock: stockNum,
            }
          : p
      )
    );
    triggerToast(`Product "${updatedData.name}" updated!`, 'success');
    return true;
  };

  // Delete Product
  const deleteProduct = (sku: string) => {
    const product = products.find(p => p.sku === sku);
    if (!product) return;
    setProducts((prev) => prev.filter((p) => p.sku !== sku));
    
    if (product.stock > 0) {
      logStockChange(product, 'OUTGOING', product.stock, 'Product Deleted (Write-off)');
    }
    triggerToast(`Product "${product.name}" deleted.`, 'info');
  };

  // Adjust stock inline (single product)
  const adjustStock = (sku: string, changeAmount: number, notes?: string) => {
    const product = products.find(p => p.sku === sku);
    if (!product) return false;

    const newStock = product.stock + changeAmount;
    if (newStock < 0) {
      triggerToast('Stock quantity cannot go below 0!', 'error');
      return false;
    }

    const logType = changeAmount > 0 ? 'INCOMING' : 'OUTGOING';
    logStockChange(product, logType, Math.abs(changeAmount), notes || (changeAmount > 0 ? 'Manual Restock' : 'Manual Dispatch'));

    setProducts((prev) =>
      prev.map((p) => (p.sku === sku ? { ...p, stock: newStock } : p))
    );
    
    triggerToast(
      `Stock updated for ${product.name} (${changeAmount > 0 ? '+' : ''}${changeAmount})`,
      'success'
    );
    return true;
  };

  // Add Custom Category
  const addCategory = (categoryName: string) => {
    const formattedName = categoryName.trim();
    if (!formattedName) {
      triggerToast('Category name cannot be empty!', 'error');
      return false;
    }
    if (categories.some((c) => c.toLowerCase() === formattedName.toLowerCase())) {
      triggerToast('Category already exists!', 'error');
      return false;
    }
    setCategories((prev) => [...prev, formattedName]);
    triggerToast(`Category "${formattedName}" created.`, 'success');
    return true;
  };

  // Bulk Delete
  const bulkDelete = (skus: string[]) => {
    if (!skus || skus.length === 0) return;
    
    setProducts((prev) => {
      const remaining = prev.filter((p) => {
        const toDelete = skus.includes(p.sku);
        if (toDelete && p.stock > 0) {
          logStockChange(p, 'OUTGOING', p.stock, 'Bulk Delete Write-off');
        }
        return !toDelete;
      });
      return remaining;
    });

    triggerToast(`Deleted ${skus.length} products.`, 'info');
  };

  // Bulk Restock
  const bulkRestock = (skus: string[], amount: number) => {
    const restockAmount = Number(amount);
    if (isNaN(restockAmount) || restockAmount <= 0) {
      triggerToast('Please enter a valid stock increment amount (> 0).', 'error');
      return false;
    }

    setProducts((prev) =>
      prev.map((p) => {
        if (skus.includes(p.sku)) {
          logStockChange(p, 'INCOMING', restockAmount, 'Bulk Restock Action');
          return { ...p, stock: p.stock + restockAmount };
        }
        return p;
      })
    );

    triggerToast(`Restocked ${skus.length} items by +${restockAmount}.`, 'success');
    return true;
  };

  // CSV Export Trigger
  const triggerCSVExport = () => {
    if (products.length === 0) {
      triggerToast('No products to export!', 'error');
      return;
    }
    csvExportHelper(products);
    triggerToast('CSV report generated and downloaded.', 'success');
  };

  return (
    <InventoryContext.Provider
      value={{
        products,
        categories,
        historyLog,
        toasts,
        triggerToast,
        removeToast,
        addProduct,
        editProduct,
        deleteProduct,
        adjustStock,
        addCategory,
        bulkDelete,
        bulkRestock,
        triggerCSVExport,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory(): InventoryContextType {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
}
