import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { Search, Plus, Minus, FileText, ArrowRightLeft } from 'lucide-react';

export default function StockManagementView() {
  const { products, adjustStock, categories, triggerToast } = useInventory();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  
  // Track adjustment values and notes per product SKU
  const [adjustAmounts, setAdjustAmounts] = useState<Record<string, number>>({});
  const [adjustNotes, setAdjustNotes] = useState<Record<string, string>>({});

  // Helper to handle input change for adjustment amount
  const handleAmountChange = (sku: string, val: string) => {
    const parsed = parseInt(val, 10);
    setAdjustAmounts(prev => ({
      ...prev,
      [sku]: isNaN(parsed) ? 1 : Math.max(1, parsed)
    }));
  };

  // Helper to handle input change for note
  const handleNoteChange = (sku: string, val: string) => {
    setAdjustNotes(prev => ({
      ...prev,
      [sku]: val
    }));
  };

  // Process stock adjustment
  const handleAdjust = (sku: string, direction: 'INCOMING' | 'OUTGOING') => {
    const amount = adjustAmounts[sku] || 1;
    const note = adjustNotes[sku] || '';
    const product = products.find(p => p.sku === sku);
    
    if (!product) return;

    if (direction === 'OUTGOING' && product.stock - amount < 0) {
      triggerToast(`Cannot dispatch ${amount} units. Only ${product.stock} units available!`, 'error');
      return;
    }

    // Call adjustStock in context
    adjustStock(sku, direction === 'INCOMING' ? amount : -amount, note);
    
    // Reset inputs
    setAdjustAmounts(prev => ({ ...prev, [sku]: 1 }));
    setAdjustNotes(prev => ({ ...prev, [sku]: '' }));
  };

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white my-0">
          Stock Control Center
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Perform manual stock updates with custom change numbers and audit logs comments.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
        {/* Search */}
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search product SKU or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-955/40 text-slate-950 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
          />
        </div>

        {/* Category Select */}
        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-xs font-semibold text-slate-455 dark:text-slate-400 uppercase tracking-wider hidden sm:inline">
            Category:
          </span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-955/40 text-slate-955 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Adjustment Table View */}
      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center shadow-sm">
          <ArrowRightLeft className="w-14 h-14 text-slate-350 dark:text-slate-655 stroke-1" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-4">No Products Available</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mt-1">
            There are no products matching your search criteria to adjust stock.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-805 text-slate-400 text-xs font-semibold uppercase tracking-wider bg-slate-50/50 dark:bg-slate-900/50">
                  <th className="py-3.5 px-4 w-64">Product Details</th>
                  <th className="py-3.5 px-4 text-center w-36">Current Stock</th>
                  <th className="py-3.5 px-4 w-32">Qty to Adjust</th>
                  <th className="py-3.5 px-4">Remarks / Notes</th>
                  <th className="py-3.5 px-4 text-center w-52">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                {filteredProducts.map((product) => {
                  const amount = adjustAmounts[product.sku] !== undefined ? adjustAmounts[product.sku] : 1;
                  const note = adjustNotes[product.sku] || '';
                  const isOutOfStock = product.stock === 0;
                  const isLowStock = product.stock > 0 && product.stock < 10;
                  const isDecrementDisabled = product.stock - amount < 0;

                  return (
                    <tr key={product.sku} className="hover:bg-slate-50/40 dark:hover:bg-slate-850/20 transition-colors text-slate-705 dark:text-slate-350">
                      
                      {/* Product details */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-855 dark:text-slate-100">
                          {product.name}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-xs text-slate-400 dark:text-slate-505 font-semibold">{product.sku}</span>
                          <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-655 dark:text-slate-300 px-1.5 py-0.5 rounded font-semibold">
                            {product.category}
                          </span>
                        </div>
                      </td>

                      {/* Current Stock */}
                      <td className="py-3 px-4 text-center">
                        <span className={`text-base font-bold font-mono px-2.5 py-1 rounded-lg ${
                          isOutOfStock 
                            ? 'bg-rose-50 dark:bg-rose-955/20 text-rose-600 dark:text-rose-400' 
                            : isLowStock 
                            ? 'bg-amber-50 dark:bg-amber-955/20 text-amber-600 dark:text-amber-400' 
                            : 'bg-slate-50 dark:bg-slate-950/40 text-slate-700 dark:text-slate-205'
                        }`}>
                          {product.stock}
                        </span>
                      </td>

                      {/* Qty to Adjust Input */}
                      <td className="py-3 px-4">
                        <input
                          type="number"
                          min="1"
                          placeholder="1"
                          value={adjustAmounts[product.sku] !== undefined ? adjustAmounts[product.sku] : ''}
                          onChange={(e) => handleAmountChange(product.sku, e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-955/30 text-slate-905 dark:text-slate-105 border border-slate-205 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-semibold font-mono"
                        />
                      </td>

                      {/* Remarks Note Input */}
                      <td className="py-3 px-4">
                        <div className="relative">
                          <FileText className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                          <input
                            type="text"
                            placeholder="Add comment..."
                            value={note}
                            onChange={(e) => handleNoteChange(product.sku, e.target.value)}
                            className="w-full pl-8 pr-2 py-1.5 text-xs bg-slate-50 dark:bg-slate-955/30 text-slate-905 dark:text-slate-105 border border-slate-205 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                          />
                        </div>
                      </td>

                      {/* Action buttons */}
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex gap-2">
                          
                          {/* Decrease button */}
                          <button
                            onClick={() => handleAdjust(product.sku, 'OUTGOING')}
                            disabled={isDecrementDisabled}
                            title={isDecrementDisabled ? "Insufficient stock levels" : "Remove stock"}
                            className={`p-1.5 rounded-lg flex items-center justify-center gap-1 text-xs font-bold transition-all active:scale-95 cursor-pointer ${
                              isDecrementDisabled
                                ? 'bg-slate-100 dark:bg-slate-800/40 text-slate-350 dark:text-slate-650 cursor-not-allowed'
                                : 'bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-955/20 dark:hover:bg-rose-900/35 dark:text-rose-400'
                            }`}
                          >
                            <Minus className="w-3.5 h-3.5" />
                            <span>Sales</span>
                          </button>

                          {/* Increase button */}
                          <button
                            onClick={() => handleAdjust(product.sku, 'INCOMING')}
                            title="Add stock"
                            className="p-1.5 bg-emerald-55/90 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-955/20 dark:hover:bg-emerald-900/35 dark:text-emerald-400 rounded-lg flex items-center justify-center gap-1 text-xs font-bold transition-all active:scale-95 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Restock</span>
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
