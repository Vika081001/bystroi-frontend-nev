import { apiClient } from "@/shared/api/client";
import {
  Category,
  CategoryTree,
  CategoriesResponse,
  CategoryTreeResponse,
  CreateCategoryDto,
  UpdateCategoryDto,
} from "../types/category";

export const fetchCategories = async (
  limit: number = 100,
  offset: number = 0
): Promise<CategoriesResponse> => {
  const response = await apiClient.get<CategoriesResponse>("/categories/", {
    params: { limit, offset },
  });
  return response.data;
};

export const fetchCategoryTree = async (): Promise<CategoryTreeResponse> => {
  const response = await apiClient.get<CategoryTreeResponse>("/categories/tree/");
  return response.data;
};

export const fetchCategory = async (id: number): Promise<Category> => {
  const response = await apiClient.get<Category>(`/categories/${id}/`);
  return response.data;
};

export const createCategory = async (
  data: CreateCategoryDto
): Promise<Category> => {
  const response = await apiClient.post<Category>("/categories/", data);
  return response.data;
};

export const updateCategory = async (
  id: number,
  data: UpdateCategoryDto
): Promise<Category> => {
  const response = await apiClient.patch<Category>(`/categories/${id}/`, data);
  return response.data;
};

export const deleteCategory = async (id: number): Promise<string> => {
  const response = await apiClient.delete<string>(`/categories/${id}/`);
  return response.data;
};

export const uploadCategoryImage = async (
  id: number,
  file: File
): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post<string>(
    `/categories/${id}/upload_image/`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};