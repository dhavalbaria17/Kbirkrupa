import React, { useState, useMemo } from 'react';
import { GroceryProvider, useGrocery } from './context/GroceryContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { NaviPriceTracker } from './components/NaviPriceTracker';
import { LiveInventoryPanel } from './components/LiveInventoryPanel';
import { OrderHistoryView } from './components/OrderHistoryView';
import { LiveDeliveryTracker } from './components/LiveDeliveryTracker';
import { CartDrawer } from './components/CartDrawer';
import { NotificationDrawer } from './components/NotificationDrawer';
import { StoreManagerModal } from './components/StoreManagerModal';
import { Footer } from './components/Footer';
import { Sparkles, Bike, TrendingDown, Clock, Search } from 'lucide-react';

const CATEGORIES = [
  'All Items',
  'Pulses & Dals',
  'Pure Ghee & Oils',
  'Grains & Flours',
  'Spices & Masalas',
  'Daily Kirana & Tea',
  'Dry Fruits',
];

const MainAppContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('catalog');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Items');

  const {
    items,
    activeProductModal,
    setActiveProductModal,
    isTrackingModalOpen,
    setIsTrackingModalOpen,
    activeTrackingOrder,
  } = useGrocery();

  // Filter items by search query and category
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.localName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.origin.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All Items' || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [items, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFA] text-[#1E232A]">
      {/* 3-Zone Top Navigation */}
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Main Tab Views */}
      <main className="flex-1">
        {currentTab === 'catalog' && (
          <div>
            {/* Hero Section & Category Selector */}
            <HeroBanner
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              categories={CATEGORIES}
            />

            {/* Featured Product Catalog Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 font-display">
                    {selectedCategory === 'All Items' ? 'Pantry & Grocery Essentials' : selectedCategory}
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Showing {filteredItems.length} freshly stocked items with real-time shelf inventory
                  </p>
                </div>

                {/* Quick tab shortcuts */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentTab('navi-prices')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    <TrendingDown className="w-3.5 h-3.5" />
                    <span>View Navi Price Tracker</span>
                  </button>
                  <button
                    onClick={() => setCurrentTab('inventory')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Live Stock</span>
                  </button>
                </div>
              </div>

              {/* Grid adhering to Section 2.A: 3-column desktop / 2-column tablet with gap-6 to gap-8 */}
              {filteredItems.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-2xl border border-stone-200 p-8">
                  <Search className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                  <h3 className="text-base font-semibold text-stone-800 mb-1">
                    No groceries found matching &ldquo;{searchQuery}&rdquo;
                  </h3>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto mb-4">
                    Try checking your spelling or explore another category like Pulses &amp; Dals, Pure Ghee, or Spices.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All Items');
                    }}
                    className="px-4 py-2 bg-emerald-900 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800 cursor-pointer"
                  >
                    Reset Search &amp; Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {filteredItems.map((item) => (
                    <ProductCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {currentTab === 'navi-prices' && <NaviPriceTracker />}

        {currentTab === 'inventory' && <LiveInventoryPanel />}

        {currentTab === 'orders' && <OrderHistoryView />}

        {currentTab === 'deliveries' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
              <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
                <span>Express Doorstep Delivery</span>
                <span aria-hidden="true">·</span>
                <span>35 - 45 Mins Average Dispatch</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 font-display">
                Live Local Delivery Tracking
              </h1>
              <p className="text-sm text-stone-600 mt-1">
                Real-time rider assignment and dispatch progress for your current local delivery.
              </p>
            </div>

            <LiveDeliveryTracker order={activeTrackingOrder} isEmbedded={true} />
          </div>
        )}
      </main>

      {/* Global Slide-Over Drawers & Modals */}
      <CartDrawer />
      <NotificationDrawer />
      <StoreManagerModal />

      {activeProductModal && (
        <ProductDetailModal
          item={activeProductModal}
          onClose={() => setActiveProductModal(null)}
        />
      )}

      {isTrackingModalOpen && (
        <LiveDeliveryTracker
          order={activeTrackingOrder}
          onClose={() => setIsTrackingModalOpen(false)}
        />
      )}

      {/* Quiet Editorial Footer */}
      <Footer setCurrentTab={setCurrentTab} />
    </div>
  );
};

export default function App() {
  return (
    <GroceryProvider>
      <MainAppContent />
    </GroceryProvider>
  );
}
