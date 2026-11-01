import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { Package, DollarSign, AlertTriangle, ShoppingCart, BarChart3 } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';

interface DashboardViewProps {
  onNavigateToProducts: () => void;
}

export default function DashboardView({ onNavigateToProducts }: DashboardViewProps) {
  const { products, categories } = useInventory();

  // Metrics
  const totalProducts = products.length;
  
  const totalValue = products.reduce((acc, curr) => acc + (curr.price * curr.stock), 0);
  
  const lowStockThreshold = 10;
  const lowStockItems = products.filter(p => p.stock > 0 && p.stock < lowStockThreshold);
  const outOfStockItems = products.filter(p => p.stock === 0);

  // Data for Category breakdown
  const categoryStats = categories.map(cat => {
    const catProducts = products.filter(p => p.category === cat);
    const count = catProducts.length;
    const stockSum = catProducts.reduce((acc, p) => acc + p.stock, 0);
    const valueSum = catProducts.reduce((acc, p) => acc + (p.price * p.stock), 0);
    return {
      name: cat,
      value: count, // for PieChart (Product count distribution)
      stock: stockSum,
      valuation: valueSum
    };
  }).filter(c => c.value > 0); // Only show categories with products

  // Data for Stock levels Chart (top 8 products)
  const barChartData = [...products]
    .sort((a, b) => b.stock - a.stock)
    .slice(0, 8)
    .map(p => ({
      name: p.name.length > 15 ? p.name.slice(0, 15) + '...' : p.name,
      stock: p.stock,
      sku: p.sku
    }));

  // Colors for Recharts Pie
  const COLORS = ['#aa3bff', '#06b6d4', '#f59e0b', '#10b981', '#ec4899', '#3b82f6'];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white my-0">
            Analytics Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Real-time aggregate performance metrics and stock distribution analytics.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Products */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center space-x-5">
          <div className="p-3.5 bg-violet-55/75 dark:bg-violet-955/40 text-violet-600 dark:text-violet-400 rounded-xl">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-555 dark:text-slate-400 uppercase tracking-wider">Total Products</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{totalProducts}</h3>
          </div>
        </div>

        {/* Total Value */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center space-x-5">
          <div className="p-3.5 bg-emerald-55/90 dark:bg-emerald-955/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-555 dark:text-slate-400 uppercase tracking-wider">Inventory Value</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
          </div>
        </div>

        {/* Low Stock Items */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center space-x-5">
          <div className="p-3.5 bg-amber-55/95 dark:bg-amber-955/40 text-amber-600 dark:text-amber-400 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-555 dark:text-slate-400 uppercase tracking-wider">Low Stock (&lt;10)</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{lowStockItems.length}</h3>
          </div>
        </div>

        {/* Out of Stock Items */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center space-x-5">
          <div className="p-3.5 bg-rose-55/90 dark:bg-rose-955/40 text-rose-600 dark:text-rose-400 rounded-xl">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-555 dark:text-slate-400 uppercase tracking-wider">Out of Stock</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{outOfStockItems.length}</h3>
          </div>
        </div>

      </div>

      {/* Visual Analytics Charts */}
      {totalProducts === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center shadow-sm">
          <BarChart3 className="w-16 h-16 text-slate-300 dark:text-slate-700 stroke-1" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-4">No Analytics Available</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mt-1">
            Add products to your inventory catalog to see data visualizations.
          </p>
          <button
            onClick={onNavigateToProducts}
            className="mt-5 px-5 py-2.5 bg-violet-650 hover:bg-violet-750 text-white rounded-xl text-sm font-semibold shadow-md transition-all"
          >
            Manage Products
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            
            {/* Stock Level Chart (Bar Chart) */}
            <div className="lg:col-span-3 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-5">
                Top Products by Stock Quantity
              </h3>
              <div className="h-72 w-full flex-grow text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis 
                      dataKey="name" 
                      stroke="#888888" 
                      fontSize={11} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <YAxis 
                      stroke="#888888" 
                      fontSize={11} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--bg-popover)', 
                        borderColor: 'var(--border)',
                        color: 'var(--text)'
                      }} 
                      cursor={{ fill: 'rgba(170, 59, 255, 0.05)' }}
                    />
                    <Bar dataKey="stock" fill="#aa3bff" radius={[4, 4, 0, 0]} maxBarSize={45} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Distribution Chart (Pie Chart) */}
            <div className="lg:col-span-2 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-5">
                Category Distribution (by Product Count)
              </h3>
              <div className="h-72 w-full flex-grow flex items-center justify-center text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryStats}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {categoryStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Category Details Table */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-4">
              Category Valuation &amp; Stock Metrics
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4 text-center">Product Variety</th>
                    <th className="py-3 px-4 text-center">Total Quantity in Stock</th>
                    <th className="py-3 px-4 text-right">Value ($)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-855">
                  {categoryStats.map((cat, idx) => (
                    <tr key={cat.name} className="hover:bg-slate-55/60 dark:hover:bg-slate-855/40 transition-colors text-slate-700 dark:text-slate-350">
                      <td className="py-3.5 px-4 font-semibold text-slate-850 dark:text-slate-200 flex items-center">
                        <span 
                          className="w-2.5 h-2.5 rounded-full mr-2.5" 
                          style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                        />
                        {cat.name}
                      </td>
                      <td className="py-3.5 px-4 text-center font-medium">{cat.value} items</td>
                      <td className="py-3.5 px-4 text-center font-medium">{cat.stock} units</td>
                      <td className="py-3.5 px-4 text-right font-bold text-slate-900 dark:text-white">
                        ${cat.valuation.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
