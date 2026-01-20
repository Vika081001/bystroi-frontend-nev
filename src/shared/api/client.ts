import { QueryClient } from "@tanstack/react-query";
import axios, { InternalAxiosRequestConfig } from "axios";

declare module "axios" {
  export interface AxiosRequestConfig {
    phoneField?: string;
  }
}

let getAuthPhone: () => string | null = () => null;

export const configureAuth = (getter: () => string | null) => {
  getAuthPhone = getter;
};

export const baseURL =
  process.env.NEXT_PUBLIC_API_URL || "https://app.tablecrm.com/api/v1/mp";

export const apiClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    'Accept': 'application/json',
  },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (config.url && config.url.startsWith('http://')) {
    config.url = config.url.replace('http://', 'https://');
  }
  
  if (config.baseURL && config.baseURL.startsWith('http://')) {
    config.baseURL = config.baseURL.replace('http://', 'https://');
  }
  
  const phone = getAuthPhone();

  if (!phone) {
    return config;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Выводим подробную информацию об ошибке только если есть данные
    const errorData = error.response?.data;
    const errorMessage = error.message || "Unknown error";
    
    if (errorData && Object.keys(errorData).length > 0) {
      console.error("API Error:", errorData);
    } else if (errorMessage) {
      console.error("API Error:", errorMessage);
    }
    
    if (error.config) {
      console.error("Request URL:", error.config.url || error.config.baseURL + error.config.url);
      if (error.config.params && Object.keys(error.config.params).length > 0) {
        console.error("Request Params:", error.config.params);
      }
      if (error.config.data && Object.keys(error.config.data).length > 0) {
        console.error("Request Body:", error.config.data);
      }
      if (error.response?.status) {
        console.error("Response Status:", error.response.status);
      }
    }
    return Promise.reject(error);
  },
);

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});