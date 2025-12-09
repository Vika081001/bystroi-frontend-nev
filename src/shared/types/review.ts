import { ListParams, ListResponse } from "./api";

export type Review = {
  id: number;
  entity_type: string;
  entity_id: number;
  rating: number;
  text: string;
  status: string;
  created_at: Date;
  updated_at: Date;
};

export type ReviewList = ListResponse<Review[]> & { avg_rating?: number };

export type EntityType = "nomenclature" | "warehouse";

export type ReviewStatus = "visible" | "hidden" | "pending";

export interface GetReviewsParams extends ListParams {
  entity_type: EntityType;
  entity_id: number;
  sort?: "newest" | "oldest" | "highest" | "lowest";
  view_only_rates?: number;
}

export type CreateReview = {
  entity_type: EntityType;
  entity_id: number;
  rating: number;
  text: string;
  contragent_phone: string;
};

export type UpdateReview = {
  id: number;
  rating: number;
  text: string;
  contragent_phone: string;
};