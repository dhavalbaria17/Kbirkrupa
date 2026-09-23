import React, { useState } from 'react';
import { X, MapPin, Bike, Phone, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useGrocery } from '../context/GroceryContext';
import { DeliveryAddress } from '../types/grocery';

interface CheckoutModalProps {
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ onClose }) => {
  const {
    cart,
    cartSubtotal,
    cartTotal,
    selectedSlot,
    placeOrder,
    setIsCartOpen,
  } = useGrocery();

  const [address, setAddress] = useState<DeliveryAddress>({
    fullName: 'Dhaval Baria',
    phone: '+91 98250 44123',
    flatAndBuilding: 'Flat 402, Shivalik Residency',
    streetAndArea: '100ft Anand Nagar Road, Near Sachin Tower',
    locality: 'Satellite / Anand Nagar',
    pincode: '380015',
    deliveryInstructions: 'Ring doorbell twice. Cash or UPI ready.',
  });

  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery' | 'UPI QR on Delivery' | 'Online Prepaid'>('UPI QR on Delivery');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.fullName || !address.phone || !address.flatAndBuilding) return;

    setIsSubmitting(true);
    setTimeout(() => {
      placeOrder(address, paymentMethod, selectedSlot);
      setIsSubmitting(false);
      onClose();
      setIsCartOpen(false);
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone-200 sticky top-0 bg-white/95 backdrop-blur-xs z-10">
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-500 mb-0.5">
              <span>Direct Store Dispatch</span>
              <span aria-hidden="true">·</span>
              <span>Local Delivery Hub</span>
            </div>
            <h2 className="text-xl font-bold text-stone-900 font-display">
              Confirm Local Delivery
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-6">
          
          {/* Delivery Slot Banner */}
          <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <Bike className="w-5 h-5 text-emerald-800" />
              <div>
                <span className="font-semibold text-emerald-950 block">
                  {selectedSlot.title}
                </span>
                <span className="text-emerald-800/80">
                  {selectedSlot.subtitle} ({selectedSlot.timeEstimate})
                </span>
              </div>
            </div>
            <span className="font-mono-numbers font-bold text-emerald-900">
              {cartSubtotal >= 499 ? 'FREE' : `₹${selectedSlot.price}`}
            </span>
          </div>

          {/* Delivery Address Form */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-emerald-800" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Doorstep Delivery Address
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 font-medium mb-1">
                    Customer Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:bg-white focus:ring-1 focus:ring-emerald-800"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 font-medium mb-1">
                    Phone Number (for Rider)
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:bg-white focus:ring-1 focus:ring-emerald-800"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-stone-600 font-medium mb-1">
                  Flat / House No. & Apartment / Society
                </label>
                <input
                  type="text"
                  required
                  value={address.flatAndBuilding}
                  onChange={(e) => setAddress({ ...address, flatAndBuilding: e.target.value })}
                  placeholder="e.g. Flat 402, Shivalik Residency"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:bg-white focus:ring-1 focus:ring-emerald-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 font-medium mb-1">
                    Locality / Neighborhood (Ahmedabad)
                  </label>
                  <select
                    value={address.locality}
                    onChange={(e) => setAddress({ ...address, locality: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:bg-white focus:ring-1 focus:ring-emerald-800"
                  >
                    <option value="Satellite / Anand Nagar">Satellite / Anand Nagar (Express 35m)</option>
                    <option value="Prahlad Nagar">Prahlad Nagar (Express 40m)</option>
                    <option value="Bodakdev / Judges Bungalow">Bodakdev / Judges Bungalow (45m)</option>
                    <option value="Vastrapur / IIM Road">Vastrapur / IIM Road (45m)</option>
                    <option value="Navrangpura / University">Navrangpura (50m)</option>
                    <option value="Paldi / Vasna">Paldi / Vasna (45m)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-600 font-medium mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    required
                    value={address.pincode}
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono-numbers text-stone-900 focus:bg-white focus:ring-1 focus:ring-emerald-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-600 font-medium mb-1">
                  Delivery Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={address.deliveryInstructions || ''}
                  onChange={(e) => setAddress({ ...address, deliveryInstructions: e.target.value })}
                  placeholder="e.g. Ring bell, leave at security, or call before arriving"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:bg-white focus:ring-1 focus:ring-emerald-800"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
              Payment Choice at Doorstep
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { id: 'UPI QR on Delivery', label: 'UPI QR on Delivery', desc: 'GPay, Paytm, PhonePe' },
                { id: 'Cash on Delivery', label: 'Cash on Delivery', desc: 'Exact cash preferred' },
                { id: 'Online Prepaid', label: 'Online Prepaid', desc: 'Cards / Netbanking' },
              ].map((m) => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id as any)}
                  className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                    paymentMethod === m.id
                      ? 'border-emerald-800 bg-emerald-50/60 ring-1 ring-emerald-800'
                      : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <div className="text-xs font-semibold text-stone-900">{m.label}</div>
                  <div className="text-[11px] text-stone-500">{m.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Order Summary Line */}
          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1.5">
            <div className="flex justify-between text-stone-600">
              <span>Items count:</span>
              <span className="font-semibold text-stone-900">{cart.length} items</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Total Payable:</span>
              <span className="font-mono-numbers font-bold text-stone-900 text-sm">
                ₹{cartTotal}
              </span>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-4 text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 bg-emerald-900 hover:bg-emerald-800 text-white font-semibold text-sm rounded-xl transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Dispatching Order...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Place Order (₹{cartTotal})</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
