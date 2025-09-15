export interface NutritionComponent {
  name: string;
  calories: number;
}

export interface NutritionFacts {
  servingSize: string | null;
  components: NutritionComponent[];
  totalCalories: number | null;
}

export interface MenuItem {
  id: number;
  mainItem: string;
  mainItemQuantity: number;
  secondaryItem: string;
  secondaryItemQuantity: number;
  sideItem: string;
  sideItemQuantity: number;
  price: number;
  imageUrl: string;
  description: string;
  weekday: string;
  weekDate: string;
  isActive: boolean;
  nutritionFacts?: NutritionFacts;
}

export interface MenuItemFormValues {
  mainItem: string;
  mainItemQuantity: number;
  secondaryItem: string;
  secondaryItemQuantity: number;
  sideItem: string;
  sideItemQuantity: number;
  price: number;
  imageUrl: string;
  description: string;
  weekday: string;
  weekDate: string;
  isActive: boolean;
  nutritionFacts?: NutritionFacts;
}

export interface MenuItemComponent {
  itemName: string;
  quantity: number;
  itemType: "main" | "secondary" | "side";
}

// Order Management Types - Updated to match actual API response
export interface OrderItem {
  id: number;
  productId: number;
  productType: "menu_item_component" | "add_on";
  productName: string;
  componentType?: "main" | "secondary" | "side"; // For menu item components
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  chargedAmount: number;
  isProIncluded: boolean;
  // New field for menu item components
  menuItemComponents?: MenuItemComponent[];
  // Legacy fields for backward compatibility
  menuItemId?: number;
  menuItemName?: string;
  price?: number;
  subtotal?: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryAddress: string;
  items: OrderItem[];
  totalAmount: number;
  subtotal: number;
  chargedAmount: number;
  subscriptionStatus: "active" | "inactive" | "expired";
  status: "PENDING" | "CONFIRMED" | "PREPARING" | "READY_FOR_PICKUP" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED";
  orderDate: string;
  deliveryDate: string;
  paymentMethod: "cash" | "card" | "upi";
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  notes: string;
  isActive: boolean;
  storeId: number;
  storeName: string;
  fulfillmentMode?: "PICKUP" | "DELIVERY";
  stripePaymentIntentId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrderFormData {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryAddress: string;
  orderDate: string;
  deliveryDate: string;
  paymentMethod: "cash" | "card" | "upi";
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  status: "PENDING" | "CONFIRMED" | "PREPARING" | "READY_FOR_PICKUP" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED";
  notes?: string;
  items: OrderItem[];
  totalAmount: number;
  subtotal: number;
  chargedAmount: number;
  subscriptionStatus: "active" | "inactive" | "expired";
  storeId: number;
  storeName: string;
  storeAddress?: string;
  storeHours?: string;
  fulfillmentMode?: "PICKUP" | "DELIVERY";
  orderNumber?: string;
  store?: {
    id: number;
    name: string;
    address: string;
  };
}

export interface OrderFilters {
  search: string;
  status?: Order["status"];
  paymentStatus?: Order["paymentStatus"];
  subscriptionStatus?: Order["subscriptionStatus"];
  dateRange?: {
    start: string;
    end: string;
  };
  storeId?: number;
} 

// User Management Types - Updated to match new API format
export interface UserProfile {
  auth0Id: string;
  firstName?: string | null;
  lastName?: string | null;
  phoneNumber?: string | null;
  birthDate?: string | null;
  streetAddress?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  country?: string | null;
  foodPreference?: string | null;
  stripeCustomerId?: string | null;
  subscriptionStatus?: "active" | "inactive" | "expired" | "cancelled" | null;
  subscriptionId?: string | null;
  subscriptionType?: "monthly" | "weekly" | "daily" | "yearly" | "custom" | null;
}

export interface UserProfileUpdate {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  birthDate?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  foodPreference?: string;
}

export interface UserSubscriptionUpdate {
  firstName?: string;
  lastName?: string;
  stripeCustomerId?: string;
  subscriptionStatus?: "active" | "inactive" | "expired" | "cancelled";
  subscriptionId?: string;
  subscriptionType?: "monthly" | "weekly" | "daily" | "yearly" | "custom";
}

export interface UserBasicInfo {
  id: string;
  auth0Id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  stripeCustomerId: string;
  subscriptionStatus: "active" | "inactive" | "expired" | "cancelled";
  subscriptionId: string;
} 