// shared/api/favorites.ts
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
  const {
    utm_source,
    utm_medium,
    utm_campaign,
    utm_content,
    utm_name,
    utm_phone,
    utm_email,
    utm_leadid,
    utm_yclientid,
    utm_gaclientid,
    ...body
  } = data;

  const response = await apiClient.post<Favorite>(ENTITY_URL, body, {
    params: {
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      utm_name,
      utm_phone,
      utm_email,
      utm_leadid,
      utm_yclientid,
      utm_gaclientid,
    },
  });
  return response.data;
};

export const removeFromFavorites = async (data: DeleteFavorite): Promise<void> => {
  await apiClient.delete<void>(`${ENTITY_URL}/${data.favorite_id}`, {
    params: {
      phone: data.phone,
    },
  });
};