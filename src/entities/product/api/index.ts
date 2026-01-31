import axios from "axios";
import { AxiosResponse } from "axios";

import { GetProductDto, GetProductsDto } from "../model/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://app.tablecrm.com/api/v1/mp";

/**
 * Извлекает автоматически определенный город из заголовков HTTP ответа
 */
export function getDetectedCityFromResponse(response: AxiosResponse): {
  city: string;
  lat: number;
  lon: number;
} | null {
  try {
    const headers = response.headers;
    
    // AxiosHeaders может иметь метод get(), пробуем разные способы доступа
    let cityHeader: string | undefined;
    let latHeader: string | undefined;
    let lonHeader: string | undefined;
    
    // Пробуем через прямое обращение
    cityHeader = headers['x-detected-city'] || headers['X-Detected-City'];
    latHeader = headers['x-detected-lat'] || headers['X-Detected-Lat'];
    lonHeader = headers['x-detected-lon'] || headers['X-Detected-Lon'];
    
    // Если не нашли, пробуем через метод get() (если есть)
    if (!cityHeader && typeof (headers as any).get === 'function') {
      cityHeader = (headers as any).get('x-detected-city') || (headers as any).get('X-Detected-City');
      latHeader = (headers as any).get('x-detected-lat') || (headers as any).get('X-Detected-Lat');
      lonHeader = (headers as any).get('x-detected-lon') || (headers as any).get('X-Detected-Lon');
    }
    
    // Если все еще не нашли, пробуем через Object.keys и поиск
    if (!cityHeader) {
      const headerKeys = Object.keys(headers);
      const cityKey = headerKeys.find(k => k.toLowerCase() === 'x-detected-city');
      const latKey = headerKeys.find(k => k.toLowerCase() === 'x-detected-lat');
      const lonKey = headerKeys.find(k => k.toLowerCase() === 'x-detected-lon');
      
      if (cityKey) cityHeader = headers[cityKey] as string;
      if (latKey) latHeader = headers[latKey] as string;
      if (lonKey) lonHeader = headers[lonKey] as string;
    }
    
    if (cityHeader && latHeader && lonHeader) {
      // Бэкенд кодирует город через quote(), декодируем через decodeURIComponent
      const city = decodeURIComponent(String(cityHeader));
      const lat = parseFloat(String(latHeader));
      const lon = parseFloat(String(lonHeader));
      
      if (!Number.isNaN(lat) && !Number.isNaN(lon) && city) {
        return { city, lat, lon };
      }
    }
  } catch (error) {
    console.error("Error parsing detected city from headers:", error);
  }
  
  return null;
}

export const fetchProducts = async (params: GetProductsDto) => {
  try {
    // Если есть address - используем его, если нет - используем city как address
    // Это нужно для того, чтобы бэкенд фильтровал цены по городу, а не только сортировал по расстоянию
    // НО: если нет ни address, ни city - НЕ передаем address, чтобы бэкенд мог определить город по IP
    const addressParam = params.address || params.city;
    
    const requestParams: any = {
      page: params.page || 1,
      size: params.size || 20,
      sort_by: params.sort_by,
      sort_order: params.sort_order,
      category: params.category,
      manufacturer: params.manufacturer,
      min_price: params.min_price,
      max_price: params.max_price,
      rating_from: params.rating_from,
      rating_to: params.rating_to,
      in_stock: params.in_stock,
      global_category_id: params.global_category_id,
      seller_id: params.seller_id,
    };
    
    // Передаем address только если он есть (не передаем, если нет ни address, ни city)
    if (addressParam) {
      requestParams.address = addressParam;
    }
    
    // Передаем координаты только если они есть
    if (params.lat != null) {
      requestParams.lat = params.lat;
    }
    if (params.lon != null) {
      requestParams.lon = params.lon;
    }
    
    // Удаляем undefined значения из параметров
    Object.keys(requestParams).forEach(key => {
      if (requestParams[key] === undefined) {
        delete requestParams[key];
      }
    });
    
    // Используем fetch для получения данных и проверки заголовков
    const url = new URL(`${API_BASE_URL}/products`);
    Object.entries(requestParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
    
    const fetchResponse = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Пытаемся извлечь автоматически определенный город из заголовков
    const detectedCityFromFetch = fetchResponse.headers.get('X-Detected-City');
    const detectedLatFromFetch = fetchResponse.headers.get('X-Detected-Lat');
    const detectedLonFromFetch = fetchResponse.headers.get('X-Detected-Lon');
    
    if (detectedCityFromFetch && detectedLatFromFetch && detectedLonFromFetch) {
      try {
        const city = decodeURIComponent(detectedCityFromFetch);
        const lat = parseFloat(detectedLatFromFetch);
        const lon = parseFloat(detectedLonFromFetch);
        if (!Number.isNaN(lat) && !Number.isNaN(lon) && city) {
          const detected = { city, lat, lon };
          console.log('[DEBUG] Автоматически определенный город из IP:', detected);
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('detected_city', JSON.stringify(detected));
          }
        }
      } catch (e) {
        console.error('Ошибка при парсинге автоматически определенного города:', e);
      }
    }
    
    // Парсим и возвращаем данные
    const fetchData = await fetchResponse.json();
    return fetchData;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Функция для получения автоматически определенного города из заголовков ответа
export const getDetectedCityFromResponse = (response: any): { city?: string; lat?: number; lon?: number } | null => {
  if (!response) return null;
  
  // Axios возвращает headers в response.headers
  const headers = response.headers || {};
  
  // Проверяем различные варианты названий заголовков (case-insensitive)
  const cityHeader = headers['x-detected-city'] || 
                     headers['X-Detected-City'] ||
                     (typeof headers.get === 'function' ? headers.get('x-detected-city') : null);
  const lat = headers['x-detected-lat'] || 
              headers['X-Detected-Lat'] ||
              (typeof headers.get === 'function' ? headers.get('x-detected-lat') : null);
  const lon = headers['x-detected-lon'] || 
              headers['X-Detected-Lon'] ||
              (typeof headers.get === 'function' ? headers.get('x-detected-lon') : null);
  
  if (cityHeader) {
    try {
      // Декодируем значение города (бэкенд кодирует через quote())
      const city = decodeURIComponent(String(cityHeader));
      return {
        city: city,
        lat: lat ? Number(lat) : undefined,
        lon: lon ? Number(lon) : undefined,
      };
    } catch (error) {
      // Если декодирование не удалось, используем исходное значение
      console.warn("Failed to decode city header:", error);
      return {
        city: String(cityHeader),
        lat: lat ? Number(lat) : undefined,
        lon: lon ? Number(lon) : undefined,
      };
    }
  }
  
  return null;
};

// Функция для получения автоматически определенного города (делает запрос без параметров локации)
export const fetchDetectedCity = async (): Promise<{ city?: string; lat?: number; lon?: number } | null> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products`, {
      params: { size: 1 },
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return getDetectedCityFromResponse(response);
  } catch (error) {
    console.error("Error fetching detected city:", error);
    return null;
  }
};

export const fetchProduct = async (params: GetProductDto) => {
  try {
    // Если есть address - используем его, если нет - используем city как address
    // Это нужно для того, чтобы бэкенд фильтровал цены по городу, а не только сортировал по расстоянию
    const addressParam = params.address || params.city;
    
    const requestParams: { lat?: number; lon?: number; address?: string } = {
      lat: params.lat,
      lon: params.lon,
      address: addressParam,
    };
    
    // Удаляем undefined значения из параметров
    Object.keys(requestParams).forEach(key => {
      if (requestParams[key as keyof typeof requestParams] === undefined) {
        delete requestParams[key as keyof typeof requestParams];
      }
    });
    
    const response = await axios.get(`${API_BASE_URL}/products/${params.product_id}`, {
      params: Object.keys(requestParams).length > 0 ? requestParams : undefined,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

export const fetchProductServer = async (id: string, lat?: number, lon?: number, address?: string, city?: string) => {
  try {
    // Если есть address - используем его, если нет - используем city как address
    const addressParam = address || city;
    
    const params = new URLSearchParams();
    if (lat != null) {
      params.append('lat', String(lat));
    }
    if (lon != null) {
      params.append('lon', String(lon));
    }
    if (addressParam) {
      params.append('address', addressParam);
    }
    
    const url = `${API_BASE_URL}/products/${id}${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url, {
      cache: "force-cache",
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch product");
    }
    
    return response.json();
  } catch (error) {
    console.error("Error fetching product on server:", error);
    return null;
  }
};