import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentTab }) => {
  return (
    <footer className="bg-white border-t border-stone-200 mt-16 text-xs text-stone-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand info */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold font-display text-emerald-950">
              Kabirkrupa Grocery Store
            </h3>
            <p className="text-stone-500 leading-relaxed text-xs">
              Trusted neighborhood grocery store providing farm-sourced pulses, unadulterated oils, and stone-ground flours with real-time stock sync and express local delivery.
            </p>
            <div className="text-[11px] text-stone-400">
              FSSAI Lic. No: 10721026000412
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <span className="font-bold uppercase tracking-wider text-stone-900 block text-xs">
              Store Navigation
            </span>
            <ul className="space-y-1.5 text-xs text-stone-600">
              <li>
                <button
                  onClick={() => {
                    setCurrentTab('catalog');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-emerald-900 transition-colors cursor-pointer"
                >
                  All Groceries &amp; Staples
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentTab('navi-prices');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-emerald-900 transition-colors cursor-pointer"
                >
                  Navi Mandi Price Intelligence
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentTab('inventory');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-emerald-900 transition-colors cursor-pointer"
                >
                  Real-Time Shelf Stock Feed
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentTab('orders');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-emerald-900 transition-colors cursor-pointer"
                >
                  Order History &amp; Bills
                </button>
              </li>
            </ul>
          </div>

          {/* Local Delivery Coverage */}
          <div className="space-y-2">
            <span className="font-bold uppercase tracking-wider text-stone-900 block text-xs">
              Local Delivery Zones
            </span>
            <p className="text-stone-500 text-xs leading-relaxed">
              35-45 minute direct store dispatch covering:
            </p>
            <div className="text-stone-700 space-y-1 text-xs">
              <div>Satellite &amp; Anand Nagar (0-2 km)</div>
              <div>Prahlad Nagar &amp; SG Highway (2-4 km)</div>
              <div>Bodakdev &amp; Judges Bungalow (3-5 km)</div>
              <div>Vastrapur &amp; Paldi (4-6 km)</div>
            </div>
          </div>

          {/* Contact & Hours */}
          <div className="space-y-2 text-xs">
            <span className="font-bold uppercase tracking-wider text-stone-900 block">
              Store Visit &amp; Support
            </span>
            <div className="flex items-start gap-2 text-stone-600">
              <MapPin className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
              <span>Shop 12-14, Ground Floor, Shivalik Complex, 100ft Anand Nagar Rd, Satellite, Ahmedabad 380015</span>
            </div>
            <div className="flex items-center gap-2 text-stone-600">
              <Phone className="w-4 h-4 text-emerald-800 shrink-0" />
              <span>+91 98250 44123 / (079) 2692-8421</span>
            </div>
            <div className="flex items-center gap-2 text-stone-600">
              <Clock className="w-4 h-4 text-emerald-800 shrink-0" />
              <span>Monday – Sunday: 7:00 AM – 10:00 PM</span>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-400 text-xs">
          <div>
            &copy; 2026 Kabirkrupa Grocery Store. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-stone-500">
            <span>Free Delivery on orders above ₹499</span>
            <span>·</span>
            <span>Cash / UPI on Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
