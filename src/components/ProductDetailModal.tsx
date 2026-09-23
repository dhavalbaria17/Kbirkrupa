import React, { useState } from 'react';
import { X, TrendingDown, Bell, Check, ShoppingBag, ShieldCheck, MapPin, Calendar, Clock } from 'lucide-react';
import { GroceryItem } from '../types/grocery';
import { useGrocery } from '../context/GroceryContext';

interface ProductDetailModalProps {
  item: GroceryItem | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ item, onClose }) => {
  const { addToCart, updateCartQuantity, cart, togglePriceAlert, isItemTracked } = useGrocery();
  const [customAlertPrice, setCustomAlertPrice] = useState<string>('');
  const [alertSavedFeedback, setAlertSavedFeedback] = useState(false);

  if (!item) return null;

  const isTracked = isItemTracked(item.id);
  const cartEntry = cart.find((c) => c.item.id === item.id);
  const qtyInCart = cartEntry ? cartEntry.quantity : 0;

  // Calculate price graph points for SVG rendering
  const minPrice = Math.min(...item.priceHistory.map((p) => p.price)) * 0.95;
  const maxPrice = Math.max(...item.priceHistory.map((p) => p.price)) * 1.05;
  const priceRange = maxPrice - minPrice || 1;

  const handleSetAlert = () => {
    const val = parseFloat(customAlertPrice);
    if (!isNaN(val) && val > 0) {
      togglePriceAlert(item.id, val);
      setAlertSavedFeedback(true);
      setTimeout(() => setAlertSavedFeedback(false), 2000);
    } else {
      togglePriceAlert(item.id);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-stone-100 sticky top-0 bg-white/95 backdrop-blur-xs z-10">
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-500 mb-0.5">
              <span>{item.category}</span>
              <span aria-hidden="true">·</span>
              <span>{item.unit}</span>
            </div>
            <h2 className="text-xl font-bold text-stone-900">{item.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-6">
          
          {/* Top Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
            {/* Visual Box */}
            <div
              className="w-full h-52 rounded-xl flex flex-col items-center justify-center relative p-6 border border-stone-200/60"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${item.colorTone}15 0%, #FAFAF8 100%)`,
              }}
            >
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-xs mb-3 text-3xl font-bold font-display"
                style={{ backgroundColor: `${item.colorTone}25`, color: item.colorTone }}
              >
                {item.name.charAt(0)}
              </div>
              <div className="text-sm font-semibold text-stone-800 text-center">
                {item.localName}
              </div>
              <div className="text-xs text-stone-500 mt-1">
                Authentic Kabirkrupa Stock
              </div>
            </div>

            {/* Quick Pricing & Stock Card */}
            <div className="space-y-4">
              <div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-bold text-stone-900 font-mono-numbers">
                    ₹{item.currentPrice}
                  </span>
                  {item.previousPrice > item.currentPrice && (
                    <span className="text-sm text-stone-400 line-through font-mono-numbers">
                      ₹{item.previousPrice}
                    </span>
                  )}
                  <span className="text-xs text-stone-500 font-mono-numbers">
                    (MRP ₹{item.mrp})
                  </span>
                </div>
                <p className="text-xs text-emerald-800 font-medium">
                  {item.priceDropPercentage ? `Save ₹${item.previousPrice - item.currentPrice} (${item.priceDropPercentage}%) with current Mandi rates` : 'Fair local pricing guaranteed'}
                </p>
              </div>

              {/* Real-time Shelf Stock */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 text-xs space-y-1">
                <div className="flex items-center justify-between text-stone-700">
                  <span className="font-medium">Current Shelf Stock:</span>
                  <span className="font-mono-numbers font-semibold">
                    {item.stockCount} units available
                  </span>
                </div>
                <div className="flex items-center justify-between text-stone-500 text-[11px]">
                  <span>Procurement Threshold:</span>
                  <span>Min {item.minStockThreshold} units</span>
                </div>
                <div className="w-full bg-stone-200 rounded-full h-1.5 mt-1 overflow-hidden">
                  <div
                    className="bg-emerald-700 h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, (item.stockCount / 50) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Purchase Actions */}
              <div className="pt-2 flex items-center gap-3">
                {qtyInCart > 0 ? (
                  <div className="flex-1 flex items-center justify-between bg-emerald-900 text-white rounded-xl px-4 py-2.5">
                    <span className="text-xs">In Bag:</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateCartQuantity(item.id, qtyInCart - 1)}
                        className="px-2 py-0.5 text-base font-bold hover:bg-emerald-800 rounded-md cursor-pointer"
                      >
                        -
                      </button>
                      <span className="font-mono-numbers font-bold text-sm">{qtyInCart}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id, qtyInCart + 1)}
                        disabled={qtyInCart >= item.stockCount}
                        className="px-2 py-0.5 text-base font-bold hover:bg-emerald-800 rounded-md cursor-pointer disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => addToCart(item, 1)}
                    disabled={item.stockCount === 0}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-emerald-900 hover:bg-emerald-800 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{item.stockCount === 0 ? 'Sold Out' : `Add ${item.unit} to Bag`}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Description & Origin Attributes */}
          <div className="border-t border-stone-100 pt-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
              Item Details & Purity
            </h4>
            <p className="text-sm text-stone-700 leading-relaxed mb-4">
              {item.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-100">
                <div className="flex items-center gap-1.5 text-stone-500 mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Origin</span>
                </div>
                <span className="font-medium text-stone-900">{item.origin}</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-100">
                <div className="flex items-center gap-1.5 text-stone-500 mb-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Shelf Life</span>
                </div>
                <span className="font-medium text-stone-900">{item.shelfLife}</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-100 col-span-2 sm:col-span-1">
                <div className="flex items-center gap-1.5 text-stone-500 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Quality Batch</span>
                </div>
                <span className="font-medium text-stone-900">Lab Tested / Pure</span>
              </div>
            </div>
          </div>

          {/* Navi Price Tracking & 14-Day Mandi Price Chart */}
          <div className="border-t border-stone-100 pt-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-emerald-800" />
                <h4 className="text-sm font-bold text-stone-900 font-display">
                  Navi Price Tracking History
                </h4>
              </div>
              <span className="text-xs text-stone-500">
                Daily Mandi Procurement Fluctuations
              </span>
            </div>

            {/* Price Chart SVG Visualizer */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
              <div className="h-32 w-full flex items-end justify-between gap-2 pt-6 pb-2 px-2">
                {item.priceHistory.map((point, idx) => {
                  const heightPct = Math.max(15, Math.min(95, ((point.price - minPrice) / priceRange) * 100));
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                      <span className="text-[10px] font-mono-numbers text-stone-600 font-semibold group-hover:text-emerald-800">
                        ₹{point.price}
                      </span>
                      <div
                        className="w-full max-w-[28px] bg-emerald-800 group-hover:bg-emerald-700 rounded-t-sm transition-all"
                        style={{ height: `${heightPct}%` }}
                      />
                      <span className="text-[10px] text-stone-500 truncate w-full text-center">
                        {point.date}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Price Notes */}
              <div className="mt-3 pt-3 border-t border-stone-200/60 text-xs text-stone-600 flex items-center justify-between">
                <span>
                  Latest Note: <span className="text-stone-800 font-medium">{item.priceHistory[item.priceHistory.length - 1]?.note || 'Steady wholesale trading rates'}</span>
                </span>
                <span className="text-emerald-800 font-semibold font-mono-numbers">
                  Current: ₹{item.currentPrice}
                </span>
              </div>
            </div>

            {/* Set Custom Price Drop Alert */}
            <div className="mt-4 p-4 bg-amber-50/60 border border-amber-200/80 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Bell className="w-4 h-4 text-amber-800" />
                <span className="text-xs font-bold text-amber-950 font-display">
                  Set Custom Navi Price Notification
                </span>
              </div>
              <p className="text-xs text-amber-900/80 mb-3">
                Get an instant notification on your device when {item.name} drops to or below your desired price.
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-xs text-stone-500 font-mono-numbers">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={customAlertPrice}
                    onChange={(e) => setCustomAlertPrice(e.target.value)}
                    placeholder={`e.g. ${Math.round(item.currentPrice * 0.9)}`}
                    className="w-32 pl-6 pr-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-mono-numbers text-stone-900 focus:outline-hidden focus:ring-1 focus:ring-emerald-800"
                  />
                </div>

                <button
                  onClick={handleSetAlert}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                    isTracked
                      ? 'bg-amber-800 text-white hover:bg-amber-900'
                      : 'bg-stone-900 text-white hover:bg-stone-800'
                  }`}
                >
                  {isTracked ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Tracking Active (Click to Update)</span>
                    </>
                  ) : (
                    <>
                      <Bell className="w-3.5 h-3.5" />
                      <span>Notify Me on Drop</span>
                    </>
                  )}
                </button>

                {alertSavedFeedback && (
                  <span className="text-xs text-emerald-800 font-medium">
                    ✓ Price alert saved!
                  </span>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
