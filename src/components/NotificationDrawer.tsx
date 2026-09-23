import React, { useState } from 'react';
import { X, Bell, TrendingDown, Bike, AlertTriangle, CheckCircle2, CheckCheck } from 'lucide-react';
import { useGrocery } from '../context/GroceryContext';
import { AppNotification } from '../types/grocery';

export const NotificationDrawer: React.FC = () => {
  const {
    notifications,
    isNotificationsOpen,
    setIsNotificationsOpen,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    items,
    orders,
    setActiveProductModal,
    setActiveTrackingOrder,
    setIsTrackingModalOpen,
  } = useGrocery();

  const [activeTab, setActiveTab] = useState<'all' | 'price' | 'delivery'>('all');

  if (!isNotificationsOpen) return null;

  const filteredNotifs = notifications.filter((n) => {
    if (activeTab === 'price') return n.type === 'price_drop';
    if (activeTab === 'delivery') return n.type === 'delivery_update' || n.type === 'order_confirmed';
    return true;
  });

  const handleNotificationClick = (notif: AppNotification) => {
    markNotificationAsRead(notif.id);

    if (notif.itemId) {
      const foundItem = items.find((i) => i.id === notif.itemId);
      if (foundItem) {
        setActiveProductModal(foundItem);
        setIsNotificationsOpen(false);
      }
    } else if (notif.orderId) {
      const foundOrder = orders.find((o) => o.id === notif.orderId);
      if (foundOrder) {
        setActiveTrackingOrder(foundOrder);
        setIsTrackingModalOpen(true);
        setIsNotificationsOpen(false);
      }
    }
  };

  const getNotifIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'price_drop':
        return <TrendingDown className="w-4 h-4 text-emerald-700" />;
      case 'delivery_update':
        return <Bike className="w-4 h-4 text-amber-700" />;
      case 'order_confirmed':
        return <CheckCircle2 className="w-4 h-4 text-emerald-800" />;
      case 'inventory_low':
      case 'inventory_restock':
        return <AlertTriangle className="w-4 h-4 text-blue-700" />;
      default:
        return <Bell className="w-4 h-4 text-stone-600" />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs transition-opacity"
      onClick={() => setIsNotificationsOpen(false)}
    >
      <div
        className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl flex flex-col z-50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-900" />
            <h2 className="text-lg font-bold text-stone-900 font-display">
              Notifications &amp; Alerts
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={markAllNotificationsAsRead}
              className="p-1 text-stone-500 hover:text-stone-900 text-xs font-medium flex items-center gap-1 cursor-pointer"
              title="Mark all as read"
            >
              <CheckCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Mark all</span>
            </button>
            <button
              onClick={() => setIsNotificationsOpen(false)}
              className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg cursor-pointer"
              aria-label="Close notifications"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter pills */}
        <div className="px-4 py-2.5 border-b border-stone-100 bg-stone-50 flex items-center gap-1 text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              activeTab === 'all'
                ? 'bg-white text-stone-900 font-semibold shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab('price')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              activeTab === 'price'
                ? 'bg-white text-stone-900 font-semibold shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Navi Price Drops
          </button>
          <button
            onClick={() => setActiveTab('delivery')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              activeTab === 'delivery'
                ? 'bg-white text-stone-900 font-semibold shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Deliveries
          </button>
        </div>

        {/* Notifications list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredNotifs.length === 0 ? (
            <div className="py-16 text-center text-stone-400">
              <Bell className="w-10 h-10 text-stone-300 mx-auto mb-2" />
              <p className="text-xs">No notifications in this tab</p>
            </div>
          ) : (
            filteredNotifs.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  !notif.read
                    ? 'bg-emerald-50/40 border-emerald-200/90 shadow-2xs'
                    : 'bg-white border-stone-200/70 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-stone-100 shrink-0 mt-0.5">
                    {getNotifIcon(notif.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="text-xs font-bold text-stone-900 truncate">
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-stone-400 shrink-0 font-mono-numbers">
                        {notif.timestamp}
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed mb-2">
                      {notif.message}
                    </p>

                    <div className="flex items-center justify-between text-[11px]">
                      {notif.badgeText && (
                        <span className="text-emerald-800 font-medium">
                          {notif.badgeText}
                        </span>
                      )}
                      <span className="text-stone-400 hover:text-emerald-800 transition-colors">
                        Tap to view &rarr;
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
