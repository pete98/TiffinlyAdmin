import { apiClient } from "./api";
import { Order, OrderFormData, OrderFilters } from "./types";
import { API_ENDPOINTS } from "./constants";

const ORDERS_API = API_ENDPOINTS.ORDERS;
const MENU_ITEMS_API = API_ENDPOINTS.MENU_ITEMS;

export class OrderService {
  // Fetch all orders - Admin endpoint
  static async getOrders(): Promise<Order[]> {
    try {
      const ordersData = await apiClient.get<Order[]>(ORDERS_API);
      
      // Transform and validate order data to ensure all required fields are present
      const transformedOrders = (ordersData || []).map(order => this.transformOrderData(order));
      
      return transformedOrders;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  // Get order by ID - Admin endpoint
  static async getOrderById(id: number): Promise<Order> {
    try {
      const order = await apiClient.get<Order>(`${ORDERS_API}/admin/${id}`);
      return this.transformOrderData(order);
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  }

  // Create new order - Admin endpoint
  static async createOrder(orderData: OrderFormData): Promise<Order> {
    try {
      const order = await apiClient.post<Order>(ORDERS_API, orderData);
      return order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  // Update existing order - Admin endpoint
  static async updateOrder(id: number, orderData: OrderFormData): Promise<Order> {
    try {
      const order = await apiClient.put<Order>(`${ORDERS_API}/admin/${id}`, orderData);
      return order;
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  }

  // Delete order - Admin endpoint
  static async deleteOrder(id: number): Promise<void> {
    try {
      await apiClient.delete(`${ORDERS_API}/admin/${id}`);
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  }

  // Update order status - Admin endpoint
  static async updateOrderStatus(id: number, status: Order["status"]): Promise<void> {
    try {
      await apiClient.patch(`${ORDERS_API}/admin/${id}/status`, { status });
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  // Fetch menu items for order creation
  static async getMenuItems(): Promise<any[]> {
    try {
      const data = await apiClient.get<any>(MENU_ITEMS_API);
      
      // Handle different response structures
      let menuItemsData: any[] = [];
      if (Array.isArray(data)) {
        menuItemsData = data;
      } else if (data && Array.isArray(data.data)) {
        menuItemsData = data.data;
      } else if (data && Array.isArray(data.menuItems)) {
        menuItemsData = data.menuItems;
      } else if (data && Array.isArray(data.items)) {
        menuItemsData = data.items;
      } else {
        console.warn('Unexpected menu items API response structure:', data);
        menuItemsData = [];
      }
      
      return menuItemsData;
    } catch (error) {
      console.error('Error fetching menu items:', error);
      throw error;
    }
  }

  // Filter orders based on search criteria
  static filterOrders(orders: Order[], filters: OrderFilters): Order[] {
    return orders.filter((order) => {
      // Search across multiple fields
      const searchMatch = !filters.search || 
        order.customerName?.toLowerCase().includes(filters.search.toLowerCase()) ||
        order.customerPhone?.includes(filters.search) ||
        order.customerEmail?.toLowerCase().includes(filters.search.toLowerCase()) ||
        order.deliveryAddress?.toLowerCase().includes(filters.search.toLowerCase()) ||
        order.status?.toLowerCase().includes(filters.search.toLowerCase()) ||
        order.storeName?.toLowerCase().includes(filters.search.toLowerCase());

      // Status filter
      const statusMatch = !filters.status || order.status === filters.status;

      // Payment status filter
      const paymentStatusMatch = !filters.paymentStatus || order.paymentStatus === filters.paymentStatus;

      // Subscription status filter
      const subscriptionStatusMatch = !filters.subscriptionStatus || order.subscriptionStatus === filters.subscriptionStatus;

      // Date range filter
      let dateMatch = true;
      if (filters.dateRange) {
        const orderDate = new Date(order.orderDate);
        const startDate = new Date(filters.dateRange.start);
        const endDate = new Date(filters.dateRange.end);
        dateMatch = orderDate >= startDate && orderDate <= endDate;
      }

      return searchMatch && statusMatch && paymentStatusMatch && subscriptionStatusMatch && dateMatch;
    });
  }

  // Calculate order statistics
  static calculateOrderStats(orders: Order[]) {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const statusCounts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const paymentStatusCounts = orders.reduce((acc, order) => {
      acc[order.paymentStatus] = (acc[order.paymentStatus] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalOrders,
      totalRevenue,
      statusCounts,
      paymentStatusCounts,
      averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0
    };
  }

  // Transform order data to ensure all required fields are present
  private static transformOrderData(order: Order): Order {
    // Ensure items have all required fields
    const transformedItems = order.items.map(item => ({
      ...item,
      // Handle new API structure
      productId: item.productId || item.menuItemId || 0,
      productType: item.productType || "menu_item_component",
      productName: item.productName || item.menuItemName || "Unknown Item",
      componentType: item.componentType,
      // Handle legacy fields for backward compatibility
      menuItemId: item.menuItemId || item.productId,
      menuItemName: item.menuItemName || item.productName,
      unitPrice: Number(item.unitPrice) || Number(item.price) || 0,
      totalPrice: Number(item.totalPrice) || Number(item.subtotal) || 0,
      chargedAmount: Number(item.chargedAmount) || (item.isProIncluded ? 0 : (Number(item.subtotal) || 0)),
      isProIncluded: Boolean(item.isProIncluded),
      subtotal: Number(item.subtotal) || Number(item.totalPrice) || 0,
      price: Number(item.price) || Number(item.unitPrice) || 0,
      quantity: Number(item.quantity) || 0,
    }));

    // Calculate charged amount if not provided
    let chargedAmount = Number(order.chargedAmount);
    if (isNaN(chargedAmount) || chargedAmount < 0) {
      chargedAmount = transformedItems.reduce((total, item) => total + item.chargedAmount, 0);
    }

    // Ensure order has all required fields
    return {
      ...order,
      items: transformedItems,
      totalAmount: Number(order.totalAmount) || 0,
      subtotal: Number(order.subtotal) || Number(order.totalAmount) || 0,
      chargedAmount,
      isActive: Boolean(order.isActive),
      storeId: Number(order.storeId) || 0,
      storeName: order.storeName || "Unknown Store",
      fulfillmentMode: order.fulfillmentMode || "DELIVERY",
      stripePaymentIntentId: order.stripePaymentIntentId || null,
      createdAt: order.createdAt || order.orderDate || new Date().toISOString(),
      updatedAt: order.updatedAt || order.orderDate || new Date().toISOString(),
    };
  }
} 