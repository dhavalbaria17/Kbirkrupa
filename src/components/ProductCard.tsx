import React from 'react';
import { Plus, Minus, Bell, TrendingDown, Eye, Check } from 'lucide-react';
import { GroceryItem } from '../types/grocery';
import { useGrocery } from '../context/GroceryContext';

interface ProductCardProps {
  item: GroceryItem;
}

export const ProductCard: React.FC<ProductCardProps> = ({ item }) => {
  const {
    cart,
    addToCart,
    updateCartQuantity,
    togglePriceAlert,
    isItemTracked,
    setActiveProductModal,
  } = useGrocery();

  const cartEntry = cart.find((c) => c.item.id === item.id);
  const qtyInCart = cartEntry ? cartEntry.quantity : 0;
  const isTracked = isItemTracked(item.id);
  const isLowStock = item.stockCount > 0 && item.stockCount <= item.minStockThreshold;
  const isOutOfStock = item.stockCount === 0;

  // Background icon/visual styling based on category
  const renderItemVisual = () => {
    return (
      <div
        className="w-full h-44 rounded-t-xl flex flex-col items-center justify-center p-4 relative overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]"
        style={{
          background: `radial-gradient(circle at 50% 40%, ${item.colorTone}18 0%, #F5F5F3 80%)`,
        }}
      >
        {/* Decorative corner accent */}
        <div
          className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full opacity-10 pointer-events-none"
          style={{ backgroundColor: item.colorTone }}
        />

        {/* Category-based emblem */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-xs mb-2 transition-transform duration-300 group-hover:scale-110"
          style={{ backgroundColor: `${item.colorTone}22`, color: item.colorTone }}
        >
          <span className="text-2xl font-bold font-display select-none">
            {item.name.charAt(0)}
          </span>
        </div>

        {/* Local Gujarati Name Tag */}
        <div className="text-xs font-medium text-stone-700 max-w-full truncate px-2 text-center">
          {item.localName}
        </div>

        {/* Quick View Button on hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setActiveProductModal(item);
          }}
          className="absolute top-2.5 right-2.5 p-1.5 bg-white/90 hover:bg-white text-stone-700 hover:text-stone-900 rounded-lg shadow-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          title="Inspect Item & 30-Day Price Trend"
        >
          <Eye className="w-4 h-4" />
        </button>

        {/* Navi Price Drop Text Indicator */}
        {item.priceDropPercentage && item.priceDropPercentage > 0 && (
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-white/95 border border-emerald-200 px-2 py-0.5 rounded-md text-[11px] font-medium text-emerald-800 shadow-2xs">
            <TrendingDown className="w-3 h-3 text-emerald-700" />
            <span>-{item.priceDropPercentage}% Navi Drop</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      onClick={() => setActiveProductModal(item)}
      className="group bg-white rounded-xl border border-stone-200/90 hover:border-stone-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer overflow-hidden"
    >
      <div>
        {renderItemVisual()}

        <div className="p-4">
          {/* Metadata: Category and origin with clean typographic separator - Zero Pill rule */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1.5 truncate">
            <span>{item.category}</span>
            <span aria-hidden="true">·</span>
            <span>{item.unit}</span>
            {item.isOrganic && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-700 font-medium">Organic</span>
              </>
            )}
          </div>

          {/* Product Name */}
          <h3 className="text-base font-semibold text-stone-900 group-hover:text-emerald-950 transition-colors line-clamp-1 mb-1">
            {item.name}
          </h3>

          {/* Real-time stock status */}
          <div className="text-xs mb-3 flex items-center gap-1.5">
            {isOutOfStock ? (
              <span className="text-rose-600 font-medium">Out of Stock · Restocking tomorrow</span>
            ) : isLowStock ? (
              <span className="text-amber-700 font-medium">Only {item.stockCount} units on shelf</span>
            ) : (
              <span className="text-stone-500">In Stock · {item.stockCount} units live</span>
            )}
          </div>

          {/* Price lockup */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-lg font-bold text-stone-900 font-mono-numbers">
              ₹{item.currentPrice}
            </span>
            {item.previousPrice > item.currentPrice && (
              <span className="text-xs text-stone-400 line-through font-mono-numbers">
                ₹{item.previousPrice}
              </span>
            )}
            <span className="text-[11px] text-stone-400">
              MRP ₹{item.mrp}
            </span>
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div
        className="px-4 pb-4 pt-1 flex items-center justify-between gap-2 border-t border-stone-100 bg-stone-50/50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Navi Price Tracker Toggle Button */}
        <button
          onClick={() => togglePriceAlert(item.id)}
          className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer ${
            isTracked
              ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
              : 'text-stone-500 hover:text-stone-800 hover:bg-stone-200/60'
          }`}
          title={isTracked ? 'Alert active: tracking price drops' : 'Track Navi price drops'}
        >
          {isTracked ? (
            <>
              <Check className="w-3.5 h-3.5 text-amber-800" />
              <span className="hidden sm:inline">Tracking</span>
            </>
          ) : (
            <>
              <Bell className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Track Price</span>
            </>
          )}
        </button>

        {/* Add to Cart or Stepper */}
        {isOutOfStock ? (
          <button
            disabled
            className="px-3 py-1.5 text-xs font-medium text-stone-400 bg-stone-100 rounded-lg cursor-not-allowed"
          >
            Sold Out
          </button>
        ) : qtyInCart > 0 ? (
          <div className="flex items-center gap-2 bg-emerald-900 text-white rounded-lg px-2 py-1 shadow-xs">
            <button
              onClick={() => updateCartQuantity(item.id, qtyInCart - 1)}
              className="p-1 hover:bg-emerald-800 rounded-sm cursor-pointer transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono-numbers text-xs font-semibold px-1">
              {qtyInCart}
            </span>
            <button
              onClick={() => updateCartQuantity(item.id, qtyInCart + 1)}
              disabled={qtyInCart >= item.stockCount}
              className="p-1 hover:bg-emerald-800 rounded-sm cursor-pointer transition-colors disabled:opacity-40"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => addToCart(item, 1)}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-emerald-900 hover:bg-emerald-800 rounded-lg transition-colors cursor-pointer shadow-xs whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        )}
      </div>
    </div>
  );
};
