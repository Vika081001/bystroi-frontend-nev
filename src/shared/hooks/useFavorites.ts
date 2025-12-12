// shared/hooks/useFavorites.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContragentPhone } from "@/shared/hooks/useContragentPhone";
import { 
  fetchFavorites, 
  addToFavorites, 
  removeFromFavorites 
} from "@/shared/api/favorites";
import { 
  FavoritesResponse, 
  GetFavoritesParams 
} from "@/shared/types/favorite";
import { useUtmParams } from "@/shared/hooks/useUtmParams";

interface FavoritesParams {
  page?: number;
  size?: number;
}

export const useFavorites = (params: FavoritesParams = {}) => {
  const contragentPhone = useContragentPhone();
  
  return useQuery<FavoritesResponse>({
    queryKey: ["favorites", contragentPhone, params],
    queryFn: async () => {
      return fetchFavorites({
        phone: contragentPhone,
        page: params.page || 1,
        size: params.size || 20,
      });
    },
    enabled: !!contragentPhone,
  });
};

export const useAddToFavorites = () => {
  const queryClient = useQueryClient();
  const contragentPhone = useContragentPhone();
  const { utmParams } = useUtmParams();

  return useMutation({
    mutationFn: async (nomenclature_id: number) => {
      return addToFavorites({
        nomenclature_id,
        contragent_phone: contragentPhone,
        ...utmParams,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
    onError: (error) => {
      console.error("Ошибка при добавлении в избранное:", error);
    },
  });
};

export const useRemoveFromFavorites = () => {
  const queryClient = useQueryClient();
  const contragentPhone = useContragentPhone();

  return useMutation({
    mutationFn: async (nomenclature_id: number) => {
      return removeFromFavorites({
        nomenclature_id,
        phone: contragentPhone,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
    onError: (error) => {
      console.error("Ошибка при удалении из избранного:", error);
    },
  });
};

export const useIsFavorite = (nomenclature_id: number) => {
  const { data: favorites } = useFavorites();
  
  return {
    isFavorite: favorites?.result?.some(
      (item) => item.nomenclature_id === nomenclature_id
    ) || false,
    favoriteId: favorites?.result?.find(
      (item) => item.nomenclature_id === nomenclature_id
    )?.id,
  };
};