import { apiClient } from "./api";
import { API_ENDPOINTS } from "./constants";

const STORE_API = API_ENDPOINTS.STORE;

export interface Store {
  id: number;
  name: string;
  city: string;
  kitchen: string | { id: number; name: string };
  status: string;
}

export class StoreService {
  // Fetch all stores
  static async getStores(): Promise<Store[]> {
    try {
      const data = await apiClient.get<any>(STORE_API);
      
      // Handle different response structures
      let storesData: Store[] = [];
      if (Array.isArray(data)) {
        storesData = data;
      } else if (data && Array.isArray(data.data)) {
        storesData = data.data;
      } else if (data && Array.isArray(data.stores)) {
        storesData = data.stores;
      } else if (data && Array.isArray(data.items)) {
        storesData = data.items;
      } else {
        console.warn('Unexpected stores API response structure:', data);
        storesData = [];
      }
      
      return storesData;
    } catch (error) {
      console.error('Error fetching stores:', error);
      throw error;
    }
  }

  // Get store by ID
  static async getStoreById(id: number): Promise<Store> {
    try {
      const store = await apiClient.get<Store>(`${STORE_API}/${id}`);
      return store;
    } catch (error) {
      console.error('Error fetching store:', error);
      throw error;
    }
  }
} 