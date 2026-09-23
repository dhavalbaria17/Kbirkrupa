import React from 'react';
import { ShoppingBag, Bell, SlidersHorizontal } from 'lucide-react';
import { useGrocery } from '../context/GroceryContext';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const {
    cartItemCount,
    unreadCount,
    setIsCartOpen,
    setIsNotificationsOpen,
    setIsStoreManagerOpen,
  } = useGrocery();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setCurrentTab('catalog')}
          className="text-xl font-bold tracking-tight text-emerald-950 font-display hover:opacity-90 transition-opacity text-left cursor-pointer"
        >
          Kabirkrupa
        </button>

        {/* Zone 2: 4-5 clean text navigation links with subtle hover underlines */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
          <button
            onClick={() => setCurrentTab('catalog')}
            className={`cursor-pointer transition-colors relative py-1 ${
              currentTab === 'catalog'
                ? 'text-emerald-900 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emerald-800'
                : 'hover:text-stone-900'
            }`}
          >
            Catalog
          </button>
          <button
            onClick={() => setCurrentTab('navi-prices')}
            className={`cursor-pointer transition-colors relative py-1 ${
              currentTab === 'navi-prices'
                ? 'text-emerald-900 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emerald-800'
                : 'hover:text-stone-900'
            }`}
          >
            Navi Prices
          </button>
          <button
            onClick={() => setCurrentTab('inventory')}
            className={`cursor-pointer transition-colors relative py-1 ${
              currentTab === 'inventory'
                ? 'text-emerald-900 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emerald-800'
                : 'hover:text-stone-900'
            }`}
          >
            Live Inventory
          </button>
          <button
            onClick={() => setCurrentTab('orders')}
            className={`cursor-pointer transition-colors relative py-1 ${
              currentTab === 'orders'
                ? 'text-emerald-900 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emerald-800'
                : 'hover:text-stone-900'
            }`}
          >
            Order History
          </button>
          <button
            onClick={() => setCurrentTab('deliveries')}
            className={`cursor-pointer transition-colors relative py-1 ${
              currentTab === 'deliveries'
                ? 'text-emerald-900 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emerald-800'
                : 'hover:text-stone-900'
            }`}
          >
            Local Delivery
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          {/* Quick store controls / admin simulation */}
          <button
            onClick={() => setIsStoreManagerOpen(true)}
            title="Store Simulation & Management"
            className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Store Manager Settings"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>

          {/* Notifications Trigger */}
          <button
            onClick={() => setIsNotificationsOpen(true)}
            className="relative p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-600 rounded-full ring-2 ring-white" />
            )}
          </button>

          {/* Cart Bag Action Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-white bg-emerald-900 hover:bg-emerald-800 rounded-lg transition-colors cursor-pointer shadow-xs whitespace-nowrap shrink-0"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Bag</span>
            {cartItemCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-emerald-700 text-emerald-100 rounded-sm text-xs font-mono font-semibold">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>

      </div>

      {/* Mobile subnavigation bar for smooth tab navigation on small viewports */}
      <div className="md:hidden flex items-center justify-around border-t border-stone-200 bg-stone-50 px-2 py-1.5 overflow-x-auto text-xs font-medium text-stone-600">
        <button
          onClick={() => setCurrentTab('catalog')}
          className={`px-2.5 py-1 rounded-sm whitespace-nowrap cursor-pointer ${
            currentTab === 'catalog' ? 'bg-white text-emerald-950 font-semibold shadow-xs' : ''
          }`}
        >
          Catalog
        </button>
        <button
          onClick={() => setCurrentTab('navi-prices')}
          className={`px-2.5 py-1 rounded-sm whitespace-nowrap cursor-pointer ${
            currentTab === 'navi-prices' ? 'bg-white text-emerald-950 font-semibold shadow-xs' : ''
          }`}
        >
          Navi Prices
        </button>
        <button
          onClick={() => setCurrentTab('inventory')}
          className={`px-2.5 py-1 rounded-sm whitespace-nowrap cursor-pointer ${
            currentTab === 'inventory' ? 'bg-white text-emerald-950 font-semibold shadow-xs' : ''
          }`}
        >
          Live Stock
        </button>
        <button
          onClick={() => setCurrentTab('orders')}
          className={`px-2.5 py-1 rounded-sm whitespace-nowrap cursor-pointer ${
            currentTab === 'orders' ? 'bg-white text-emerald-950 font-semibold shadow-xs' : ''
          }`}
        >
          Orders
        </button>
        <button
          onClick={() => setCurrentTab('deliveries')}
          className={`px-2.5 py-1 rounded-sm whitespace-nowrap cursor-pointer ${
            currentTab === 'deliveries' ? 'bg-white text-emerald-950 font-semibold shadow-xs' : ''
          }`}
        >
          Delivery
        </button>
      </div>
    </header>
  );
};
