"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

import { GetProductsDto, SortBy, SortOrder, SortType } from "@/entities/product";

export const useProductFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentParams = useMemo(() => {
    const params: Partial<GetProductsDto> = {};
    
    try {
      // Устанавливаем сортировку по умолчанию, если не указана
      if (searchParams.has("sort")) {
        const sortValue = searchParams.get("sort");
        switch (sortValue) {
          case "popular":
            params.sort_by = "total_sold";
            params.sort_order = "desc";
            break;
          case "new":
            params.sort_by = "created_at";
            params.sort_order = "desc";
            break;
          case "expensive":
            params.sort_by = "price";
            params.sort_order = "desc";
            break;
          case "cheap":
            params.sort_by = "price";
            params.sort_order = "asc";
            break;
          case "interesting":
            params.sort_by = "rating";
            params.sort_order = "desc";
            break;
        }
      } else {
        // Сортировка по умолчанию
        params.sort_by = "total_sold";
        params.sort_order = "desc";
      }
      
      if (searchParams.has("category")) {
        params.category = searchParams.get("category")!;
      }
      if (searchParams.has("manufacturer")) {
        params.manufacturer = searchParams.get("manufacturer")!;
      }
      if (searchParams.has("min_price")) {
        params.min_price = Number(searchParams.get("min_price"));
      }
      if (searchParams.has("max_price")) {
        params.max_price = Number(searchParams.get("max_price"));
      }
      if (searchParams.has("rating_from")) {
        params.rating_from = Number(searchParams.get("rating_from"));
      }
      if (searchParams.has("rating_to")) {
        params.rating_to = Number(searchParams.get("rating_to"));
      }
      if (searchParams.has("in_stock")) {
        params.in_stock = searchParams.get("in_stock") === "true";
      }
      if (searchParams.has("global_category_id")) {
        params.global_category_id = Number(searchParams.get("global_category_id"));
      }
      // Приоритет у address, если его нет - используем city (обратная совместимость)
      if (searchParams.has("address")) {
        params.address = searchParams.get("address")!;
      } else if (searchParams.has("city")) {
        params.city = searchParams.get("city")!;
      }
      if (searchParams.has("seller_id")) {
        params.seller_id = Number(searchParams.get("seller_id"));
      }
    } catch (error) {
      console.error("Error parsing search params:", error);
      // В случае ошибки устанавливаем сортировку по умолчанию
      params.sort_by = "total_sold";
      params.sort_order = "desc";
    }
    
    return params;
  }, [searchParams]);

  const updateUrlWithFilters = useCallback((newFilters: Record<string, string | number | boolean | undefined>) => {
    try {
      const newParams = new URLSearchParams(searchParams.toString());
      
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value === undefined || value === "" || value === null) {
          newParams.delete(key);
        } else {
          newParams.set(key, String(value));
        }
      });
      
      const currentSort = searchParams.get("sort") || "popular";
      newParams.set("sort", currentSort);
      
      router.push(`/products?${newParams.toString()}`, { scroll: false });
    } catch (error) {
      console.error("Error updating URL with filters:", error);
    }
  }, [router, searchParams]);

  const resetFilters = useCallback(() => {
    const newParams = new URLSearchParams();
    
    const currentSort = searchParams.get("sort");
    if (currentSort) {
      newParams.set("sort", currentSort);
    }
    
    router.push(`/products?${newParams.toString()}`, { scroll: false });
  }, [router, searchParams]);

  const applySort = useCallback((sortType: SortType) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("sort", sortType);
    router.push(`/products?${newParams.toString()}`, { scroll: false });
  }, [router, searchParams]);

  const removeFilter = useCallback((key: string, value?: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    
    if (key === "category" || key === "manufacturer") {
      if (value) {
        const currentValues = newParams.get(key)?.split(',') || [];
        const newValues = currentValues.filter(v => v !== value);
        if (newValues.length > 0) {
          newParams.set(key, newValues.join(','));
        } else {
          newParams.delete(key);
        }
      } else {
        newParams.delete(key);
      }
    } else if (key === "price") {
      newParams.delete("min_price");
      newParams.delete("max_price");
    } else if (key === "rating") {
      newParams.delete("rating_from");
      newParams.delete("rating_to");
    } else if (key === "global_category_id") {
      newParams.delete("global_category_id");
    } else {
      newParams.delete(key);
    }
    
    router.push(`/products?${newParams.toString()}`, { scroll: false });
  }, [router, searchParams]);

  const currentSortType = useMemo(() => {
    const sort = searchParams.get("sort");
    return sort as SortType || "popular";
  }, [searchParams]);

  return {
    currentParams,
    currentSortType,
    applySort,
    updateUrlWithFilters,
    resetFilters,
    removeFilter,
  };
};