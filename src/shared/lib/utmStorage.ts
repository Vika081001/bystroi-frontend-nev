// shared/lib/utmStorage.ts
import { UtmParams } from "../types/utm";

const UTM_STORAGE_KEY = 'utm_params';

export interface StoredUtmParams extends UtmParams {
  savedAt: string;
}

export const saveUtmToStorage = (utmParams: UtmParams): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const storedData: StoredUtmParams = {
      ...utmParams,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(storedData));
  } catch (error) {
    console.error('Failed to save UTM to localStorage:', error);
  }
};

export const loadUtmFromStorage = (): UtmParams | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(UTM_STORAGE_KEY);
    if (!stored) return null;
    
    const parsed = JSON.parse(stored) as StoredUtmParams;
    const savedAt = new Date(parsed.savedAt);
    const now = new Date();
    
    const daysDiff = (now.getTime() - savedAt.getTime()) / (1000 * 3600 * 24);
    if (daysDiff > 30) {
      localStorage.removeItem(UTM_STORAGE_KEY);
      return null;
    }
    
    const { savedAt: _, ...utmParams } = parsed;
    return utmParams;
  } catch (error) {
    console.error('Failed to load UTM from localStorage:', error);
    return null;
  }
};

export const clearUtmStorage = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(UTM_STORAGE_KEY);
};

export const hasAnyUtmParams = (params: UtmParams): boolean => {
  return Object.values(params).some(value => 
    value !== undefined && value !== null && value !== ''
  );
};