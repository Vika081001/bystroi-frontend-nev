import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/shared/api/client";
import { ListResponse } from "@/shared/types/api";
import { GetLocationParams, Location } from "@/shared/types/location";

// Тип ответа API для locations (отличается от стандартного ListResponse)
type LocationsResponse = {
  locations: Location[];
  count: number;
  page: number;
  size: number;
};

export const useLocations = (
  params: GetLocationParams = { page: 1, size: 20 },
  options?: { enabled?: boolean }
) => {
  return useQuery<LocationsResponse>({
    queryKey: ["locations", params],
    queryFn: async () => {
      const requestParams: Record<string, any> = {
        page: params.page || 1,
        size: params.size || 20,
      };
      
      // Добавляем параметры для фильтрации по координатам
      if (params.lat && params.lon) {
        requestParams.lat = params.lat;
        requestParams.lon = params.lon;
      }
      if (params.radius) {
        requestParams.radius = params.radius;
      }
      // Добавляем параметры для фильтрации по адресу или городу (бэкенд геокодирует их в координаты)
      if (params.address) {
        requestParams.address = params.address;
      }
      if (params.city) {
        requestParams.city = params.city;
      }
      
      const response = await apiClient.get("/locations", { params: requestParams });
      return response.data;
    },
    enabled: options?.enabled !== false,
  });
};
