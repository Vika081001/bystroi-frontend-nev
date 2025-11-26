import { ListParams } from "./api";

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
  phone: number;
}
