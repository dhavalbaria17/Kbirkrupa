import React, { useState } from 'react';
import { X, SlidersHorizontal, RefreshCw, TrendingDown, Package, Bike, CheckCircle2 } from 'lucide-react';
import { useGrocery } from '../context/GroceryContext';

export const StoreManagerModal: React.FC = () => {
  const {
    isStoreManagerOpen,
    setIsStoreManagerOpen,
    items,
    orders,
    updateItemStock,
    updateItemPrice,
    advanceOrderStatus,
    simulateQuickInventoryEvent,
    simulateNaviPriceDropEvent,
  } = useGrocery();

  const [selectedItemId, setSelectedItemId] = useState<string>(items[0]?.id || '');
  const [newStockInput, setNewStockInput] = useState<string>('25');
  const [newPriceInput, setNewPriceInput] = useState<string>('850');
  const [priceNote, setPriceNote] = useState<string>('Navi APMC Mandi Auction Adjustment');

  if (!isStoreManagerOpen) return null;

  const currentItem = items.find((i) => i.id === selectedItemId);

  const handleStockUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentItem) return;
    const stock = parseInt(newStockInput);
    if (!isNaN(stock) && stock >= 0) {
      updateItemStock(currentItem.id, stock, `Manager manual adjustment for ${currentItem.name}`);
    }
  };

  const handlePriceUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentItem) return;
    const price = parseFloat(newPriceInput);
    if (!isNaN(price) && price > 0) {
      updateItemPrice(currentItem.id, price, priceNote);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs"
      onClick={() => setIsStoreManagerOpen(false)}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone-200 sticky top-0 bg-white/95 backdrop-blur-xs z-10">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-emerald-900" />
            <div>
              <h2 className="text-lg font-bold text-stone-900 font-display">
                Store Operations &amp; Real-Time Simulator
              </h2>
              <div className="text-xs text-stone-500">
                Kabirkrupa Grocery Counter Controls · Test instant reactive state
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsStoreManagerOpen(false)}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg cursor-pointer"
            aria-label="Close manager"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-6 text-xs text-stone-700">
          
          {/* Quick Simulation Actions Banner */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-xl space-y-2">
            <span className="font-bold text-emerald-950 block text-xs">
              ⚡ Instant Simulation Triggers
            </span>
            <p className="text-[11px] text-emerald-900/80">
              Click these triggers to immediately test the real-time notification engine and dynamic UI updates without manual form entry:
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={simulateNaviPriceDropEvent}
                className="px-3 py-1.5 bg-emerald-800 text-white rounded-lg font-medium hover:bg-emerald-900 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <TrendingDown className="w-3.5 h-3.5" />
                <span>Simulate Navi Price Drop &amp; Alert</span>
              </button>
              <button
                type="button"
                onClick={simulateQuickInventoryEvent}
                className="px-3 py-1.5 bg-white text-emerald-950 border border-emerald-300 rounded-lg font-medium hover:bg-emerald-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Simulate Store Shelf Sale / Restock</span>
              </button>
            </div>
          </div>

          {/* Item Selector */}
          <div>
            <label className="block font-semibold text-stone-900 mb-1.5">
              Select Grocery SKU to Manage:
            </label>
            <select
              value={selectedItemId}
              onChange={(e) => {
                setSelectedItemId(e.target.value);
                const itm = items.find((i) => i.id === e.target.value);
                if (itm) {
                  setNewStockInput(itm.stockCount.toString());
                  setNewPriceInput(itm.currentPrice.toString());
                }
              }}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 text-xs font-medium focus:bg-white focus:ring-1 focus:ring-emerald-800"
            >
              {items.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name} ({i.unit}) — Current: ₹{i.currentPrice} | Stock: {i.stockCount}
                </option>
              ))}
            </select>
          </div>

          {currentItem && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Real-time stock adjuster */}
              <form onSubmit={handleStockUpdate} className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-emerald-800" />
                  <span className="font-bold text-stone-900">Adjust Shelf Stock</span>
                </div>
                <div className="text-[11px] text-stone-500">
                  Current physical count: <strong>{currentItem.stockCount} units</strong>
                </div>

                <div>
                  <label className="block text-[11px] text-stone-600 mb-1">New Physical Stock Count</label>
                  <input
                    type="number"
                    min="0"
                    value={newStockInput}
                    onChange={(e) => setNewStockInput(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg font-mono-numbers text-stone-900 text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-medium transition-colors cursor-pointer"
                >
                  Commit Real-Time Stock
                </button>
              </form>

              {/* Real-time price adjuster */}
              <form onSubmit={handlePriceUpdate} className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-emerald-800" />
                  <span className="font-bold text-stone-900">Adjust Navi Price</span>
                </div>
                <div className="text-[11px] text-stone-500">
                  Current selling rate: <strong>₹{currentItem.currentPrice}</strong>
                </div>

                <div>
                  <label className="block text-[11px] text-stone-600 mb-1">New Selling Price (₹)</label>
                  <input
                    type="number"
                    min="1"
                    value={newPriceInput}
                    onChange={(e) => setNewPriceInput(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg font-mono-numbers text-stone-900 text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-emerald-900 hover:bg-emerald-800 text-white rounded-lg font-medium transition-colors cursor-pointer"
                >
                  Broadcast Navi Price Update
                </button>
              </form>
            </div>
          )}

          {/* Active Orders Status Management */}
          <div className="border-t border-stone-200 pt-5">
            <div className="flex items-center gap-2 mb-3">
              <Bike className="w-4 h-4 text-emerald-800" />
              <h3 className="font-bold text-stone-900 text-xs uppercase tracking-wider">
                Active Local Delivery Orders Progress
              </h3>
            </div>

            <div className="space-y-2">
              {orders.slice(0, 3).map((ord) => (
                <div
                  key={ord.id}
                  className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex flex-wrap items-center justify-between gap-3"
                >
                  <div>
                    <span className="font-bold text-stone-900">{ord.orderNumber}</span>
                    <span className="text-stone-500 ml-2">({ord.address.fullName} · ₹{ord.total})</span>
                    <div className="text-[11px] text-stone-400">
                      Status: <strong className="text-emerald-900 uppercase">{ord.status.replace('_', ' ')}</strong>
                    </div>
                  </div>

                  {ord.status !== 'delivered' && (
                    <button
                      type="button"
                      onClick={() => advanceOrderStatus(ord.id)}
                      className="px-3 py-1.5 bg-stone-900 text-white hover:bg-stone-800 rounded-lg text-xs font-medium cursor-pointer flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Advance to Next Delivery Stage</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
