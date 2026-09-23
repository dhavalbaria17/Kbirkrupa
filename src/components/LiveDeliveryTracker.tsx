import React from 'react';
import { X, Bike, Phone, MapPin, CheckCircle2, Clock, ShieldCheck, ChevronRight, RefreshCw, ShoppingBag } from 'lucide-react';
import { useGrocery } from '../context/GroceryContext';
import { Order, OrderStatus } from '../types/grocery';

interface LiveDeliveryTrackerProps {
  order: Order | null;
  onClose?: () => void;
  isEmbedded?: boolean;
}

export const LiveDeliveryTracker: React.FC<LiveDeliveryTrackerProps> = ({
  order,
  onClose,
  isEmbedded = false,
}) => {
  const { advanceOrderStatus, orders, setActiveTrackingOrder } = useGrocery();

  // If no order passed, use the latest active order
  const currentOrder = order || orders.find((o) => o.status !== 'delivered') || orders[0];

  if (!currentOrder) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-stone-200">
        <Bike className="w-12 h-12 text-stone-300 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-stone-800 mb-1">No Active Deliveries</h3>
        <p className="text-xs text-stone-500">
          Place an order from the grocery catalog to track your local delivery in real time.
        </p>
      </div>
    );
  }

  const stages: { status: OrderStatus; label: string; desc: string }[] = [
    { status: 'placed', label: 'Order Placed', desc: 'Received at shop counter' },
    { status: 'confirmed', label: 'Order Confirmed', desc: 'Stock allocated from shelves' },
    { status: 'packing', label: 'Fresh Packing', desc: 'Weighed and sealed cleanly' },
    { status: 'out_for_delivery', label: 'Out for Delivery', desc: 'Rider en route on bike' },
    { status: 'delivered', label: 'Delivered', desc: 'Handed over at doorstep' },
  ];

  const currentStageIndex = stages.findIndex((s) => s.status === currentOrder.status);

  const handleAdvance = () => {
    advanceOrderStatus(currentOrder.id);
  };

  const content = (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
      {/* Top Banner */}
      <div className="bg-emerald-900 text-white p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-200 mb-1">
            <span>Local Delivery Order #{currentOrder.orderNumber}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-numbers">{currentOrder.createdAt}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
            {currentOrder.status === 'delivered'
              ? 'Groceries Successfully Delivered'
              : `ETA: ${currentOrder.estimatedDeliveryTime}`}
          </h2>
          <p className="text-xs text-emerald-100/80 mt-1">
            Dispatched directly from Kabirkrupa Grocery, Satellite, Ahmedabad
          </p>
        </div>

        <div className="flex items-center gap-2">
          {currentOrder.status !== 'delivered' && (
            <button
              onClick={handleAdvance}
              className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Simulate Next Step</span>
            </button>
          )}
          {onClose && !isEmbedded && (
            <button
              onClick={onClose}
              className="p-1.5 text-white/70 hover:text-white hover:bg-emerald-800 rounded-lg cursor-pointer"
              aria-label="Close tracking"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Interactive Status Timeline */}
      <div className="p-5 sm:p-6 border-b border-stone-100">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-4">
          Live Dispatch Timeline
        </h3>

        <div className="relative">
          {/* Progress Bar Line */}
          <div className="absolute top-4 left-4 right-4 h-0.5 bg-stone-200 hidden sm:block -z-0">
            <div
              className="h-full bg-emerald-800 transition-all duration-500"
              style={{
                width: `${(Math.max(0, currentStageIndex) / (stages.length - 1)) * 100}%`,
              }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
            {stages.map((stage, idx) => {
              const isPast = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              const isFuture = idx > currentStageIndex;

              return (
                <div key={stage.status} className="flex sm:flex-col items-center sm:items-center gap-3 sm:gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                      isPast
                        ? 'bg-emerald-800 text-white'
                        : isCurrent
                        ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                        : 'bg-stone-200 text-stone-500'
                    }`}
                  >
                    {isPast ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>
                  <div className="sm:text-center">
                    <span
                      className={`text-xs font-semibold block ${
                        isCurrent ? 'text-emerald-950 font-bold' : isPast ? 'text-stone-900' : 'text-stone-400'
                      }`}
                    >
                      {stage.label}
                    </span>
                    <span className="text-[11px] text-stone-500 block leading-tight">
                      {stage.desc}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Driver & Delivery Information */}
      <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-stone-50/50">
        
        {/* Delivery Partner */}
        <div className="p-4 bg-white rounded-xl border border-stone-200">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <Bike className="w-4 h-4 text-emerald-800" />
              <span className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                Assigned Delivery Partner
              </span>
            </div>
            <span className="text-xs font-medium text-emerald-800 flex items-center gap-1">
              ★ {currentOrder.deliveryPartner.rating}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-stone-900 text-sm">
                {currentOrder.deliveryPartner.name}
              </div>
              <div className="text-xs text-stone-500">
                {currentOrder.deliveryPartner.vehicle}
              </div>
            </div>

            <a
              href={`tel:${currentOrder.deliveryPartner.phone}`}
              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Rider</span>
            </a>
          </div>
        </div>

        {/* Drop Address */}
        <div className="p-4 bg-white rounded-xl border border-stone-200">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-stone-100">
            <MapPin className="w-4 h-4 text-emerald-800" />
            <span className="text-xs font-bold text-stone-800 uppercase tracking-wider">
              Destination Doorstep
            </span>
          </div>

          <div className="text-xs space-y-1 text-stone-600">
            <div className="font-semibold text-stone-900">
              {currentOrder.address.fullName} · {currentOrder.address.phone}
            </div>
            <div>{currentOrder.address.flatAndBuilding}</div>
            <div>{currentOrder.address.streetAndArea}, {currentOrder.address.locality} - {currentOrder.address.pincode}</div>
            {currentOrder.address.deliveryInstructions && (
              <div className="text-stone-500 italic mt-1 text-[11px]">
                Note: {currentOrder.address.deliveryInstructions}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Bag Items in this Order */}
      <div className="p-5 sm:p-6 border-t border-stone-200">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Items in this Consignment ({currentOrder.items.length})
          </h4>
          <span className="text-xs text-stone-500">
            Payment: <strong className="text-stone-800">{currentOrder.paymentMethod}</strong>
          </span>
        </div>

        <div className="divide-y divide-stone-100">
          {currentOrder.items.map(({ item, quantity }, i) => (
            <div key={i} className="py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-7 h-7 rounded-md flex items-center justify-center font-bold text-xs shrink-0"
                  style={{ backgroundColor: `${item.colorTone}20`, color: item.colorTone }}
                >
                  {item.name.charAt(0)}
                </div>
                <div>
                  <span className="font-medium text-stone-900">{item.name}</span>
                  <span className="text-stone-400 block text-[11px]">{item.unit} × {quantity}</span>
                </div>
              </div>

              <span className="font-mono-numbers font-semibold text-stone-900">
                ₹{item.currentPrice * quantity}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-3 mt-3 border-t border-stone-200 flex items-center justify-between text-sm font-bold text-stone-900">
          <span>Total Order Value</span>
          <span className="font-mono-numbers text-base text-emerald-950">
            ₹{currentOrder.total}
          </span>
        </div>
      </div>
    </div>
  );

  if (isEmbedded) {
    return content;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="max-w-3xl w-full my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {content}
      </div>
    </div>
  );
};
