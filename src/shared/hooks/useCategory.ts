import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as categoryApi from "../api/categories";
import {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
} from "../types/category";

export const useCategories = (
  limit: number = 100,
  offset: number = 0,
  only_with_products: boolean = false
) => {
  return useQuery({
    queryKey: ["categories", limit, offset, only_with_products],
    queryFn: () => categoryApi.fetchCategories(limit, offset, only_with_products),
  });
};

export const useCategoryTree = (only_with_products: boolean = false) => {
  return useQuery({
    queryKey: ["category-tree", only_with_products],
    queryFn: () => categoryApi.fetchCategoryTree(only_with_products),
  });
};

export const useCategory = (id: number) => {
  return useQuery({
    queryKey: ["category", id],
    queryFn: () => categoryApi.fetchCategory(id),
    enabled: !!id,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryDto) => categoryApi.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["category-tree"] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCategoryDto }) =>
      categoryApi.updateCategory(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["category-tree"] });
      queryClient.invalidateQueries({ queryKey: ["category", variables.id] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => categoryApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["category-tree"] });
    },
  });
};

export const useUploadCategoryImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) =>
      categoryApi.uploadCategoryImage(id, file),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["category-tree"] });
      queryClient.invalidateQueries({ queryKey: ["category", variables.id] });
    },
  });
};