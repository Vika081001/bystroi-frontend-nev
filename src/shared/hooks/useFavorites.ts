import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/shared/api/client";
import { ListResponse } from "@/shared/types/api";
import { Favorite } from "@/shared/types/favorite";

interface FavoritesParams {
  page?: number;
  size?: number;
}

export const useFavorites = (params: FavoritesParams = {}) => {
  return useQuery<ListResponse<Favorite[]>>({
    queryKey: ["favorites", params],
    queryFn: async () => {
      const response = await apiClient.get("/favorites", { params });
      return response.data;
    },
  });
};

export const useAddToFavorites = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      const response = await apiClient.post("/favorites", { productId });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
};

export const useRemoveFromFavorites = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      await apiClient.delete(`/favorites/${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
};

export const useIsFavorite = (productId: string) => {
  return useQuery<boolean>({
    queryKey: ["favorite", productId],
    queryFn: async () => {
      const response = await apiClient.get(`/favorites/check/${productId}`);
      return response.data;
    },
    enabled: !!productId,
  });
};
