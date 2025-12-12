"use client";

import { X } from "lucide-react";
import React from "react";

import { Badge } from "@/shared/ui/kit/badge";
import { Button } from "@/shared/ui/kit/button";
import { useProductFilters } from "../hooks/useProductFilters";

interface ActiveFiltersProps {
  onFiltersChange?: () => void;
}

const ActiveFilters: React.FC<ActiveFiltersProps> = ({ onFiltersChange }) => {
  const { currentParams, removeFilter, resetFilters } = useProductFilters();

  const activeFilters = [];

  if (currentParams.category) {
    const categories = currentParams.category.split(',');
    categories.forEach(cat => {
      activeFilters.push({
        key: "category",
        value: cat,
        label: `Категория: ${cat}`
      });
    });
  }

  if (currentParams.manufacturer) {
    const manufacturers = currentParams.manufacturer.split(',');
    manufacturers.forEach(man => {
      activeFilters.push({
        key: "manufacturer",
        value: man,
        label: `Производитель: ${man}`
      });
    });
  }

  if (currentParams.min_price !== undefined || currentParams.max_price !== undefined) {
    const min = currentParams.min_price || "0";
    const max = currentParams.max_price || "∞";
    activeFilters.push({
      key: "price",
      value: `${min}-${max}`,
      label: `Цена: ${min}₽ - ${max}₽`
    });
  }

  if (currentParams.rating_from !== undefined || currentParams.rating_to !== undefined) {
    const from = currentParams.rating_from || 0;
    const to = currentParams.rating_to || 5;
    activeFilters.push({
      key: "rating",
      value: `${from}-${to}`,
      label: `Рейтинг: ${from} - ${to}`
    });
  }

  if (currentParams.in_stock) {
    activeFilters.push({
      key: "in_stock",
      value: "true",
      label: "Только в наличии"
    });
  }

  const handleRemoveFilter = (filterKey: string, filterValue?: string) => {
    removeFilter(filterKey, filterValue);
    if (onFiltersChange) {
      onFiltersChange();
    }
  };

  const handleResetAll = () => {
    resetFilters();
    if (onFiltersChange) {
      onFiltersChange();
    }
  };

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4 p-3 bg-gray-50 rounded-md">
      <span className="text-sm font-medium">Активные фильтры:</span>
      {activeFilters.map((filter, index) => (
        <Badge
          key={`${filter.key}-${filter.value}-${index}`}
          variant="secondary"
          className="px-3 py-1 text-sm flex items-center gap-1"
        >
          <span>{filter.label}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 hover:bg-transparent"
            onClick={() => handleRemoveFilter(filter.key, filter.value)}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      ))}
    </div>
  );
};

export default ActiveFilters;