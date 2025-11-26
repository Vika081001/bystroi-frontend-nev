import { ListParams, ListResponse } from "./api";

export type Review = {
  id: number;
  // TODO: must be enum
  entity_type: string;
  entity_id: number;
  rating: number;
  text: string;
  // TODO: Must be enum
  status: string;
  created_at: Date;
  updated_at: Date;
};

export type ReviewList = ListResponse<Review> & { avg_rating?: number };

// TODO: move to another file @/shared/types/...
export type EntityType = "nomenclature" | "warehouse";

export interface GetReviewsParams extends ListParams {
  entity_type: EntityType;
  entity_id: number;
  sort?: "newest" | "oldest" | "highest" | "lowest";
  // min: 1, max: 5
  view_only_rates?: number;
}

export type CreateReview = Pick<
  Review,
  "entity_type" | "entity_id" | "text"
> & { contragent_phone: string };
export type UpdateReview = {
  id: number;
  rating: 5;
  text: string;
  contragent_phone: string;
};
