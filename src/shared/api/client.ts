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

export const apiClient = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL || "https://app.tablecrm.com/api/v1/mp",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const phone = getAuthPhone();

  if (!phone) {
    return config;
  }

  const fieldName = config.phoneField || "utm_phone";

  if (config.method === "get" || config.method === "delete") {
    config.params = {
      ...config.params,
      [fieldName]: phone,
    };
  } else {
    if (config.data instanceof FormData) {
      config.data.append(fieldName, phone);
    } else {
      config.data = {
        ...config.data,
        [fieldName]: phone,
      };
    }
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
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
