import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { ArrowDownRight, ArrowUpRight, Search, Calendar, ClipboardList } from 'lucide-react';

export default function StockHistoryView() {
  const { historyLog } = useInventory();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL'); // ALL, INCOMING, OUTGOING

  // Format Date Helper
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  // Filter and Search log
  const filteredLog = historyLog.filter((log) => {
    const matchesSearch =
      log.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.productId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.notes.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filterType === 'ALL' || log.type === filterType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white my-0">
          Stock Activity Log
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Audit trail tracking all incoming restocks and outgoing product dispatches.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
        {/* Search */}
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Product Name, SKU, or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-955/40 text-slate-950 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
          />
        </div>

        {/* Type Select */}
        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-xs font-semibold text-slate-450 dark:text-slate-400 uppercase tracking-wider hidden md:inline">
            Action:
          </span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-955/40 text-slate-950 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all cursor-pointer"
          >
            <option value="ALL">All Activities</option>
            <option value="INCOMING">Restocks (Incoming)</option>
            <option value="OUTGOING">Sales &amp; Dispatches (Outgoing)</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      {filteredLog.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center shadow-sm">
          <ClipboardList className="w-14 h-14 text-slate-350 dark:text-slate-650 stroke-1" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-4">No Activity Recorded</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mt-1">
            {searchQuery || filterType !== 'ALL'
              ? 'No activity logs match your current search queries or filters.'
              : 'Add products or adjust stock quantities to populate this history logs feed.'}
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Date &amp; Time</th>
                  <th className="py-3 px-4">Product Details</th>
                  <th className="py-3 px-4 text-center">Activity</th>
                  <th className="py-3 px-4 text-center">Amount</th>
                  <th className="py-3 px-4 text-center">Stock Shift</th>
                  <th className="py-3 px-4">Log Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-105 divide-slate-100 dark:divide-slate-850">
                {filteredLog.map((log) => {
                  const isIncoming = log.type === 'INCOMING';
                  return (
                    <tr key={log.id} className="hover:bg-slate-55/60 dark:hover:bg-slate-850/40 transition-colors text-slate-700 dark:text-slate-350">
                      
                      {/* Timestamp */}
                      <td className="py-3.5 px-4 font-medium whitespace-nowrap text-slate-605 dark:text-slate-400">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                          <span>{formatDate(log.timestamp)}</span>
                        </div>
                      </td>

                      {/* Product details */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-855 dark:text-slate-202">
                          {log.productName}
                        </div>
                        <div className="text-xs font-mono text-slate-400 mt-0.5">
                          {log.productId}
                        </div>
                      </td>

                      {/* Activity Badge */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold gap-1 ${
                            isIncoming
                              ? 'bg-emerald-55/90 dark:bg-emerald-955/40 text-emerald-700 dark:text-emerald-400'
                              : 'bg-rose-55/90 dark:bg-rose-955/40 text-rose-700 dark:text-rose-450'
                          }`}
                        >
                          {isIncoming ? (
                            <>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                              <span>INCOMING</span>
                            </>
                          ) : (
                            <>
                              <ArrowDownRight className="w-3.5 h-3.5" />
                              <span>OUTGOING</span>
                            </>
                          )}
                        </span>
                      </td>

                      {/* Quantity Change */}
                      <td className={`py-3.5 px-4 text-center font-bold ${
                        isIncoming ? 'text-emerald-600 dark:text-emerald-455' : 'text-rose-600 dark:text-rose-400'
                      }`}>
                        {isIncoming ? '+' : '-'}{log.quantity}
                      </td>

                      {/* Stock Shift (Prev -> New) */}
                      <td className="py-3.5 px-4 text-center text-xs font-mono text-slate-505 dark:text-slate-455">
                        {log.prevStock} &rarr; <span className="font-bold text-slate-705 dark:text-slate-350">{log.newStock}</span>
                      </td>

                      {/* Notes / Remarks */}
                      <td className="py-3.5 px-4 text-slate-505 dark:text-slate-400 italic max-w-xs truncate">
                        {log.notes}
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
