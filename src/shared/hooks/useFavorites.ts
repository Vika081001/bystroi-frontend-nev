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
  GetFavoritesParams,
  Favorite
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
    staleTime: 5 * 60 * 1000, // 5 минут - данные считаются свежими
    refetchOnWindowFocus: false, // Не рефетчим при фокусе окна
    refetchOnMount: false, // Не рефетчим при монтировании, если данные свежие
    refetchOnReconnect: false, // Не рефетчим при переподключении
    retry: (failureCount, error: any) => {
      // Не повторяем запрос при ошибке 422 (Unprocessable Entity)
      if (error?.response?.status === 422) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

export const useAddToFavorites = () => {
  const queryClient = useQueryClient();
  const contragentPhone = useContragentPhone();
  const { utmParams } = useUtmParams();

  return useMutation({
    mutationFn: async (nomenclature_id: number) => {
      if (!contragentPhone) {
        throw new Error("Phone is required to add to favorites");
      }
      const result = await addToFavorites({
        nomenclature_id,
        contragent_phone: contragentPhone,
        ...utmParams,
      });
      return result;
    },
    onMutate: async (nomenclature_id: number) => {
      if (!contragentPhone) return;
      
      // Отменяем исходящие запросы
      await queryClient.cancelQueries({ queryKey: ["favorites", contragentPhone] });

      // Сохраняем предыдущее значение для отката
      const previousQueries = queryClient.getQueriesData({ queryKey: ["favorites", contragentPhone] });

      // Оптимистично обновляем все запросы избранного
      queryClient.setQueriesData<FavoritesResponse>(
        { queryKey: ["favorites", contragentPhone] },
        (old) => {
          if (!old) return old;
          
          // Проверяем, нет ли уже этого товара
          if (old.result?.some(item => item.nomenclature_id === nomenclature_id)) {
            return old;
          }
          
          // Добавляем новый товар
          return {
            ...old,
            result: [
              ...(old.result || []),
              {
                id: Date.now(),
                nomenclature_id,
                contagent_id: 0,
                created_at: new Date(),
                updated_at: new Date(),
              } as Favorite,
            ],
            count: (old.count || 0) + 1,
          };
        }
      );

      return { previousQueries };
    },
    onSuccess: (data) => {
      // Обновляем кеш с реальными данными с сервера (не вызываем рефетч)
      queryClient.setQueriesData<FavoritesResponse>(
        { queryKey: ["favorites", contragentPhone] },
        (old) => {
          if (!old) {
            // Если кеша нет, создаем базовую структуру
            return {
              result: [data],
              count: 1,
              page: 1,
              size: 20,
            };
          }
          // Проверяем, нет ли уже этого товара с правильным ID
          const exists = old.result?.some(item => 
            item.id === data.id || item.nomenclature_id === data.nomenclature_id
          );
          if (exists) {
            // Обновляем существующий элемент с правильным ID
            return {
              ...old,
              result: old.result.map(item => 
                item.nomenclature_id === data.nomenclature_id ? data : item
              ),
            };
          }
          // Добавляем новый элемент с правильным ID
          return {
            ...old,
            result: [...(old.result || []), data],
            count: (old.count || 0) + 1,
          };
        }
      );
    },
    onError: (error, nomenclature_id, context) => {
      // Откатываем при ошибке
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      console.error("Ошибка при добавлении в избранное:", error);
    },
  });
};

export const useRemoveFromFavorites = () => {
  const queryClient = useQueryClient();
  const contragentPhone = useContragentPhone();

  return useMutation({
    mutationFn: async (favorite_id: number) => {
      return removeFromFavorites({
        favorite_id,
        phone: contragentPhone,
      });
    },
    onMutate: async (favorite_id: number) => {
      if (!contragentPhone) return;
      
      // Отменяем исходящие запросы
      await queryClient.cancelQueries({ queryKey: ["favorites", contragentPhone] });

      // Сохраняем предыдущее значение для отката
      const previousQueries = queryClient.getQueriesData({ queryKey: ["favorites", contragentPhone] });

      // Оптимистично обновляем все запросы избранного
      queryClient.setQueriesData<FavoritesResponse>(
        { queryKey: ["favorites", contragentPhone] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            result: (old.result || []).filter(item => item.id !== favorite_id),
            count: Math.max(0, (old.count || 0) - 1),
          };
        }
      );

      return { previousQueries };
    },
    onSuccess: () => {
      // Не инвалидируем и не рефетчим - кеш уже обновлен оптимистично
      // Данные будут обновлены при следующем естественном запросе
    },
    onError: (error, favorite_id, context) => {
      // Откатываем при ошибке
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      console.error("Ошибка при удалении из избранного:", error);
    },
  });
};

export const useIsFavorite = (nomenclature_id: number) => {
  const contragentPhone = useContragentPhone();
  // Используем дефолтное значение size (20) - API не поддерживает большие значения
  const { data: favorites, isLoading, isFetching, error } = useFavorites({ page: 1 });
  
  // Если пользователь не авторизован, возвращаем false
  if (!contragentPhone) {
    return {
      isFavorite: false,
      favoriteId: undefined,
      isLoading: false,
    };
  }
  
  return {
    isFavorite: favorites?.result?.some(
      (item) => item.nomenclature_id === nomenclature_id
    ) || false,
    favoriteId: favorites?.result?.find(
      (item) => item.nomenclature_id === nomenclature_id
    )?.id,
    isLoading: isLoading || isFetching,
  };
};