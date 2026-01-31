import axios from "axios";

import { GetProductDto, GetProductsDto } from "../model/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://app.tablecrm.com/api/v1/mp";

/**
 * Извлекает автоматически определенный город из тела JSON ответа
 * Бэкенд возвращает detected_city, detected_lat, detected_lon в теле ответа
 */
export function getDetectedCityFromResponse(data: any): {
  city: string;
  lat: number;
  lon: number;
} | null {
  try {
    // Проверяем наличие полей в теле ответа
    if (data?.detected_city && data?.detected_lat != null && data?.detected_lon != null) {
      const city = String(data.detected_city);
      const lat = parseFloat(String(data.detected_lat));
      const lon = parseFloat(String(data.detected_lon));
      
      if (!Number.isNaN(lat) && !Number.isNaN(lon) && city) {
        return { city, lat, lon };
      }
    }
  } catch (error) {
    console.error("Error parsing detected city from response body:", error);
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
    // Если координат нет в params, но есть в sessionStorage (автоматически определенный город) - используем их
    if (params.lat != null) {
      requestParams.lat = params.lat;
    } else if (typeof window !== 'undefined') {
      try {
        const detected = sessionStorage.getItem('detected_city');
        if (detected) {
          const parsed = JSON.parse(detected);
          if (parsed.lat != null) {
            requestParams.lat = parsed.lat;
            console.log('[DEBUG fetchProducts] Используем lat из sessionStorage:', parsed.lat);
          }
        }
      } catch (e) {
        // Игнорируем ошибки
      }
    }
    
    if (params.lon != null) {
      requestParams.lon = params.lon;
    } else if (typeof window !== 'undefined') {
      try {
        const detected = sessionStorage.getItem('detected_city');
        if (detected) {
          const parsed = JSON.parse(detected);
          if (parsed.lon != null) {
            requestParams.lon = parsed.lon;
            console.log('[DEBUG fetchProducts] Используем lon из sessionStorage:', parsed.lon);
          }
        }
      } catch (e) {
        // Игнорируем ошибки
      }
    }
    
    console.log('[DEBUG fetchProducts] Параметры запроса:', {
      lat: requestParams.lat,
      lon: requestParams.lon,
      address: requestParams.address,
      city: params.city,
    });
    
    // Удаляем undefined значения из параметров
    Object.keys(requestParams).forEach(key => {
      if (requestParams[key] === undefined) {
        delete requestParams[key];
      }
    });
    
    // Используем fetch для получения данных
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
    
    // Парсим данные из ответа
    const fetchData = await fetchResponse.json();
    
    // Извлекаем автоматически определенный город из тела ответа
    const detectedCity = getDetectedCityFromResponse(fetchData);
    if (detectedCity) {
      console.log('[DEBUG] Автоматически определенный город из IP:', detectedCity);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('detected_city', JSON.stringify(detectedCity));
        // Отправляем кастомное событие для обновления UI
        window.dispatchEvent(new CustomEvent('detectedCityUpdated'));
      }
    }
    
    return fetchData;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Функция для получения автоматически определенного города (делает запрос без параметров локации)
export const fetchDetectedCity = async (): Promise<{ city: string; lat: number; lon: number } | null> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products`, {
      params: { size: 1 },
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Бэкенд возвращает detected_city, detected_lat, detected_lon в теле ответа
    return getDetectedCityFromResponse(response.data);
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
    
    let lat = params.lat;
    let lon = params.lon;
    
    // Если координат нет в параметрах, проверяем sessionStorage (автоматически определенный город)
    if ((lat == null || lon == null) && typeof window !== 'undefined') {
      try {
        const detected = sessionStorage.getItem('detected_city');
        if (detected) {
          const parsed = JSON.parse(detected);
          if (lat == null && parsed.lat != null) {
            lat = parsed.lat;
            console.log('[DEBUG fetchProduct] Используем lat из sessionStorage:', parsed.lat);
          }
          if (lon == null && parsed.lon != null) {
            lon = parsed.lon;
            console.log('[DEBUG fetchProduct] Используем lon из sessionStorage:', parsed.lon);
          }
        }
      } catch (e) {
        // Игнорируем ошибки
      }
    }
    
    const requestParams: { lat?: number; lon?: number; address?: string } = {
      lat: lat,
      lon: lon,
      address: addressParam,
    };
    
    console.log('[DEBUG fetchProduct] Параметры запроса:', {
      product_id: params.product_id,
      lat: requestParams.lat,
      lon: requestParams.lon,
      address: requestParams.address,
    });
    
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