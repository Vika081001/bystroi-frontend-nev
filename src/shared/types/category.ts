export interface Category {
  id: number;
  name: string;
  description: string;
  code: number;
  parent_id: number | null;
  external_id: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  has_products?: boolean; // Показывает, есть ли актуальные товары в категории
  children?: Category[];
}

export interface CategoryTree extends Category {
  children: CategoryTree[];
}

export interface CreateCategoryDto {
  name: string;
  description: string;
  code: number;
  parent_id: number | null;
  external_id: string | null;
  image_url: string | null;
  is_active: boolean;
}

export interface UpdateCategoryDto {
  name?: string;
  description?: string;
  code?: number;
  parent_id?: number | null;
  external_id?: string | null;
  image_url?: string | null;
  is_active?: boolean;
}

export interface CategoriesResponse {
  result: Category[];
  count: number;
  processing_time_ms: number;
}

export interface CategoryTreeResponse {
  result: CategoryTree[];
  count: number;
  processing_time_ms: number;
}