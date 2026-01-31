import { City } from "@/shared/types/city";

/**
 * Получает координаты автоматически определенного города из sessionStorage
 * Используется для передачи координат в запросы к API без добавления их в URL
 */
export function getDetectedCityCoords(): { lat: number; lon: number } | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const detected = sessionStorage.getItem('detected_city');
    if (detected) {
      const parsed = JSON.parse(detected);
      if (parsed.lat != null && parsed.lon != null) {
        return { lat: parsed.lat, lon: parsed.lon };
      }
    }
  } catch (e) {
    // Игнорируем ошибки
  }
  
  return null;
}

const CITIES_CACHE_KEY = "bystroi_cities_cache";
const CITIES_URL = "https://raw.githubusercontent.com/arbaev/russia-cities/refs/heads/master/russia-cities.json";

let citiesCache: City[] | null = null;

/**
 * Загружает список городов и кэширует его
 */
export async function loadCities(): Promise<City[]> {
  if (citiesCache) {
    return citiesCache;
  }

  try {
    // Пытаемся загрузить из кэша localStorage
    const cached = localStorage.getItem(CITIES_CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached) as { cities: City[]; timestamp: number };
      const cacheTime = parsed.timestamp;
      const now = Date.now();
      // Кэш действителен 24 часа
      if (now - cacheTime < 24 * 60 * 60 * 1000 && parsed.cities) {
        citiesCache = parsed.cities;
        return citiesCache;
      }
    }

    // Загружаем с сервера
    const response = await fetch(CITIES_URL);
    const cities: City[] = await response.json();
    
    // Сохраняем в кэш
    citiesCache = cities;
    localStorage.setItem(CITIES_CACHE_KEY, JSON.stringify({
      cities,
      timestamp: Date.now(),
    }));

    return cities;
  } catch (error) {
    console.error("Error loading cities:", error);
    return [];
  }
}

/**
 * Преобразует slug города (например, "bryansk") в полное название (например, "Брянск")
 */
export async function getCityNameFromSlug(slug: string): Promise<string | null> {
  if (!slug) return null;

  const cities = await loadCities();
  const normalizedSlug = slug.toLowerCase().trim();
  
  const city = cities.find(c => 
    c.name_en?.toLowerCase() === normalizedSlug ||
    c.name.toLowerCase() === normalizedSlug ||
    c.name_alt?.toLowerCase() === normalizedSlug
  );

  return city?.name || null;
}

/**
 * Синхронная версия - использует кэш, если он доступен
 */
export function getCityNameFromSlugSync(slug: string): string | null {
  if (!slug) return null;

  // Пытаемся использовать кэш
  if (!citiesCache) {
    try {
      const cached = localStorage.getItem(CITIES_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        citiesCache = parsed.cities;
      }
    } catch (error) {
      console.error("Error reading cities cache:", error);
    }
  }

  if (!citiesCache) {
    return null;
  }

  const normalizedSlug = slug.toLowerCase().trim();
  
  const city = citiesCache.find(c => 
    c.name_en?.toLowerCase() === normalizedSlug ||
    c.name.toLowerCase() === normalizedSlug ||
    c.name_alt?.toLowerCase() === normalizedSlug
  );

  return city?.name || null;
}

/**
 * Получает координаты из sessionStorage (автоматически определенный город)
 */
export function getCoordinatesFromSessionStorage(): { lat?: number; lon?: number } | null {
  if (typeof window === 'undefined') return null;
  try {
    const detected = sessionStorage.getItem('detected_city');
    if (detected) {
      const parsed = JSON.parse(detected);
      if (parsed.lat != null && parsed.lon != null) {
        return { lat: parsed.lat, lon: parsed.lon };
      }
    }
  } catch (e) {
    console.error("Error parsing detected city from sessionStorage:", e);
  }
  return null;
}

/**
 * Получает параметры адреса с приоритетом:
 * 1. Параметры из URL (если есть)
 * 2. Вручную введенный адрес из localStorage (manual: true)
 * 3. Автоматически определенный город из sessionStorage (НЕ возвращается, используется только для API запросов)
 */
export function getLocationParams(): {
  address?: string;
  city?: string;
  lat?: number;
  lon?: number;
} {
  if (typeof window === 'undefined') {
    return {};
  }

  // 1. Сначала проверяем параметры из URL (они имеют приоритет)
  const urlParams = new URLSearchParams(window.location.search);
  const addressFromUrl = urlParams.get('address');
  const cityFromUrl = urlParams.get('city');
  const latFromUrl = urlParams.get('lat');
  const lonFromUrl = urlParams.get('lon');

  if (addressFromUrl || cityFromUrl) {
    return {
      address: addressFromUrl || undefined,
      city: cityFromUrl || undefined,
      lat: latFromUrl ? Number(latFromUrl) : undefined,
      lon: lonFromUrl ? Number(lonFromUrl) : undefined,
    };
  }

  // 2. Проверяем вручную введенный адрес из localStorage
  const storageKey = 'bystroi_location';
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const parsed = JSON.parse(stored) as { 
        address?: string; 
        city?: string; 
        lat?: number; 
        lon?: number;
        manual?: boolean;
      };
      // Если адрес был введен вручную, используем его
      if (parsed.manual && (parsed.address || parsed.city)) {
        return {
          address: parsed.address,
          city: parsed.city,
          lat: parsed.lat,
          lon: parsed.lon,
        };
      }
    }
  } catch (e) {
    // Игнорируем ошибки
  }

  // 3. Автоматически определенный город НЕ возвращаем для URL параметров
  // Он используется только внутри API запросов
  return {};
}

/**
 * Генерирует строку параметров адреса для URL
 * Параметры добавляются ТОЛЬКО если есть вручную введенный адрес (manual: true) или параметры в URL
 * Автоматически определенный город по IP НЕ добавляется в URL
 */
export function getLocationParamsString(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  // 1. Сначала проверяем параметры из URL
  const urlParams = new URLSearchParams(window.location.search);
  const addressFromUrl = urlParams.get('address');
  const cityFromUrl = urlParams.get('city');
  const latFromUrl = urlParams.get('lat');
  const lonFromUrl = urlParams.get('lon');

  if (addressFromUrl || cityFromUrl) {
    // Если есть параметры в URL - возвращаем их
    const resultParams = new URLSearchParams();
    if (addressFromUrl) resultParams.set('address', addressFromUrl);
    if (cityFromUrl) resultParams.set('city', cityFromUrl);
    if (latFromUrl) resultParams.set('lat', latFromUrl);
    if (lonFromUrl) resultParams.set('lon', lonFromUrl);
    const paramString = resultParams.toString();
    return paramString ? `?${paramString}` : '';
  }

  // 2. Проверяем вручную введенный адрес из localStorage
  const storageKey = 'bystroi_location';
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const parsed = JSON.parse(stored) as { 
        address?: string; 
        city?: string; 
        lat?: number; 
        lon?: number;
        manual?: boolean;
      };
      // ТОЛЬКО если адрес был введен вручную - добавляем параметры в URL
      if (parsed.manual && (parsed.address || parsed.city)) {
        const resultParams = new URLSearchParams();
        if (parsed.address) resultParams.set('address', parsed.address);
        if (parsed.city) resultParams.set('city', parsed.city);
        if (parsed.lat != null) resultParams.set('lat', String(parsed.lat));
        if (parsed.lon != null) resultParams.set('lon', String(parsed.lon));
        const paramString = resultParams.toString();
        return paramString ? `?${paramString}` : '';
      }
    }
  } catch (e) {
    // Игнорируем ошибки
  }

  // 3. Автоматически определенный город НЕ добавляем в URL
  return '';
}
