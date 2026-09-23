import React from 'react';
import { Search, Clock, ShieldCheck, Bike, TrendingDown } from 'lucide-react';
import { useGrocery } from '../context/GroceryContext';

interface HeroBannerProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  categories: string[];
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
}) => {
  const { items, trackedItemIds, simulateNaviPriceDropEvent } = useGrocery();
  const priceDropItems = items.filter((i) => (i.priceDropPercentage || 0) > 0);

  return (
    <div className="bg-white border-b border-stone-200 pt-6 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Subtle trust markers & store location - placed in Hero per Section 2 */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 mb-3">
          <span>Satellite & Anand Nagar, Ahmedabad</span>
          <span aria-hidden="true">·</span>
          <span>Open 7:00 AM – 10:00 PM</span>
          <span aria-hidden="true">·</span>
          <span className="text-emerald-700 font-medium">Free Local Delivery over ₹499</span>
          <span aria-hidden="true">·</span>
          <span>FSSAI Certified</span>
        </div>

        {/* Hero split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-900 leading-[1.15] mb-4">
              Fresh Kirana, Pure Ghee & Real-Time Local Delivery.
            </h1>
            <p className="text-base sm:text-lg text-stone-600 mb-6 max-w-2xl leading-relaxed">
              Serving our neighborhood with unpolished pulses, stone-ground flours, and pure Saurashtra oils. Track daily Mandi prices, watch live shelf stock, and receive deliveries at your doorstep in 45 minutes.
            </p>

            {/* Search Input Bar */}
            <div className="relative max-w-xl mb-6">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search toor dal, gir cow ghee, atta, masalas, dry fruits..."
                className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-800 focus:bg-white transition-all shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick Trust Highlights with typographic separators */}
            <div className="grid grid-cols-3 gap-4 pt-2 border-t border-stone-100 max-w-xl text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <Bike className="w-4 h-4 text-emerald-800 shrink-0" />
                <span>35-45 min Local Dispatch</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-800 shrink-0" />
                <span>Zero Adulteration Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-800 shrink-0" />
                <span>Real-Time Shelf Stock</span>
              </div>
            </div>
          </div>

          {/* Right Column: Navi Price Tracking Spotlight Box */}
          <div className="lg:col-span-5">
            <div className="bg-[#FAF7F2] border border-amber-200/80 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-amber-200/60">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-emerald-800" />
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-950 font-display">
                    Navi Market Price Ticker
                  </span>
                </div>
                <span className="text-[11px] text-amber-900/70 font-mono-numbers">
                  Updated 09:10 AM
                </span>
              </div>

              <p className="text-xs text-amber-900/80 mb-3 leading-relaxed">
                Direct wholesale Mandi rate changes passed directly to customers. Currently <span className="font-semibold text-emerald-900">{priceDropItems.length} pantry items</span> have active price drops today.
              </p>

              {/* Ticker items */}
              <div className="space-y-2 mb-4">
                {priceDropItems.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2.5 bg-white/90 rounded-lg border border-amber-100 text-xs shadow-2xs"
                  >
                    <div>
                      <div className="font-semibold text-stone-900">{item.name}</div>
                      <div className="text-[11px] text-stone-500">{item.unit} · {item.origin}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono-numbers font-bold text-emerald-800 text-sm">
                        ₹{item.currentPrice}
                      </div>
                      <div className="text-[10px] text-stone-400 line-through font-mono-numbers">
                        ₹{item.previousPrice} (-{item.priceDropPercentage}%)
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-stone-500">
                  Tracking {trackedItemIds.length} items for alerts
                </span>
                <button
                  onClick={simulateNaviPriceDropEvent}
                  className="px-2.5 py-1 text-[11px] font-medium text-emerald-900 hover:text-emerald-950 bg-emerald-100/70 hover:bg-emerald-100 rounded-md transition-colors cursor-pointer"
                >
                  Test Price Drop Simulation
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Category Filter Bar (Interactive segmented controls per Section 1.A) */}
        <div className="mt-8 pt-4 border-t border-stone-100">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200/80 hover:text-stone-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
