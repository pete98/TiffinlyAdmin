// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// API Endpoints
export const API_ENDPOINTS = {
  STORE: `${API_BASE_URL}/api/store`,
  KITCHEN: `${API_BASE_URL}/api/kitchen`,
  ORDERS: `${API_BASE_URL}/api/orders`,
  MENU_ITEMS: `${API_BASE_URL}/api/menu-items`,
  PRODUCTS: `${API_BASE_URL}/api/products`,
  USERS: `${API_BASE_URL}/api/users`,
  // New user management endpoints
  USER_PROFILE: (auth0Id: string) => `${API_BASE_URL}/api/users/${auth0Id}/extended-profile`,
  USER_SUBSCRIPTION: (auth0Id: string) => `${API_BASE_URL}/api/users/${auth0Id}`,
  USER_SUBSCRIPTION_STATUS: (auth0Id: string) => `${API_BASE_URL}/api/users/${auth0Id}/subscription-status`,
} as const;
