import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useInventory } from '../context/InventoryContext';
import { 
  BarChart3, 
  Package2, 
  History, 
  Sun, 
  Moon, 
  Menu, 
  X,
  AlertTriangle,
  ArrowRightLeft
} from 'lucide-react';

export default function Sidebar() {
  const { toggleTheme, isDark } = useTheme();
  const { products } = useInventory();
  const [isOpen, setIsOpen] = useState(false);

  // Check low stock count for alert badge
  const lowStockCount = products.filter(p => p.stock < 10).length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, path: '/dashboard' },
    { id: 'products', label: 'Products Catalog', icon: Package2, badge: products.length, path: '/products' },
    { id: 'stock-control', label: 'Stock Control', icon: ArrowRightLeft, path: '/stock-control' },
    { id: 'history', label: 'Activity Logs', icon: History, path: '/history' },
  ];

  return (
    <>
      {/* Mobile Top Navbar Header */}
      <header className="lg:hidden flex items-center justify-between px-5 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 z-35 sticky top-0">
        <div className="flex items-center space-x-3.5">
          <div className="p-2 bg-gradient-to-tr from-violet-600 to-indigo-650 rounded-xl text-white shadow-md shadow-violet-500/20">
            <Package2 className="w-5.5 h-5.5" />
          </div>
          <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-violet-650 to-indigo-600 dark:from-violet-400 dark:to-indigo-300 bg-clip-text text-transparent">
            Stockflow
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Theme switcher on mobile header */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Sidebar Drawer Backdrop (Mobile) */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-xs z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between py-6 px-4 z-50 transform lg:transform-none lg:sticky lg:top-0 lg:h-screen transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-8">
          {/* Logo Brand Header (Desktop) */}
          <div className="hidden lg:flex items-center space-x-3.5 px-3">
            <div className="p-2.5 bg-gradient-to-tr from-violet-600 to-indigo-650 rounded-xl text-white shadow-md shadow-violet-500/20">
              <Package2 className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-violet-650 to-indigo-600 dark:from-violet-400 dark:to-indigo-305 bg-clip-text text-transparent block">
                Stockflow
              </span>
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest block -mt-0.5">
                v1.0.0 (Local)
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              
              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-violet-55/75 dark:bg-violet-955/20 text-violet-700 dark:text-violet-400 border border-violet-100/50 dark:border-violet-900/30'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-105 dark:hover:bg-slate-850/60 border border-transparent'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center space-x-3">
                        <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-violet-650 dark:text-violet-405' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className={`px-2 py-0.5 text-xs font-bold rounded-md ${
                          isActive 
                            ? 'bg-violet-150/70 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-550 dark:text-slate-400'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer (Theme Switcher / Stock Alerts) */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-850">
          
          {/* Low Stock Banner Warning */}
          {lowStockCount > 0 && (
            <div className="p-3 bg-amber-50 dark:bg-amber-955/15 rounded-xl border border-amber-100/60 dark:border-amber-900/30 flex items-start space-x-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-550 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wide block">Low Stock Alert</span>
                <span className="text-xs text-amber-705 dark:text-amber-300/80 leading-normal block mt-0.5">
                  {lowStockCount} item{lowStockCount > 1 ? 's are' : ' is'} running low.
                </span>
              </div>
            </div>
          )}

          {/* Theme switcher (Desktop) */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-650 hover:text-slate-905 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-850/60 transition-all cursor-pointer border border-transparent"
          >
            <div className="flex items-center space-x-3">
              {isDark ? (
                <>
                  <Sun className="w-4.5 h-4.5 text-slate-450" />
                  <span>Light Theme</span>
                </>
              ) : (
                <>
                  <Moon className="w-4.5 h-4.5 text-slate-450" />
                  <span>Dark Theme</span>
                </>
              )}
            </div>
            
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {isDark ? 'Dark' : 'Light'}
            </span>
          </button>

        </div>
      </aside>
    </>
  );
}
