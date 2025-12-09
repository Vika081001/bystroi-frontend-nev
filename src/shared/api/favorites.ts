import { apiClient } from "./client";
import { 
  FavoritesResponse, 
  GetFavoritesParams, 
  AddToFavoriteDto, 
  DeleteFavorite,
  Favorite 
} from "../types/favorite";

const ENTITY_URL = "/favorites";

export const fetchFavorites = async (params: GetFavoritesParams): Promise<FavoritesResponse> => {
  const response = await apiClient.get<FavoritesResponse>(ENTITY_URL, {
    params: {
      phone: params.phone,
      page: params.page || 1,
      size: params.size || 20,
    },
  });
  return response.data;
};

export const addToFavorites = async (data: AddToFavoriteDto): Promise<Favorite> => {
  const response = await apiClient.post<Favorite>(ENTITY_URL, data, {
    params: {
      entity_type: "favorites",
    },
  });
  return response.data;
};

export const removeFromFavorites = async (data: DeleteFavorite): Promise<string> => {
  const response = await apiClient.delete<string>(`${ENTITY_URL}/${data.nomenclature_id}`, {
    params: {
      phone: data.phone,
    },
  });
  return response.data;
};