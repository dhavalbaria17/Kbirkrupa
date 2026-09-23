import React, { useState } from 'react';
import { Package, Bike, ArrowRight, RotateCcw, CheckCircle2, Clock, Printer, X, ShieldCheck } from 'lucide-react';
import { useGrocery } from '../context/GroceryContext';
import { Order } from '../types/grocery';

export const OrderHistoryView: React.FC = () => {
  const { orders, reorderItems, trackOrder } = useGrocery();
  const [selectedReceipt, setSelectedReceipt] = useState<Order | null>(null);

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Delivered</span>
          </span>
        );
      case 'out_for_delivery':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md animate-pulse">
            <Bike className="w-3.5 h-3.5" />
            <span>Out for Local Delivery</span>
          </span>
        );
      case 'packing':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-md">
            <Clock className="w-3.5 h-3.5" />
            <span>Packing Freshly</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-stone-700 bg-stone-100 px-2.5 py-1 rounded-md">
            <Clock className="w-3.5 h-3.5" />
            <span>Order Placed</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
            <span>Customer Pantry Account</span>
            <span aria-hidden="true">·</span>
            <span>Local Delivery Records</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 font-display">
            Order History &amp; Reorders
          </h1>
          <p className="text-sm text-stone-600 mt-1 max-w-2xl">
            View all your past grocery dispatches from Kabirkrupa Store. Track live orders or reorder your regular kitchen staples in one click.
          </p>
        </div>

        <div className="text-xs text-stone-500 font-mono-numbers">
          {orders.length} total orders placed
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-stone-200">
          <Package className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-stone-800 mb-1">No Orders Yet</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mb-4">
            Start placing orders for fresh toor dal, MP atta, and pure gir ghee with fast local delivery.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs hover:border-stone-300 transition-all"
            >
              {/* Order Header Card */}
              <div className="p-4 sm:p-5 bg-stone-50/70 border-b border-stone-100 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex flex-wrap items-center gap-4">
                  <div>
                    <span className="text-stone-400 block text-[11px]">Order Number</span>
                    <span className="font-bold text-stone-900 font-mono-numbers text-sm">
                      {order.orderNumber}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[11px]">Placed At</span>
                    <span className="text-stone-700 font-mono-numbers">
                      {order.createdAt}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[11px]">Payment</span>
                    <span className="text-stone-700">
                      {order.paymentMethod}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(order.status)}

                  <span className="font-mono-numbers font-bold text-stone-900 text-base">
                    ₹{order.total}
                  </span>
                </div>
              </div>

              {/* Order Content */}
              <div className="p-4 sm:p-5">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  
                  {/* Items Summary */}
                  <div className="md:col-span-8 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
                      Ordered Items ({order.items.length})
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {order.items.map(({ item, quantity }, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 p-2 bg-stone-50 rounded-lg border border-stone-200/70 text-xs"
                        >
                          <div
                            className="w-5 h-5 rounded-sm flex items-center justify-center font-bold text-[10px]"
                            style={{ backgroundColor: `${item.colorTone}20`, color: item.colorTone }}
                          >
                            {item.name.charAt(0)}
                          </div>
                          <span className="font-medium text-stone-800">{item.name}</span>
                          <span className="text-stone-500 font-mono-numbers">× {quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="text-xs text-stone-500 pt-1">
                      Delivered to: <strong className="text-stone-700">{order.address.flatAndBuilding}, {order.address.locality}</strong>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col gap-2 md:items-end justify-center">
                    {order.status !== 'delivered' && (
                      <button
                        onClick={() => trackOrder(order)}
                        className="w-full sm:w-auto px-4 py-2 bg-emerald-900 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <Bike className="w-3.5 h-3.5" />
                        <span>Track Live Delivery</span>
                      </button>
                    )}

                    <button
                      onClick={() => reorderItems(order)}
                      className="w-full sm:w-auto px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Re-order in 1-Click</span>
                    </button>

                    <button
                      onClick={() => setSelectedReceipt(order)}
                      className="w-full sm:w-auto px-3 py-1.5 text-stone-500 hover:text-stone-800 text-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Printer className="w-3 h-3" />
                      <span>View Printable Bill</span>
                    </button>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bill / Invoice Receipt Modal */}
      {selectedReceipt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs"
          onClick={() => setSelectedReceipt(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 text-xs text-stone-700"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Store header in bill */}
            <div className="text-center pb-4 border-b border-dashed border-stone-300">
              <h2 className="text-xl font-bold font-display text-emerald-950">
                Kabirkrupa Grocery Store
              </h2>
              <div className="text-[11px] text-stone-500 mt-0.5">
                Satellite Road, Anand Nagar, Ahmedabad · Tel: +91 98250 11223
              </div>
              <div className="text-[11px] text-stone-400 mt-1 font-mono-numbers">
                Tax Invoice / Delivery Challan #{selectedReceipt.orderNumber}
              </div>
            </div>

            {/* Bill Details */}
            <div className="py-3 border-b border-dashed border-stone-300 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span>Date:</span>
                <span className="font-mono-numbers">{selectedReceipt.createdAt}</span>
              </div>
              <div className="flex justify-between">
                <span>Customer:</span>
                <span className="font-medium text-stone-900">{selectedReceipt.address.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span>Address:</span>
                <span className="truncate max-w-[200px]">{selectedReceipt.address.flatAndBuilding}, {selectedReceipt.address.locality}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Mode:</span>
                <span className="font-medium">{selectedReceipt.paymentMethod}</span>
              </div>
            </div>

            {/* Items Table */}
            <div className="py-3 border-b border-dashed border-stone-300 space-y-2">
              <div className="flex justify-between font-bold text-stone-900 text-[11px]">
                <span>Item</span>
                <span>Qty</span>
                <span>Price</span>
                <span>Total</span>
              </div>
              {selectedReceipt.items.map(({ item, quantity }, i) => (
                <div key={i} className="flex justify-between text-[11px]">
                  <span className="truncate max-w-[150px]">{item.name}</span>
                  <span className="font-mono-numbers">{quantity}</span>
                  <span className="font-mono-numbers">₹{item.currentPrice}</span>
                  <span className="font-mono-numbers font-medium">₹{item.currentPrice * quantity}</span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="py-3 space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-mono-numbers">₹{selectedReceipt.subtotal}</span>
              </div>
              {selectedReceipt.savings > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Mandi Price Discount:</span>
                  <span className="font-mono-numbers">-₹{selectedReceipt.savings}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery:</span>
                <span>{selectedReceipt.deliveryFee === 0 ? 'FREE' : `₹${selectedReceipt.deliveryFee}`}</span>
              </div>
              <div className="pt-2 border-t border-stone-300 flex justify-between font-bold text-stone-900 text-sm">
                <span>Grand Total:</span>
                <span className="font-mono-numbers text-base">₹{selectedReceipt.total}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-dashed border-stone-300 flex items-center justify-between">
              <button
                onClick={() => window.print()}
                className="px-3.5 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-semibold cursor-pointer hover:bg-stone-800"
              >
                Print Receipt
              </button>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-3.5 py-1.5 bg-stone-100 text-stone-700 rounded-lg text-xs font-semibold cursor-pointer hover:bg-stone-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
