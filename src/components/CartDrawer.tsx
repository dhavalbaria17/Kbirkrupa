import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, Bike, ShieldCheck, ArrowRight, ShoppingBag } from 'lucide-react';
import { useGrocery } from '../context/GroceryContext';
import { CheckoutModal } from './CheckoutModal';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartTotal,
    cartSavings,
    deliverySlots,
    selectedSlot,
    setSelectedSlot,
  } = useGrocery();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  if (!isCartOpen) return null;

  const freeDeliveryThreshold = 499;
  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - cartSubtotal);
  const deliveryProgress = Math.min(100, (cartSubtotal / freeDeliveryThreshold) * 100);

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      >
        <div
          className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl flex flex-col z-50"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-900" />
              <h2 className="text-lg font-bold text-stone-900 font-display">
                Your Grocery Bag
              </h2>
              <span className="text-xs text-stone-500 font-mono-numbers">
                ({cart.reduce((s, i) => s + i.quantity, 0)} items)
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Meter */}
          <div className="bg-emerald-50/70 border-b border-emerald-100/80 px-4 py-3 text-xs">
            <div className="flex items-center justify-between text-emerald-950 font-medium mb-1.5">
              <span>
                {amountNeededForFreeDelivery === 0
                  ? '🎉 You unlocked Free Local Delivery!'
                  : `Add ₹${amountNeededForFreeDelivery} more for Free Local Delivery`}
              </span>
              <span className="font-mono-numbers text-[11px] text-emerald-800">
                ₹{cartSubtotal} / ₹{freeDeliveryThreshold}
              </span>
            </div>
            <div className="w-full bg-emerald-200/60 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-700 h-full rounded-full transition-all duration-300"
                style={{ width: `${deliveryProgress}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="py-16 text-center">
                <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-stone-700 mb-1">Your bag is empty</h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto mb-4">
                  Browse our fresh pulses, cold-pressed oils, and spices with live Navi Mandi pricing.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-4 py-2 bg-emerald-900 text-white text-xs font-semibold rounded-lg hover:bg-emerald-800 transition-colors cursor-pointer"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map(({ item, quantity }) => (
                <div
                  key={item.id}
                  className="p-3 bg-stone-50/70 rounded-xl border border-stone-200/80 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm shrink-0"
                      style={{ backgroundColor: `${item.colorTone}20`, color: item.colorTone }}
                    >
                      {item.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-stone-900 truncate">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-stone-500">
                        {item.unit} · ₹{item.currentPrice} each
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {/* Stepper */}
                    <div className="flex items-center gap-1.5 bg-white border border-stone-200 rounded-lg px-2 py-1 shadow-2xs">
                      <button
                        onClick={() => updateCartQuantity(item.id, quantity - 1)}
                        className="text-stone-500 hover:text-stone-900 cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-mono-numbers font-semibold text-stone-900 px-1 text-xs">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, quantity + 1)}
                        disabled={quantity >= item.stockCount}
                        className="text-stone-500 hover:text-stone-900 cursor-pointer disabled:opacity-30"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Total for this line */}
                    <span className="font-mono-numbers font-bold text-stone-900 w-14 text-right">
                      ₹{item.currentPrice * quantity}
                    </span>

                    {/* Remove */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Delivery Slot Choice */}
          {cart.length > 0 && (
            <div className="px-4 py-3 border-t border-stone-200 bg-stone-50/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Select Local Delivery Slot
                </span>
                <span className="text-[11px] text-emerald-800 font-medium flex items-center gap-1">
                  <Bike className="w-3 h-3" /> Direct Store Dispatch
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {deliverySlots.slice(0, 2).map((slot) => {
                  const isSelected = selectedSlot.id === slot.id;
                  const isFree = cartSubtotal >= 499 || slot.price === 0;

                  return (
                    <button
                      key={slot.id}
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-2.5 rounded-lg text-left border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-emerald-800 bg-white ring-1 ring-emerald-800 shadow-2xs'
                          : 'border-stone-200 bg-stone-50 hover:bg-white text-stone-600'
                      }`}
                    >
                      <div className="text-xs font-semibold text-stone-900">
                        {slot.title}
                      </div>
                      <div className="text-[11px] text-stone-500">
                        {slot.timeEstimate}
                      </div>
                      <div className="text-[11px] font-mono-numbers font-medium text-emerald-800 mt-1">
                        {isFree ? 'FREE Delivery' : `₹${slot.price}`}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bill Summary & Checkout Button */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-stone-200 bg-white space-y-3">
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex items-center justify-between">
                  <span>Items Subtotal</span>
                  <span className="font-mono-numbers text-stone-900">₹{cartSubtotal}</span>
                </div>
                {cartSavings > 0 && (
                  <div className="flex items-center justify-between text-emerald-700">
                    <span>Mandi Price Savings</span>
                    <span className="font-mono-numbers font-medium">-₹{cartSavings}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span>Local Delivery Fee</span>
                  <span className="font-mono-numbers text-stone-900">
                    {cartSubtotal >= 499 ? (
                      <span className="text-emerald-700 font-medium">FREE</span>
                    ) : (
                      `₹${selectedSlot.price}`
                    )}
                  </span>
                </div>
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-sm font-bold text-stone-900">
                  <span>To Pay</span>
                  <span className="font-mono-numbers text-lg text-emerald-950">
                    ₹{cartTotal}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full py-3 px-4 bg-emerald-900 hover:bg-emerald-800 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <span>Proceed to Local Delivery</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Cash on Delivery & UPI at doorstep accepted</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <CheckoutModal onClose={() => setIsCheckoutOpen(false)} />
      )}
    </>
  );
};
