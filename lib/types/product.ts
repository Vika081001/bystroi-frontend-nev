import { ListParams } from "./api";
import { Warehouse } from "./warehouse";

export type Product = {
    id: number;
    name: string;
    description_short?: string;
    description_long?: string;
    code?: string;
    unit_name?: string;
    cashbox_id: number;
    category_name?: string;
    manufacturer_name?: string;
    price: number;
    // TODO: must be enum
    price_type: string;
    created_at: Date;
    updated_at: Date;
    images?: string[];
    barcodes?: string[];
    type?: string;
    distance?: number;
    listing_pos?: number;
    listing_page?: number;
    is_ad_pos?: boolean;
    tags?: string[];
    // TODO: Clarify object
    variations?: object[]
    current_amount?: number;
    seller_name?: string;
    seller_photo?: string;
    total_sold?: number;
    rating?: number;
    reviews_count?: number;
    available_warehouses?: Warehouse[] 
}

// TODO: move to another file @/shared/types/X.ts
export type SortBy = "distance" | "price" | "name" | "rating" | "total_sold" | "created_at" | "updated_at";
export type SortOrder = "asc" | "desc";

export interface GetProductsParams  extends ListParams {
    phone?: string;
    lat?: number;
    lon?: number;
    sort_by?: SortBy;
    sort_order?: SortOrder;
    category?: string;
    manufacturer?: string;
    min_price?: string;
    max_price?: string;
    in_stock?: boolean;
    rating_from?: number;
    rating_to?: number;
}