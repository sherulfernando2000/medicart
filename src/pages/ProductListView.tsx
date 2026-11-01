import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { 
  Plus, 
  Search, 
  Grid, 
  List, 
  Download, 
  Trash2, 
  Edit, 
  PlusCircle, 
  MinusCircle, 
  FolderPlus,
  Inbox
} from 'lucide-react';
import ProductModal from '../components/ProductModal';
import CategoryModal from '../components/CategoryModal';
import { Product } from '../types';

export default function ProductListView() {
  const { 
    products, 
    categories, 
    adjustStock, 
    deleteProduct, 
    bulkDelete, 
    bulkRestock, 
    triggerCSVExport 
  } = useInventory();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL'); // ALL, IN_STOCK, OUT_OF_STOCK, LOW_STOCK
  
  // Layout state
  const [viewMode, setViewMode] = useState<'TABLE' | 'GRID'>('TABLE');
  
  // Selection state (Bulk actions)
  const [selectedSkus, setSelectedSkus] = useState<string[]>([]);
  
  // Modal states
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  
  // Bulk restock amount state
  const [bulkRestockAmount, setBulkRestockAmount] = useState('');
  const [showBulkRestockInput, setShowBulkRestockInput] = useState(false);

  const lowStockThreshold = 10;

  // Filter products logic
  const filteredProducts = products.filter((product) => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'ALL' || product.category === selectedCategory;
      
    let matchesStatus = true;
    if (selectedStatus === 'IN_STOCK') {
      matchesStatus = product.stock > 0;
    } else if (selectedStatus === 'OUT_OF_STOCK') {
      matchesStatus = product.stock === 0;
    } else if (selectedStatus === 'LOW_STOCK') {
      matchesStatus = product.stock > 0 && product.stock < lowStockThreshold;
    }

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Checkbox handling
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedSkus(filteredProducts.map(p => p.sku));
    } else {
      setSelectedSkus([]);
    }
  };

  const handleSelectOne = (sku: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedSkus(prev => [...prev, sku]);
    } else {
      setSelectedSkus(prev => prev.filter(s => s !== sku));
    }
  };

  const handleOpenAddProduct = () => {
    setProductToEdit(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (product: Product) => {
    setProductToEdit(product);
    setIsProductModalOpen(true);
  };

  const handleBulkDeleteAction = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedSkus.length} products?`)) {
      bulkDelete(selectedSkus);
      setSelectedSkus([]);
    }
  };

  const handleBulkRestockAction = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(bulkRestockAmount, 10);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid positive integer.');
      return;
    }
    const success = bulkRestock(selectedSkus, amount);
    if (success) {
      setSelectedSkus([]);
      setBulkRestockAmount('');
      setShowBulkRestockInput(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Title / Toolbar Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white my-0">
            Inventory Catalog
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Create, search, filter, and adjust quantities of products in stock.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="px-4 py-2.5 text-sm font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-750 dark:text-slate-205 transition-all flex items-center gap-2"
          >
            <FolderPlus className="w-4 h-4" />
            <span>New Category</span>
          </button>
          
          <button
            onClick={triggerCSVExport}
            className="px-4 py-2.5 text-sm font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-750 dark:text-slate-205 transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleOpenAddProduct}
            className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-violet-600 hover:bg-violet-755 text-white shadow-lg shadow-violet-550/20 active:scale-98 transition-all flex items-center gap-2"
          >
            <Plus className="w-4.5 h-4.5" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Instant Search & Multi-Filters Toolbar */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Product Name or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-955/40 text-slate-955 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-3.5">
          {/* Category Dropdown */}
          <div className="flex items-center space-x-1.5">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:inline">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 text-sm bg-slate-50 dark:bg-slate-955/40 text-slate-955 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Stock Status Dropdown */}
          <div className="flex items-center space-x-1.5">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:inline">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 text-sm bg-slate-50 dark:bg-slate-955/40 text-slate-955 dark:text-slate-105 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all cursor-pointer"
            >
              <option value="ALL">All Stock Statuses</option>
              <option value="IN_STOCK">In Stock</option>
              <option value="LOW_STOCK">Low Stock (&lt;10)</option>
              <option value="OUT_OF_STOCK">Out of Stock</option>
            </select>
          </div>

          {/* Table / Grid Toggle */}
          <div className="flex items-center border border-slate-200 dark:border-slate-855 rounded-xl overflow-hidden shrink-0">
            <button
              onClick={() => setViewMode('TABLE')}
              className={`p-2 transition-colors ${viewMode === 'TABLE' ? 'bg-slate-100 dark:bg-slate-800 text-violet-650 dark:text-violet-405' : 'text-slate-450 dark:text-slate-455 hover:bg-slate-50 dark:hover:bg-slate-850'}`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('GRID')}
              className={`p-2 transition-colors ${viewMode === 'GRID' ? 'bg-slate-100 dark:bg-slate-800 text-violet-650 dark:text-violet-405' : 'text-slate-450 dark:text-slate-455 hover:bg-slate-50 dark:hover:bg-slate-850'}`}
              title="Grid Cards View"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* Bulk Action Controls Bar */}
      {selectedSkus.length > 0 && (
        <div className="p-4 bg-violet-50/70 dark:bg-violet-955/20 border border-violet-100 dark:border-violet-900/50 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center space-x-3">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-600"></span>
            </span>
            <span className="text-sm font-semibold text-violet-850 dark:text-violet-305">
              Selected {selectedSkus.length} product{selectedSkus.length > 1 ? 's' : ''} for bulk actions
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Bulk Restock Input Trigger */}
            {!showBulkRestockInput ? (
              <button
                onClick={() => setShowBulkRestockInput(true)}
                className="px-4 py-2 text-sm font-semibold bg-violet-600 hover:bg-violet-750 text-white rounded-xl shadow transition-colors"
              >
                Bulk Restock
              </button>
            ) : (
              <form onSubmit={handleBulkRestockAction} className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="Qty to add"
                  value={bulkRestockAmount}
                  onChange={(e) => setBulkRestockAmount(e.target.value)}
                  className="w-24 px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-violet-200 dark:border-violet-800 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500"
                  required
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-bold bg-violet-600 hover:bg-violet-750 text-white rounded-lg transition-colors"
                >
                  Apply
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowBulkRestockInput(false);
                    setBulkRestockAmount('');
                  }}
                  className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-250 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </form>
            )}

            {/* Bulk Delete */}
            <button
              onClick={handleBulkDeleteAction}
              className="px-4 py-2 text-sm font-semibold bg-rose-605 hover:bg-rose-705 text-white rounded-xl shadow transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              Delete Selected
            </button>

            {/* Clear Selection */}
            <button
              onClick={() => setSelectedSkus([])}
              className="px-3.5 py-2 text-sm font-medium border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-855 text-slate-500 dark:text-slate-400 rounded-xl transition-colors"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Main Inventory Display Grid/Table */}
      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-center shadow-sm">
          <Inbox className="w-16 h-16 text-slate-300 dark:text-slate-755 stroke-1" />
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-5">No Products Found</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mt-1">
            {products.length === 0
              ? "Your inventory is currently empty. Seed products or add manual entries to start."
              : "No products match the search query and filters applied."}
          </p>
          
          {products.length === 0 ? (
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleOpenAddProduct}
                className="px-5 py-2.5 bg-violet-605 hover:bg-violet-755 text-white rounded-xl text-sm font-semibold shadow-md transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('ALL');
                setSelectedStatus('ALL');
              }}
              className="mt-6 px-4 py-2 border border-slate-250 hover:bg-slate-50 dark:border-slate-805 dark:hover:bg-slate-800/80 text-slate-600 dark:text-slate-300 rounded-xl text-sm font-semibold transition-all"
            >
              Clear Search Filters
            </button>
          )}
        </div>
      ) : viewMode === 'TABLE' ? (
        
        // TABLE VIEW LAYOUT
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <th className="py-4 px-4 text-center w-12">
                    <input
                      type="checkbox"
                      checked={filteredProducts.length > 0 && selectedSkus.length === filteredProducts.length}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-violet-650 bg-slate-50 border-slate-250 dark:border-slate-805 rounded focus:ring-violet-505 focus:outline-none cursor-pointer"
                    />
                  </th>
                  <th className="py-4 px-4">SKU / ID</th>
                  <th className="py-4 px-4">Product Details</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4 text-right">Price</th>
                  <th className="py-4 px-4 text-center">Stock Level</th>
                  <th className="py-4 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-855">
                {filteredProducts.map((product) => {
                  const isChecked = selectedSkus.includes(product.sku);
                  const isLowStock = product.stock > 0 && product.stock < lowStockThreshold;
                  const isOutOfStock = product.stock === 0;

                  return (
                    <tr 
                      key={product.sku} 
                      className={`hover:bg-slate-50/50 dark:hover:bg-slate-850/40 transition-colors text-slate-700 dark:text-slate-350 ${
                        isChecked ? 'bg-violet-50/30 dark:bg-violet-955/5' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => handleSelectOne(product.sku, e.target.checked)}
                          className="w-4 h-4 text-violet-655 bg-slate-50 border-slate-255 dark:border-slate-805 rounded focus:ring-violet-505 cursor-pointer"
                        />
                      </td>

                      {/* SKU */}
                      <td className="py-3.5 px-4 font-mono text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {product.sku}
                      </td>

                      {/* Product Name */}
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-850 dark:text-slate-205 block">
                          {product.name}
                        </span>
                        {isOutOfStock ? (
                          <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wide">Out of Stock</span>
                        ) : isLowStock ? (
                          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wide">Low Stock Alert</span>
                        ) : null}
                      </td>

                      {/* Category Badge */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-605 dark:text-slate-300">
                          {product.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 text-right font-bold text-slate-900 dark:text-white">
                        ${product.price.toFixed(2)}
                      </td>

                      {/* Stock Quantity Adjustment */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex items-center space-x-2.5">
                          <button
                            onClick={() => adjustStock(product.sku, -1)}
                            disabled={product.stock <= 0}
                            title="Subtract 1 unit"
                            className="p-1 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-955/20 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition-all cursor-pointer"
                          >
                            <MinusCircle className="w-5 h-5" />
                          </button>
                          
                          <span className={`w-12 text-center font-mono font-bold text-sm ${
                            isOutOfStock ? 'text-rose-605 dark:text-rose-400' : isLowStock ? 'text-amber-550 dark:text-amber-400' : 'text-slate-805 dark:text-slate-200'
                          }`}>
                            {product.stock}
                          </span>

                          <button
                            onClick={() => adjustStock(product.sku, 1)}
                            title="Add 1 unit"
                            className="p-1 rounded-full text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-955/20 transition-all cursor-pointer"
                          >
                            <PlusCircle className="w-5 h-5" />
                          </button>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex items-center justify-center space-x-2.5">
                          <button
                            onClick={() => handleOpenEditProduct(product)}
                            title="Edit Product"
                            className="p-1.5 rounded-lg text-slate-450 hover:text-violet-650 hover:bg-slate-50 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete product "${product.name}"?`)) {
                                deleteProduct(product.sku);
                              }
                            }}
                            title="Delete Product"
                            className="p-1.5 rounded-lg text-slate-455 hover:text-rose-600 hover:bg-slate-50 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
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

      ) : (

        // CARD GRID VIEW LAYOUT
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map((product) => {
            const isChecked = selectedSkus.includes(product.sku);
            const isLowStock = product.stock > 0 && product.stock < lowStockThreshold;
            const isOutOfStock = product.stock === 0;

            return (
              <div 
                key={product.sku}
                className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 relative flex flex-col shadow-sm transition-all hover:-translate-y-0.5 hover:shadow ${
                  isChecked 
                    ? 'border-violet-400 ring-2 ring-violet-500/10' 
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Selection Checkbox */}
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => handleSelectOne(product.sku, e.target.checked)}
                  className="absolute top-4 left-4 w-4.5 h-4.5 text-violet-650 bg-slate-50 border-slate-250 rounded focus:ring-violet-550 cursor-pointer z-10"
                />

                {/* SKU badge & stock pill */}
                <div className="flex items-center justify-between mb-4 pl-7">
                  <span className="font-mono text-xs text-slate-400 font-semibold">{product.sku}</span>
                  
                  <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-md tracking-wider ${
                    isOutOfStock 
                      ? 'bg-rose-50 dark:bg-rose-955/20 text-rose-600 dark:text-rose-400' 
                      : isLowStock 
                      ? 'bg-amber-50 dark:bg-amber-955/20 text-amber-600 dark:text-amber-400' 
                      : 'bg-emerald-50 dark:bg-emerald-955/20 text-emerald-600 dark:text-emerald-455'
                  }`}>
                    {isOutOfStock ? 'Out of Stock' : isLowStock ? 'Low Stock' : 'In Stock'}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-grow">
                  <h3 className="font-bold text-slate-850 dark:text-slate-105 text-base leading-snug">
                    {product.name}
                  </h3>
                  <div className="mt-1 flex items-center space-x-2">
                    <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-655 dark:text-slate-350 px-2.5 py-0.5 rounded-full">
                      {product.category}
                    </span>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4 py-4 my-4 border-y border-slate-100 dark:border-slate-850">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Price</span>
                    <span className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5 block">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Stock Level</span>
                    <span className={`text-base font-bold mt-0.5 block ${
                      isOutOfStock ? 'text-rose-600 dark:text-rose-400' : isLowStock ? 'text-amber-500 dark:text-amber-400' : 'text-slate-855 dark:text-slate-200'
                    }`}>
                      {product.stock} units
                    </span>
                  </div>
                </div>

                {/* Controls (Adjust stock, Edit, Delete) */}
                <div className="flex items-center justify-between">
                  {/* Stock adjuster */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => adjustStock(product.sku, -1)}
                      disabled={product.stock <= 0}
                      className="p-1 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-955/20 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
                    >
                      <MinusCircle className="w-5 h-5" />
                    </button>
                    <span className="text-xs font-mono font-bold text-slate-655 dark:text-slate-350 w-6 text-center">
                      {product.stock}
                    </span>
                    <button
                      onClick={() => adjustStock(product.sku, 1)}
                      className="p-1 rounded-full text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-955/20 transition-colors cursor-pointer"
                    >
                      <PlusCircle className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleOpenEditProduct(product)}
                      className="p-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-xl text-slate-500 dark:text-slate-400 transition-colors"
                      title="Edit Product"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete product "${product.name}"?`)) {
                          deleteProduct(product.sku);
                        }
                      }}
                      className="p-2 border border-slate-200 dark:border-slate-855 hover:bg-slate-55/60 dark:hover:bg-rose-955/20 rounded-xl text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      )}

      {/* Product Add/Edit Modal */}
      <ProductModal 
        isOpen={isProductModalOpen} 
        onClose={() => setIsProductModalOpen(false)}
        productToEdit={productToEdit}
      />

      {/* Category Creation Modal */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
      />

    </div>
  );
}
