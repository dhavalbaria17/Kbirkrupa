import React, { useState } from 'react';
import { Package, Activity, RefreshCw, AlertTriangle, CheckCircle2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useGrocery } from '../context/GroceryContext';

export const LiveInventoryPanel: React.FC = () => {
  const { items, inventoryLogs, simulateQuickInventoryEvent, updateItemStock } = useGrocery();
  const [filter, setFilter] = useState<'all' | 'low' | 'adequate'>('all');

  const lowStockItems = items.filter((i) => i.stockCount <= i.minStockThreshold);
  const totalStockUnits = items.reduce((sum, i) => sum + i.stockCount, 0);

  const displayedItems = items.filter((item) => {
    if (filter === 'low') return item.stockCount <= item.minStockThreshold;
    if (filter === 'adequate') return item.stockCount > item.minStockThreshold;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
            <span>Kabirkrupa Shop Floor Live Feed</span>
            <span aria-hidden="true">·</span>
            <span>Real-Time Warehouse & Shelf Sync</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 font-display">
            Real-Time Inventory Status
          </h1>
          <p className="text-sm text-stone-600 mt-1 max-w-2xl">
            Live physical shelf inventory at our Satellite, Ahmedabad store. Every order placed, walk-in counter billing, or morning supplier batch modifies stock counts in real time.
          </p>
        </div>

        <button
          onClick={simulateQuickInventoryEvent}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-emerald-950 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors cursor-pointer self-start md:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Simulate Stock Change</span>
        </button>
      </div>

      {/* Status metric blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs">
          <div className="text-xs text-stone-500 mb-1">Total Stock in Store</div>
          <div className="text-2xl font-bold text-stone-900 font-mono-numbers">
            {totalStockUnits} units
          </div>
          <div className="text-xs text-stone-500 mt-1">Across 12 staple grocery lines</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs">
          <div className="text-xs text-stone-500 mb-1">Items Needing Restock</div>
          <div className="text-2xl font-bold text-amber-700 font-mono-numbers">
            {lowStockItems.length} items
          </div>
          <div className="text-xs text-stone-500 mt-1">Below minimum shelf safety threshold</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs">
          <div className="text-xs text-stone-500 mb-1">Sync Latency</div>
          <div className="text-2xl font-bold text-emerald-800 font-mono-numbers">
            &lt; 150 ms
          </div>
          <div className="text-xs text-stone-500 mt-1">Instant counter register synchronization</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Live Stock Table */}
        <div className="lg:col-span-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  filter === 'all'
                    ? 'bg-white text-stone-900 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                All Items ({items.length})
              </button>
              <button
                onClick={() => setFilter('low')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  filter === 'low'
                    ? 'bg-white text-stone-900 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Low Stock ({lowStockItems.length})
              </button>
              <button
                onClick={() => setFilter('adequate')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  filter === 'adequate'
                    ? 'bg-white text-stone-900 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Healthy Stock ({items.length - lowStockItems.length})
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-stone-50 text-stone-500 text-xs font-medium border-b border-stone-200">
                  <tr>
                    <th className="py-3 px-4">Grocery SKU</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4 text-center">Shelf Stock</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Quick Restock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {displayedItems.map((item) => {
                    const isLow = item.stockCount <= item.minStockThreshold;
                    const isOut = item.stockCount === 0;

                    return (
                      <tr key={item.id} className="hover:bg-stone-50/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-stone-900 text-sm">{item.name}</div>
                          <div className="text-xs text-stone-500">{item.localName} · {item.unit}</div>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-stone-600">
                          {item.category}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="font-mono-numbers font-bold text-stone-900 text-base">
                            {item.stockCount}
                          </span>
                          <span className="text-[11px] text-stone-400 block font-mono-numbers">
                            Min: {item.minStockThreshold}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          {isOut ? (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              <span>Sold Out</span>
                            </span>
                          ) : isLow ? (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              <span>Low Stock Attention</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>In Stock</span>
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => updateItemStock(item.id, item.stockCount + 15, 'Direct supplier batch unloading')}
                            className="px-2.5 py-1 text-xs font-medium text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors cursor-pointer"
                          >
                            +15 Restock
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Live Inventory Activity Log */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs sticky top-20">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-800" />
                <h3 className="text-sm font-bold text-stone-900 font-display">
                  Live Stock Event Feed
                </h3>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <p className="text-xs text-stone-500 mb-4">
              Real-time audit trail of purchases, counter sales, and restock batches.
            </p>

            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {inventoryLogs.map((log) => {
                const isRestock = log.type === 'stock_restock';
                const isPrice = log.type === 'price_update';

                return (
                  <div
                    key={log.id}
                    className="p-3 rounded-lg border border-stone-100 bg-stone-50/70 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-stone-900 truncate max-w-[180px]">
                        {log.itemName}
                      </span>
                      <span className="text-[11px] text-stone-400 font-mono-numbers">
                        {log.timestamp}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-stone-700">
                      {isRestock ? (
                        <ArrowUpRight className="w-3.5 h-3.5 text-emerald-700" />
                      ) : isPrice ? (
                        <ArrowDownRight className="w-3.5 h-3.5 text-amber-700" />
                      ) : (
                        <ArrowDownRight className="w-3.5 h-3.5 text-rose-600" />
                      )}

                      <span className="font-medium font-mono-numbers">
                        {isPrice ? `₹${log.oldVal} → ₹${log.newVal}` : `${log.oldVal} → ${log.newVal} units`}
                      </span>
                    </div>

                    <p className="text-[11px] text-stone-500 leading-tight">
                      {log.note}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
