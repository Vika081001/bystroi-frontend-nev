import { ListParams } from "./api";

export type Location = {
    id: number;
    name: string;
    address?: string;
    latitude?: number;
    description?: string;
    distance?: number;
    avg_rating?: number;
    reviews_count?: number;
}

export interface GetLocationParams extends ListParams {
    lat?: number;
    lon?: number;
    radius?: number;
}