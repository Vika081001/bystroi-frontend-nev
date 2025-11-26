import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/shared/api/client";
import { ListResponse } from "@/shared/types/api";
import { GetLocationParams, Location } from "@/shared/types/location";

export const useLocations = (
  params: GetLocationParams = { page: 1, size: 20 },
) => {
  return useQuery<ListResponse<Location[]>>({
    queryKey: ["locations", params],
    queryFn: async () => {
      const response = await apiClient.get("/locations");
      return response.data;
    },
  });
};
