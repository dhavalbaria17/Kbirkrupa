import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  GroceryItem,
  CartItem,
  Order,
  AppNotification,
  InventoryLog,
  DeliverySlot,
  DeliveryAddress,
  OrderStatus,
} from '../types/grocery';
import {
  INITIAL_GROCERY_ITEMS,
  INITIAL_ORDERS,
  INITIAL_NOTIFICATIONS,
  INITIAL_DELIVERY_SLOTS,
} from '../data/initialData';

interface GroceryContextType {
  items: GroceryItem[];
  cart: CartItem[];
  orders: Order[];
  notifications: AppNotification[];
  inventoryLogs: InventoryLog[];
  deliverySlots: DeliverySlot[];
  selectedSlot: DeliverySlot;
  trackedItemIds: string[];
  activeTrackingOrder: Order | null;
  unreadCount: number;
  cartTotal: number;
  cartSubtotal: number;
  cartItemCount: number;
  cartSavings: number;
  isCartOpen: boolean;
  isNotificationsOpen: boolean;
  isLiveInventoryOpen: boolean;
  isStoreManagerOpen: boolean;
  isTrackingModalOpen: boolean;
  activeProductModal: GroceryItem | null;
  
  // Actions
  addToCart: (item: GroceryItem, qty?: number) => void;
  updateCartQuantity: (itemId: string, qty: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  setIsCartOpen: (open: boolean) => void;
  setIsNotificationsOpen: (open: boolean) => void;
  setIsLiveInventoryOpen: (open: boolean) => void;
  setIsStoreManagerOpen: (open: boolean) => void;
  setIsTrackingModalOpen: (open: boolean) => void;
  setActiveProductModal: (item: GroceryItem | null) => void;
  setSelectedSlot: (slot: DeliverySlot) => void;
  setActiveTrackingOrder: (order: Order | null) => void;
  
  // Price Tracking
  togglePriceAlert: (itemId: string, targetPrice?: number) => void;
  isItemTracked: (itemId: string) => boolean;
  
  // Orders & Deliveries
  placeOrder: (address: DeliveryAddress, paymentMethod: 'Cash on Delivery' | 'UPI QR on Delivery' | 'Online Prepaid', slot: DeliverySlot) => Order;
  reorderItems: (order: Order) => void;
  advanceOrderStatus: (orderId: string, nextStatus?: OrderStatus) => void;
  trackOrder: (order: Order) => void;
  
  // Notifications
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  
  // Real-Time Inventory & Price Updates
  updateItemStock: (itemId: string, newStock: number, note?: string) => void;
  updateItemPrice: (itemId: string, newPrice: number, reason?: string) => void;
  simulateQuickInventoryEvent: () => void;
  simulateNaviPriceDropEvent: () => void;
}

const GroceryContext = createContext<GroceryContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CART: 'kabirkrupa_cart_v1',
  ORDERS: 'kabirkrupa_orders_v1',
  TRACKED: 'kabirkrupa_tracked_items_v1',
  ITEMS: 'kabirkrupa_inventory_v1',
};

export const GroceryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from localStorage or defaults
  const [items, setItems] = useState<GroceryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ITEMS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read saved items', e);
    }
    return INITIAL_GROCERY_ITEMS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read saved cart', e);
    }
    return [
      { item: INITIAL_GROCERY_ITEMS[0], quantity: 1 }, // Desi Cow Ghee
      { item: INITIAL_GROCERY_ITEMS[1], quantity: 1 }, // Toor Dal
    ];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read saved orders', e);
    }
    return INITIAL_ORDERS;
  });

  const [trackedItemIds, setTrackedItemIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRACKED);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read tracked items', e);
    }
    return ['kk-ghee-gir', 'kk-toor-dal'];
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [inventoryLogs, setInventoryLogs] = useState<InventoryLog[]>([
    {
      id: 'log-1',
      itemId: 'kk-toor-dal',
      itemName: 'Desi Unpolished Gujarati Toor Dal',
      type: 'price_update',
      oldVal: 172,
      newVal: 154,
      timestamp: 'Today 08:30 AM',
      note: 'Navi Wholesale Mandi Rate Reduction (-10.5%)',
    },
    {
      id: 'log-2',
      itemId: 'kk-ghee-gir',
      itemName: 'Kabirkrupa Farm Pure Desi Gir Cow Ghee',
      type: 'price_update',
      oldVal: 940,
      newVal: 880,
      timestamp: 'Today 09:10 AM',
      note: 'Dairy lot discount passed on to customers',
    },
    {
      id: 'log-3',
      itemId: 'kk-green-cardamom',
      itemName: 'Idukki Bold A1 Green Cardamom',
      type: 'stock_drop',
      oldVal: 18,
      newVal: 12,
      timestamp: 'Today 10:05 AM',
      note: 'Counter retail sales dispatch',
    },
  ]);

  const [deliverySlots] = useState<DeliverySlot[]>(INITIAL_DELIVERY_SLOTS);
  const [selectedSlot, setSelectedSlot] = useState<DeliverySlot>(INITIAL_DELIVERY_SLOTS[0]);
  
  // UI states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLiveInventoryOpen, setIsLiveInventoryOpen] = useState(false);
  const [isStoreManagerOpen, setIsStoreManagerOpen] = useState(false);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(orders[1] || orders[0] || null);
  const [activeProductModal, setActiveProductModal] = useState<GroceryItem | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) {
      console.warn('Failed saving cart', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.warn('Failed saving orders', e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TRACKED, JSON.stringify(trackedItemIds));
    } catch (e) {
      console.warn('Failed saving tracked items', e);
    }
  }, [trackedItemIds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
    } catch (e) {
      console.warn('Failed saving items', e);
    }
  }, [items]);

  // Derived calculations
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.item.currentPrice * item.quantity, 0);
  const cartMrpTotal = cart.reduce((sum, item) => sum + item.item.mrp * item.quantity, 0);
  const cartSavings = Math.max(0, cartMrpTotal - cartSubtotal);
  const deliveryFee = cartSubtotal >= 499 ? 0 : selectedSlot.price;
  const cartTotal = cartSubtotal + deliveryFee;
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Cart operations
  const addToCart = (product: GroceryItem, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.item.id === product.id);
      if (existing) {
        const newQty = Math.min(product.stockCount, existing.quantity + qty);
        return prev.map((c) => (c.item.id === product.id ? { ...c, quantity: newQty } : c));
      }
      return [...prev, { item: product, quantity: Math.min(product.stockCount, Math.max(1, qty)) }];
    });
  };

  const updateCartQuantity = (itemId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((c) => {
        if (c.item.id === itemId) {
          const maxStock = c.item.stockCount;
          return { ...c, quantity: Math.min(maxStock, qty) };
        }
        return c;
      })
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((c) => c.item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Price tracking
  const togglePriceAlert = (itemId: string, targetPrice?: number) => {
    const isCurrentlyTracked = trackedItemIds.includes(itemId);
    const item = items.find((i) => i.id === itemId);

    if (isCurrentlyTracked) {
      setTrackedItemIds((prev) => prev.filter((id) => id !== itemId));
      setItems((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, isPriceAlertSet: false, targetAlertPrice: undefined } : i))
      );
      addNotification({
        type: 'price_drop',
        title: 'Price Alert Removed',
        message: `You stopped tracking ${item?.name || 'this item'}.`,
        badgeText: 'Alert Off',
      });
    } else {
      const target = targetPrice || (item ? Math.round(item.currentPrice * 0.95) : 0);
      setTrackedItemIds((prev) => [...prev, itemId]);
      setItems((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, isPriceAlertSet: true, targetAlertPrice: target } : i))
      );
      addNotification({
        type: 'price_drop',
        title: 'Navi Price Alert Set!',
        message: `Now tracking ${item?.name || 'item'}. We will notify you when price drops below ₹${target}.`,
        itemId,
        badgeText: 'Navi Alert',
      });
    }
  };

  const isItemTracked = (itemId: string) => trackedItemIds.includes(itemId);

  // Notifications
  const addNotification = (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Orders
  const placeOrder = (
    address: DeliveryAddress,
    paymentMethod: 'Cash on Delivery' | 'UPI QR on Delivery' | 'Online Prepaid',
    slot: DeliverySlot
  ): Order => {
    const now = new Date();
    const orderNum = `KK-${Math.floor(1000 + Math.random() * 9000)}`;
    const fee = cartSubtotal >= 499 ? 0 : slot.price;
    const finalTotal = cartSubtotal + fee;

    const deliveryPartners = [
      { name: 'Ramesh Patel', phone: '+91 98980 12345', vehicle: 'Bajaj Chetak Electric (GJ-01-EE-8421)', rating: 4.9 },
      { name: 'Ketan Vaghela', phone: '+91 97123 99881', vehicle: 'Hero Splendor (GJ-01-KP-1904)', rating: 4.85 },
      { name: 'Jignesh Rawal', phone: '+91 98240 76543', vehicle: 'Honda Activa (GJ-01-AB-4309)', rating: 4.95 },
    ];
    const partner = deliveryPartners[Math.floor(Math.random() * deliveryPartners.length)];

    const newOrder: Order = {
      id: `kk-ord-${Date.now()}`,
      orderNumber: orderNum,
      items: [...cart],
      subtotal: cartSubtotal,
      deliveryFee: fee,
      savings: cartSavings,
      total: finalTotal,
      deliverySlot: slot,
      address,
      paymentMethod,
      status: 'placed',
      createdAt: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
      estimatedDeliveryTime: slot.type === 'express' ? '30 - 45 mins' : slot.timeEstimate,
      deliveryPartner: partner,
      timeline: [
        { status: 'placed', label: 'Order Placed at Shop Counter', time: 'Just now', completed: true, current: true },
        { status: 'confirmed', label: 'Stock Verified & Reserved', time: 'Pending', completed: false, current: false },
        { status: 'packing', label: 'Fresh Weighing & Packaging', time: 'Pending', completed: false, current: false },
        { status: 'out_for_delivery', label: `Out for Delivery (${partner.name})`, time: 'Pending', completed: false, current: false },
        { status: 'delivered', label: 'Doorstep Handover', time: 'Pending', completed: false, current: false },
      ],
    };

    // Deduct stock in real-time
    cart.forEach((cItem) => {
      updateItemStock(cItem.item.id, Math.max(0, cItem.item.stockCount - cItem.quantity), `Order ${orderNum} fulfillment`);
    });

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setActiveTrackingOrder(newOrder);
    setIsTrackingModalOpen(true);

    addNotification({
      type: 'order_confirmed',
      title: `Order ${orderNum} Confirmed!`,
      message: `Your grocery order of ₹${finalTotal} has been received. Kabirkrupa staff is preparing your items.`,
      orderId: newOrder.id,
      badgeText: 'Order Placed',
    });

    return newOrder;
  };

  const reorderItems = (order: Order) => {
    order.items.forEach((cItem) => {
      const freshItem = items.find((i) => i.id === cItem.item.id) || cItem.item;
      addToCart(freshItem, cItem.quantity);
    });
    setIsCartOpen(true);
    addNotification({
      type: 'order_confirmed',
      title: `Items from Order ${order.orderNumber} added to Cart`,
      message: `${order.items.length} items added with current real-time prices.`,
      badgeText: 'Re-order',
    });
  };

  const advanceOrderStatus = (orderId: string, nextStatus?: OrderStatus) => {
    const statusProgression: OrderStatus[] = ['placed', 'confirmed', 'packing', 'out_for_delivery', 'delivered'];

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        const currentIndex = statusProgression.indexOf(ord.status);
        const targetStatus = nextStatus || statusProgression[Math.min(statusProgression.length - 1, currentIndex + 1)];
        const targetIndex = statusProgression.indexOf(targetStatus);

        const updatedTimeline = ord.timeline.map((step, idx) => {
          if (idx < targetIndex) {
            return { ...step, completed: true, current: false, time: step.time === 'Pending' ? 'Done' : step.time };
          } else if (idx === targetIndex) {
            return { ...step, completed: true, current: true, time: 'Just now' };
          }
          return { ...step, completed: false, current: false };
        });

        const updatedOrder: Order = {
          ...ord,
          status: targetStatus,
          timeline: updatedTimeline,
        };

        if (activeTrackingOrder?.id === orderId) {
          setActiveTrackingOrder(updatedOrder);
        }

        // Notification for status change
        let statusTitle = `Order ${ord.orderNumber} Update`;
        let statusMsg = `Status is now ${targetStatus}`;
        if (targetStatus === 'packing') {
          statusTitle = `Order ${ord.orderNumber} is Being Packed`;
          statusMsg = `Storekeeper is freshly weighing and sealing your groceries.`;
        } else if (targetStatus === 'out_for_delivery') {
          statusTitle = `Order ${ord.orderNumber} is Out for Local Delivery!`;
          statusMsg = `${ord.deliveryPartner.name} has picked up your bags and is riding toward your address.`;
        } else if (targetStatus === 'delivered') {
          statusTitle = `Order ${ord.orderNumber} Delivered!`;
          statusMsg = `Groceries handed over at your doorstep. Thank you for shopping with Kabirkrupa!`;
        }

        addNotification({
          type: 'delivery_update',
          title: statusTitle,
          message: statusMsg,
          orderId: ord.id,
          badgeText: targetStatus.replace('_', ' ').toUpperCase(),
        });

        return updatedOrder;
      })
    );
  };

  const trackOrder = (order: Order) => {
    setActiveTrackingOrder(order);
    setIsTrackingModalOpen(true);
  };

  // Inventory & Price changes
  const updateItemStock = (itemId: string, newStock: number, note = 'Inventory adjustment') => {
    setItems((prev) => {
      const target = prev.find((i) => i.id === itemId);
      if (!target) return prev;
      const oldStock = target.stockCount;

      const log: InventoryLog = {
        id: `log-${Date.now()}`,
        itemId,
        itemName: target.name,
        type: newStock > oldStock ? 'stock_restock' : 'stock_drop',
        oldVal: oldStock,
        newVal: newStock,
        timestamp: 'Just now',
        note,
      };
      setInventoryLogs((l) => [log, ...l.slice(0, 19)]);

      if (newStock <= target.minStockThreshold && oldStock > target.minStockThreshold) {
        addNotification({
          type: 'inventory_low',
          title: `Low Stock Alert: ${target.name}`,
          message: `Only ${newStock} units left at Kabirkrupa shelf.`,
          itemId,
          badgeText: 'Low Stock',
        });
      } else if (newStock > oldStock && oldStock === 0) {
        addNotification({
          type: 'inventory_restock',
          title: `Restocked: ${target.name}`,
          message: `${target.name} is back in stock with ${newStock} fresh units.`,
          itemId,
          badgeText: 'Restocked',
        });
      }

      return prev.map((i) => (i.id === itemId ? { ...i, stockCount: Math.max(0, newStock) } : i));
    });
  };

  const updateItemPrice = (itemId: string, newPrice: number, reason = 'Navi Mandi rate update') => {
    setItems((prev) => {
      const target = prev.find((i) => i.id === itemId);
      if (!target) return prev;
      const oldPrice = target.currentPrice;
      const priceDropPct = oldPrice > newPrice ? Math.round(((oldPrice - newPrice) / oldPrice) * 1000) / 10 : 0;

      const newHistory = [
        ...target.priceHistory,
        {
          date: 'Just now',
          price: newPrice,
          marketRate: Math.round(newPrice * 1.02),
          note: reason,
        },
      ];

      const log: InventoryLog = {
        id: `log-${Date.now()}`,
        itemId,
        itemName: target.name,
        type: 'price_update',
        oldVal: oldPrice,
        newVal: newPrice,
        timestamp: 'Just now',
        note: reason,
      };
      setInventoryLogs((l) => [log, ...l.slice(0, 19)]);

      // If price dropped and user was tracking it
      if (newPrice < oldPrice) {
        addNotification({
          type: 'price_drop',
          title: `Navi Price Drop: ${target.name}`,
          message: `Price dropped to ₹${newPrice} (-${priceDropPct}%). Save ₹${oldPrice - newPrice} per ${target.unit}!`,
          itemId,
          badgeText: `Save ₹${oldPrice - newPrice}`,
        });
      }

      return prev.map((i) =>
        i.id === itemId
          ? {
              ...i,
              previousPrice: oldPrice,
              currentPrice: newPrice,
              priceDropPercentage: priceDropPct,
              priceHistory: newHistory,
            }
          : i
      );
    });
  };

  // Simulation triggers for testing & demonstration
  const simulateQuickInventoryEvent = () => {
    const randomIndex = Math.floor(Math.random() * items.length);
    const item = items[randomIndex];
    const isRestock = item.stockCount < 10;
    const change = isRestock ? Math.floor(Math.random() * 20 + 10) : -Math.floor(Math.random() * 3 + 1);
    const newStock = Math.max(0, item.stockCount + change);
    updateItemStock(
      item.id,
      newStock,
      isRestock ? 'Fresh morning stock unloading from supplier' : 'Counter customer walk-in checkout'
    );
  };

  const simulateNaviPriceDropEvent = () => {
    const trackedItems = items.filter((i) => trackedItemIds.includes(i.id));
    const pool = trackedItems.length > 0 ? trackedItems : items;
    const item = pool[Math.floor(Math.random() * pool.length)];
    const dropAmount = Math.max(5, Math.floor(item.currentPrice * 0.08));
    const newPrice = Math.max(20, item.currentPrice - dropAmount);
    updateItemPrice(item.id, newPrice, 'Navi APMC Mandi wholesale price correction');
  };

  return (
    <GroceryContext.Provider
      value={{
        items,
        cart,
        orders,
        notifications,
        inventoryLogs,
        deliverySlots,
        selectedSlot,
        trackedItemIds,
        activeTrackingOrder,
        unreadCount,
        cartTotal,
        cartSubtotal,
        cartItemCount,
        cartSavings,
        isCartOpen,
        isNotificationsOpen,
        isLiveInventoryOpen,
        isStoreManagerOpen,
        isTrackingModalOpen,
        activeProductModal,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        setIsCartOpen,
        setIsNotificationsOpen,
        setIsLiveInventoryOpen,
        setIsStoreManagerOpen,
        setIsTrackingModalOpen,
        setActiveProductModal,
        setSelectedSlot,
        setActiveTrackingOrder,
        togglePriceAlert,
        isItemTracked,
        placeOrder,
        reorderItems,
        advanceOrderStatus,
        trackOrder,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addNotification,
        updateItemStock,
        updateItemPrice,
        simulateQuickInventoryEvent,
        simulateNaviPriceDropEvent,
      }}
    >
      {children}
    </GroceryContext.Provider>
  );
};

export const useGrocery = () => {
  const context = useContext(GroceryContext);
  if (!context) {
    throw new Error('useGrocery must be used within a GroceryProvider');
  }
  return context;
};
