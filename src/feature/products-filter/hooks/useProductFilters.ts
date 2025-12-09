"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState, useEffect } from "react";

import { GetProductsDto, SortBy, SortOrder, SortType } from "@/entities/product";

export const useProductFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  
  const currentParams = useMemo(() => {
    const params: Partial<GetProductsDto> = {};
    
    if (typeof window === 'undefined') return params;
    
    try {
      
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
    } catch (error) {
      console.error("Error parsing search params:", error);
    }
    
    return params;
  }, [searchParams]);

  
  const updateUrlWithFilters = useCallback((newFilters: Record<string, string | number | boolean | undefined>) => {
    if (typeof window === 'undefined') return;
    
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
    const paramsToClear = ["category", "manufacturer", "min_price", "max_price", "rating_from", "rating_to", "in_stock"];
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
  };
};