import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

// Token cache to avoid multiple requests
let tokenCache: { token: string | null; expiresAt: number } | null = null;

// Function to clear token cache (useful for logout)
export function clearTokenCache() {
  tokenCache = null;
}

async function getAccessToken(): Promise<string | null> {
  // Check if we have a cached token that's still valid
  if (tokenCache && tokenCache.token && Date.now() < tokenCache.expiresAt) {
    console.log('Using cached access token')
    return tokenCache.token;
  }

  console.log('Fetching new access token...')
  try {
    const response = await axios.get('/api/auth/access-token');
    console.log('Access token response status:', response.status)
    if (response.status === 200) {
      const data = response.data;
      console.log('Access token response data:', data)
      
      // Check if we have alternative token types
      if (data.available_tokens) {
        console.log('Available token types:', data.available_tokens)
      }
      
      // If the access_token is a JWE and we have an id_token, try using that instead
      let tokenToUse = data.access_token;
      if (data.access_token?.startsWith('eyJ') && data.id_token) {
        console.log('Access token appears to be JWE, trying ID token instead')
        tokenToUse = data.id_token;
      }
      
      // Cache the token with expiration
      tokenCache = {
        token: tokenToUse,
        expiresAt: data.expires_at || (Date.now() + 3600000) // Default 1 hour
      };
      
      console.log('Token cached successfully, expires at:', new Date(tokenCache.expiresAt))
      return tokenToUse;
    }
  } catch (error: any) {
    console.error('Failed to get access token:', error)
    console.error('Access token error details:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    })
  }
  
  // Clear cache on error
  tokenCache = null;
  console.log('No access token available')
  return null;
}

// Create axios instance with default config
const createApiInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://3a19295b5657.ngrok-free.app',
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
    },
  });

  // Request interceptor to add auth token
  instance.interceptors.request.use(async (config) => {
    console.log('Request interceptor called for:', config.url)
    
    // Add ngrok-skip-browser-warning header for ngrok URLs
    if (config.url && config.url.includes('ngrok-free.app')) {
      config.headers['ngrok-skip-browser-warning'] = 'true';
    }
    
    const accessToken = await getAccessToken();
    if (accessToken) {
      // Log token details for debugging
      console.log('Token type:', typeof accessToken)
      console.log('Token length:', accessToken.length)
      console.log('Token starts with:', accessToken.substring(0, 20) + '...')
      
      // Check if it's a JWT token (starts with eyJ)
      if (accessToken.startsWith('eyJ')) {
        console.log('This appears to be a JWT token')
      }
      
      // If your backend expects a different token format, you can modify it here
      // For example, if your backend expects just the token without "Bearer ":
      // config.headers.Authorization = accessToken;
      
      // Or if your backend expects a different header name:
      // config.headers['X-Auth-Token'] = accessToken;
      
      // Default: Bearer token format
      config.headers.Authorization = `Bearer ${accessToken}`;
      console.log('Bearer token added to request')
      console.log('Request headers:', config.headers)
    } else {
      console.log('No bearer token available')
      console.log('Request headers:', config.headers)
    }
    return config;
  });

  // Response interceptor for error handling
  instance.interceptors.response.use(
    (response) => {
      console.log('Response interceptor - success for:', response.config.url)
      return response;
    },
    (error) => {
      console.log('Response interceptor - error for:', error.config?.url, error.message)
      console.log('Full error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        url: error.config?.url,
        method: error.config?.method
      })
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const errorMessage = error.response.data || error.response.statusText || "API error";
        return Promise.reject(new Error(errorMessage));
      } else if (error.request) {
        // The request was made but no response was received
        return Promise.reject(new Error("No response received from server"));
      } else {
        // Something happened in setting up the request that triggered an Error
        return Promise.reject(new Error(error.message || "Request setup error"));
      }
    }
  );

  return instance;
};

const api = createApiInstance();

// Generic API methods
export const apiClient = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    console.log('apiClient.get called with URL:', url)
    return api.get(url, config).then((response: AxiosResponse<T>) => {
      console.log('apiClient.get response received for:', url)
      return response.data
    })
  },
  
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => 
    api.post(url, data, config).then((response: AxiosResponse<T>) => response.data),
  
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => 
    api.put(url, data, config).then((response: AxiosResponse<T>) => response.data),
  
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => 
    api.patch(url, data, config).then((response: AxiosResponse<T>) => response.data),
  
  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => 
    api.delete(url, config).then((response: AxiosResponse<T>) => response.data),
};

// Legacy compatibility function (maintains the same interface as the old apiFetch)
export async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const method = options?.method || 'GET';
  const config: AxiosRequestConfig = {
    headers: options?.headers as Record<string, string>,
  };

  // Handle body for POST, PUT, PATCH requests
  if (options?.body && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
    config.data = options.body;
  }

  switch (method.toUpperCase()) {
    case 'GET':
      return apiClient.get<T>(url, config);
    case 'POST':
      return apiClient.post<T>(url, config.data, config);
    case 'PUT':
      return apiClient.put<T>(url, config.data, config);
    case 'PATCH':
      return apiClient.patch<T>(url, config.data, config);
    case 'DELETE':
      return apiClient.delete<T>(url, config);
    default:
      throw new Error(`Unsupported HTTP method: ${method}`);
  }
}

export default apiClient; 