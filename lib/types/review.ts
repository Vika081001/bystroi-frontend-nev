import { ListResponse } from "./api";

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
}

export type ReviewList = ListResponse<Review> & { avg_rating?: number };