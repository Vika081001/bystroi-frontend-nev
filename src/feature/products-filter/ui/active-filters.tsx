"use client";

import { X } from "lucide-react";
import React from "react";

import { Badge } from "@/shared/ui/kit/badge";
import { Button } from "@/shared/ui/kit/button";
import { useProductFilters } from "../hooks/useProductFilters";

const ActiveFilters = () => {
  const { currentParams, updateUrlWithFilters } = useProductFilters();

  if (typeof window === 'undefined') return null;

  const activeFilters = [
    { key: "category", label: "Категория", value: currentParams.category },
    { key: "manufacturer", label: "Производитель", value: currentParams.manufacturer },
    { key: "min_price", label: "Мин. цена", value: currentParams.min_price },
    { key: "max_price", label: "Макс. цена", value: currentParams.max_price },
    { key: "rating_from", label: "Рейтинг от", value: currentParams.rating_from },
    { key: "rating_to", label: "Рейтинг до", value: currentParams.rating_to },
    { key: "in_stock", label: "В наличии", value: currentParams.in_stock ? "Да" : undefined },
  ].filter(filter => filter.value !== undefined && filter.value !== "");

  if (activeFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4 p-3 bg-gray-50 rounded-md">
      <span className="text-sm font-medium">Активные фильтры:</span>
      {activeFilters.map((filter) => (
        <Badge
          key={filter.key}
          variant="secondary"
          className="px-3 py-1 text-sm flex items-center gap-1"
        >
          <span className="font-medium">
            {filter.label}: {filter.value}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 hover:bg-transparent"
            onClick={() => updateUrlWithFilters({ [filter.key]: undefined })}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      ))}
      
      <Button
        variant="ghost"
        size="sm"
        className="text-blue-600 hover:text-blue-700"
        onClick={() => {
          updateUrlWithFilters({
            category: undefined,
            manufacturer: undefined,
            min_price: undefined,
            max_price: undefined,
            rating_from: undefined,
            rating_to: undefined,
            in_stock: undefined,
          });
        }}
      >
        Очистить фильтры
      </Button>
    </div>
  );
};

export default ActiveFilters;