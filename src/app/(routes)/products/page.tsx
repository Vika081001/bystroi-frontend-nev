// app/(routes)/products/page.tsx
"use client";

import { Suspense, useEffect } from "react";
import { SlidersHorizontal } from "lucide-react";
import React, { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";

import { Filter } from "@/widgets/filter";
import ProductsList from "@/widgets/product-list";
import { fetchProducts } from "@/entities/product/api";
import { useProductFilters } from "@/feature/products-filter/hooks/useProductFilters";
import ActiveFilters from "@/feature/products-filter/ui/active-filters";

import { BreadcrumbsDemo } from "@/shared/ui/breadcrumbs";
import { Button } from "@/shared/ui/kit/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/kit/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/kit/select";

import { GetProductsDto, SortBy, SortOrder, Product } from "@/entities/product/model/types";

type SortOption = {
  value: string;
  label: string;
  sort_by: SortBy;
  sort_order: SortOrder;
};

const sortOptions: SortOption[] = [
  { value: "popular", label: "Популярное", sort_by: "total_sold", sort_order: "desc" },
  { value: "new", label: "Новинки", sort_by: "created_at", sort_order: "desc" },
  { value: "expensive", label: "Дорогие", sort_by: "price", sort_order: "desc" },
  { value: "cheap", label: "Дешевые", sort_by: "price", sort_order: "asc" },
  { value: "interesting", label: "Интересные", sort_by: "rating", sort_order: "desc" },
];

function ProductsContent() {
  const { currentSortType, applySort, currentParams } = useProductFilters();
  const [totalCount, setTotalCount] = useState<number | null>(null);

  const { data: productsData, isLoading } = useQuery({
    queryKey: ["products", currentParams],
    queryFn: () => fetchProducts({
      ...currentParams,
      page: 1,
      size: 100,
    }),
  });

  const products = productsData?.result || [];

  const selectedSort = sortOptions.find(opt => opt.value === currentSortType) || sortOptions[0];

  const listParams: Partial<GetProductsDto> = {
    ...currentParams,
    sort_by: selectedSort.sort_by,
    sort_order: selectedSort.sort_order,
  };

  const { minPrice, maxPrice, categories, manufacturers } = useMemo(() => {
    const productsWithPrice = products.filter((p: Product) => p.price != null);
    
    const min = productsWithPrice.length > 0 
      ? Math.min(...productsWithPrice.map((p: Product) => p.price))
      : 0;
    
    const max = productsWithPrice.length > 0 
      ? Math.max(...productsWithPrice.map((p: Product) => p.price))
      : 10000;
    
    const uniqueCategories = Array.from(
      new Set(
        products
          .filter((p: Product) => p.category_name)
          .map((p: Product) => p.category_name as string)
          .filter(Boolean)
      )
    );
    
    const uniqueManufacturers = Array.from(
      new Set(
        products
          .filter((p: Product) => p.manufacturer_name)
          .map((p: Product) => p.manufacturer_name as string)
          .filter(Boolean)
      )
    );
    
    return {
      minPrice: min,
      maxPrice: max,
      categories: uniqueCategories as string[],
      manufacturers: uniqueManufacturers as string[],
    };
  }, [products]);

  return (
    <div className="py-2 pb-12">
      <div className="container">
        <BreadcrumbsDemo 
          isProduct={false}
          categoryName={currentParams.category}
        />
        <div className="flex flex-col gap-2 md:flex-row md:justify-between">
          <h1 className="text-lg font-medium tracking-tight">
            {listParams.category ? listParams.category : "Категория"} ({totalCount !== null ? totalCount : "..."}) 
          </h1>
          <div className="flex gap-2">
            <Select
              value={currentSortType}
              onValueChange={applySort}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Dialog>
              <DialogTrigger asChild className="md:hidden">
                <Button variant="outline" className="font-normal">
                  <SlidersHorizontal />
                  Фильтр
                </Button>
              </DialogTrigger>
              <DialogContent className="p-0">
                <DialogTitle></DialogTitle>
                <Filter 
                  products={products}
                  initialMinPrice={minPrice}
                  initialMaxPrice={maxPrice}
                  categories={categories}
                  manufacturers={manufacturers}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <ActiveFilters onFiltersChange={() => {}} />
        <div className="flex pt-4 relative">
          <div className="hidden md:block w-80">
            <Filter 
              products={products}
              initialMinPrice={minPrice}
              initialMaxPrice={maxPrice}
              categories={categories}
              manufacturers={manufacturers}
            />
          </div>
          <ProductsList 
            params={listParams} 
            onTotalCountChange={setTotalCount}
          />
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="py-2 pb-12">
        <div className="container">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg">Загрузка...</div>
          </div>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}