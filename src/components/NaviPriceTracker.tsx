import React, { useState } from 'react';
import { TrendingDown, Bell, Check, ShoppingBag, ArrowDownRight, RefreshCw, Sparkles, Filter } from 'lucide-react';
import { useGrocery } from '../context/GroceryContext';

export const NaviPriceTracker: React.FC = () => {
  const {
    items,
    trackedItemIds,
    togglePriceAlert,
    addToCart,
    setActiveProductModal,
    simulateNaviPriceDropEvent,
  } = useGrocery();

  const [activeFilter, setActiveFilter] = useState<'all' | 'drops-today' | 'my-tracked'>('all');

  const filteredItems = items.filter((item) => {
    if (activeFilter === 'drops-today') {
      return (item.priceDropPercentage || 0) > 0;
    }
    if (activeFilter === 'my-tracked') {
      return trackedItemIds.includes(item.id);
    }
    return true;
  });

  const totalDropsToday = items.filter((i) => (i.priceDropPercentage || 0) > 0).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title & Description */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
            <span>Kabirkrupa Daily Mandi Intelligence</span>
            <span aria-hidden="true">·</span>
            <span>Real-time Wholesale to Retail Rate Pass</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 font-display">
            Navi Price Tracking
          </h1>
          <p className="text-sm text-stone-600 mt-1 max-w-2xl">
            In Gujarati & Hindi, &ldquo;Navi&rdquo; signifies fresh daily rates. We monitor agricultural APMC mandis daily and reduce retail prices immediately when wholesale supplies drop. Subscribe to alerts to catch drops instantly.
          </p>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-3">
          <button
            onClick={simulateNaviPriceDropEvent}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-emerald-950 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Simulate Live Price Drop</span>
          </button>
        </div>
      </div>

      {/* Metric Summaries (No floating pill clouds, clean editorial boxes) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-xs text-stone-500">Active Price Drops Today</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-emerald-800 font-mono-numbers">
              {totalDropsToday} items
            </span>
            <span className="text-xs text-emerald-700 font-medium">Lower than yesterday</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-xs text-stone-500">Your Tracked Subscriptions</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-stone-900 font-mono-numbers">
              {trackedItemIds.length} items
            </span>
            <span className="text-xs text-stone-500">Alerts enabled</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-xs text-stone-500">Top Rebate Category</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-amber-900 font-display">
              Pulses & Ghee
            </span>
            <span className="text-xs text-stone-500">Up to -10.9% off</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs (Functional segmented controls) */}
      <div className="flex items-center gap-2 mb-6 p-1 bg-stone-100 rounded-lg w-fit">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-white text-stone-900 shadow-xs font-semibold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          All Catalog Items ({items.length})
        </button>
        <button
          onClick={() => setActiveFilter('drops-today')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            activeFilter === 'drops-today'
              ? 'bg-white text-stone-900 shadow-xs font-semibold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Today&apos;s Price Drops ({totalDropsToday})
        </button>
        <button
          onClick={() => setActiveFilter('my-tracked')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            activeFilter === 'my-tracked'
              ? 'bg-white text-stone-900 shadow-xs font-semibold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          My Tracked Items ({trackedItemIds.length})
        </button>
      </div>

      {/* Navi Price Table / Cards List */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50 text-stone-500 text-xs font-medium border-b border-stone-200">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Grocery Item & Origin</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4 text-right">Yesterday Rate</th>
                <th className="py-3.5 px-4 text-right">Today&apos;s Navi Price</th>
                <th className="py-3.5 px-4 text-right">Mandi Trend</th>
                <th className="py-3.5 px-4 text-center">Price Notification</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredItems.map((item) => {
                const isTracked = trackedItemIds.includes(item.id);
                const hasDrop = (item.priceDropPercentage || 0) > 0;
                const savingsAmount = item.previousPrice - item.currentPrice;

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-stone-50/80 transition-colors group cursor-pointer"
                    onClick={() => setActiveProductModal(item)}
                  >
                    {/* Item Name */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="font-semibold text-stone-900 group-hover:text-emerald-950">
                        {item.name}
                      </div>
                      <div className="text-xs text-stone-500">
                        {item.localName} · {item.unit} · {item.origin}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4 text-xs text-stone-600">
                      {item.category}
                    </td>

                    {/* Previous Price */}
                    <td className="py-4 px-4 text-right font-mono-numbers text-stone-400">
                      ₹{item.previousPrice}
                    </td>

                    {/* Today's Price */}
                    <td className="py-4 px-4 text-right">
                      <span className="font-mono-numbers font-bold text-stone-900 text-base">
                        ₹{item.currentPrice}
                      </span>
                    </td>

                    {/* Mandi Trend */}
                    <td className="py-4 px-4 text-right">
                      {hasDrop ? (
                        <div className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                          <ArrowDownRight className="w-3.5 h-3.5 text-emerald-700" />
                          <span>-₹{savingsAmount} (-{item.priceDropPercentage}%)</span>
                        </div>
                      ) : (
                        <span className="text-xs text-stone-400">Steady</span>
                      )}
                    </td>

                    {/* Alert toggle */}
                    <td
                      className="py-4 px-4 text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => togglePriceAlert(item.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                          isTracked
                            ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                            : 'text-stone-500 hover:text-stone-800 hover:bg-stone-100'
                        }`}
                      >
                        {isTracked ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-amber-800" />
                            <span>Tracking On</span>
                          </>
                        ) : (
                          <>
                            <Bell className="w-3.5 h-3.5" />
                            <span>Set Alert</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Add to bag action */}
                    <td
                      className="py-4 px-4 sm:px-6 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => addToCart(item, 1)}
                        disabled={item.stockCount === 0}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer shadow-2xs disabled:opacity-50"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredItems.length === 0 && (
          <div className="p-8 text-center text-stone-500 text-sm">
            No items matching the selected filter.
          </div>
        )}
      </div>

      {/* Info card at bottom */}
      <div className="mt-6 p-4 bg-stone-100/70 border border-stone-200 rounded-xl text-xs text-stone-600 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-800 shrink-0" />
          <span>
            How Navi Price Works: Mandi auction bids are logged between 06:00 and 08:30 AM each morning. Prices are updated directly at Kabirkrupa counter and app.
          </span>
        </div>
        <span className="text-stone-500 shrink-0 font-mono-numbers">Next scheduled update: Tomorrow 08:30 AM</span>
      </div>
    </div>
  );
};
