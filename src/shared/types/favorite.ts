// shared/types/favorite.ts
import { ListParams } from "./api";
import { UtmParams } from "./utm";

export type Favorite = {
  id: number;
  nomenclature_id: number;
  contagent_id: number;
  created_at: Date;
  updated_at: Date;
};

export interface GetFavoritesParams extends ListParams {
  phone: string;
}

export interface DeleteFavorite {
  favorite_id: number;
  phone: string;
}

export interface AddToFavoriteDto extends UtmParams {
  nomenclature_id: number;
  contragent_phone: string;
}

export interface FavoritesResponse {
  result: Favorite[];
  count: number;
  page: number;
  size: number;
}