export interface PriceHistoryPoint {
  date: string;
  price: number;
  marketRate?: number;
  note?: string;
}

export interface GroceryItem {
  id: string;
  name: string;
  localName: string; // Gujarati / Hindi traditional name
  category: 'Grains & Flours' | 'Pure Ghee & Oils' | 'Spices & Masalas' | 'Pulses & Dals' | 'Daily Kirana & Tea' | 'Dry Fruits';
  unit: string;
  currentPrice: number;
  previousPrice: number;
  mrp: number;
  stockCount: number;
  minStockThreshold: number;
  isOrganic?: boolean;
  isBestseller?: boolean;
  priceDropPercentage?: number;
  priceHistory: PriceHistoryPoint[];
  description: string;
  shelfLife: string;
  origin: string;
  isPriceAlertSet?: boolean;
  targetAlertPrice?: number;
  iconName: string;
  colorTone: string;
}

export interface CartItem {
  item: GroceryItem;
  quantity: number;
}

export interface DeliverySlot {
  id: string;
  title: string;
  subtitle: string;
  type: 'express' | 'scheduled';
  timeEstimate: string;
  price: number;
}

export interface DeliveryAddress {
  fullName: string;
  phone: string;
  flatAndBuilding: string;
  streetAndArea: string;
  locality: string;
  pincode: string;
  deliveryInstructions?: string;
}

export type OrderStatus = 'placed' | 'confirmed' | 'packing' | 'out_for_delivery' | 'delivered';

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  savings: number;
  total: number;
  deliverySlot: DeliverySlot;
  address: DeliveryAddress;
  paymentMethod: 'Cash on Delivery' | 'UPI QR on Delivery' | 'Online Prepaid';
  status: OrderStatus;
  createdAt: string;
  estimatedDeliveryTime: string;
  deliveryPartner: {
    name: string;
    phone: string;
    vehicle: string;
    rating: number;
  };
  timeline: {
    status: OrderStatus;
    label: string;
    time: string;
    completed: boolean;
    current: boolean;
  }[];
}

export interface AppNotification {
  id: string;
  type: 'price_drop' | 'inventory_low' | 'inventory_restock' | 'delivery_update' | 'order_confirmed';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  itemId?: string;
  orderId?: string;
  badgeText?: string;
}

export interface InventoryLog {
  id: string;
  itemId: string;
  itemName: string;
  type: 'stock_drop' | 'stock_restock' | 'price_update' | 'sale';
  oldVal: number;
  newVal: number;
  timestamp: string;
  note: string;
}
