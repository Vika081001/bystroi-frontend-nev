"use client";

import { Star } from "lucide-react";
import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";

import { useProductFilters } from "@/feature/products-filter/hooks/useProductFilters";

import { Button } from "@/shared/ui/kit/button";
import { Checkbox } from "@/shared/ui/kit/checkbox";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/shared/ui/kit/input-group";
import { Separator } from "@/shared/ui/kit/separator";
import { Slider } from "@/shared/ui/kit/slider";

interface FilterProps {
  products?: any[];
  initialMinPrice?: number;
  initialMaxPrice?: number;
  categories?: string[];
  manufacturers?: string[];
}

export const Filter = ({ 
  products = [], 
  initialMinPrice = 0,
  initialMaxPrice = 10000,
  categories = [],
  manufacturers = []
}: FilterProps) => {
  const { currentParams, updateUrlWithFilters, resetFilters } = useProductFilters();
  
  const [priceRange, setPriceRange] = useState<[number, number]>([
    currentParams.min_price || initialMinPrice,
    currentParams.max_price || initialMaxPrice
  ]);
  const [ratingRange, setRatingRange] = useState<[number, number]>([
    currentParams.rating_from || 0,
    currentParams.rating_to || 5
  ]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    currentParams.category ? currentParams.category.split(',') : []
  );
  const [selectedManufacturers, setSelectedManufacturers] = useState<string[]>(
    currentParams.manufacturer ? currentParams.manufacturer.split(',') : []
  );
  const [inStock, setInStock] = useState<boolean>(currentParams.in_stock || false);
  const [priceInitialized, setPriceInitialized] = useState(false);

  const { minProductPrice, maxProductPrice } = useMemo(() => {
    if (!products || products.length === 0) {
      return { minProductPrice: initialMinPrice, maxProductPrice: initialMaxPrice };
    }
    
    const prices = products
      .filter(p => p.price != null)
      .map(p => p.price);
    
    if (prices.length === 0) {
      return { minProductPrice: initialMinPrice, maxProductPrice: initialMaxPrice };
    }
    
    return {
      minProductPrice: Math.min(...prices),
      maxProductPrice: Math.max(...prices)
    };
  }, [products, initialMinPrice, initialMaxPrice]);

  useEffect(() => {
    if (!priceInitialized && products.length > 0 && maxProductPrice > initialMinPrice) {
      if (currentParams.min_price !== undefined || currentParams.max_price !== undefined) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPriceRange([
          currentParams.min_price || minProductPrice,
          currentParams.max_price || maxProductPrice
        ]);
      } else {
        setPriceRange([minProductPrice, maxProductPrice]);
      }
      setPriceInitialized(true);
    }
  }, [products, minProductPrice, maxProductPrice, currentParams, priceInitialized, initialMinPrice]);


  const uniqueCategories = useMemo(() => {
    const cats = products
      .filter(p => p.category_name)
      .map(p => p.category_name);
    return Array.from(new Set(cats));
  }, [products]);

  const uniqueManufacturers = useMemo(() => {
    const mans = products
      .filter(p => p.manufacturer_name)
      .map(p => p.manufacturer_name);
    return Array.from(new Set(mans));
  }, [products]);

  const applyFilters = () => {
    updateUrlWithFilters({
      min_price: priceRange[0],
      max_price: priceRange[1],
      rating_from: ratingRange[0],
      rating_to: ratingRange[1],
      category: selectedCategories.length > 0 ? selectedCategories.join(',') : undefined,
      manufacturer: selectedManufacturers.length > 0 ? selectedManufacturers.join(',') : undefined,
      in_stock: inStock ? true : undefined
    });
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    setSelectedCategories(prev => 
      checked 
        ? [...prev, category]
        : prev.filter(c => c !== category)
    );
  };

  
  const handleManufacturerChange = (manufacturer: string, checked: boolean) => {
    setSelectedManufacturers(prev => 
      checked 
        ? [...prev, manufacturer]
        : prev.filter(m => m !== manufacturer)
    );
  };

  
  const handlePriceChange = (value: number[]) => {
    const [min, max] = value;
    
    if (min >= max) return;
    setPriceRange([min, max]);
  };

  
  const handleRatingChange = (value: number[]) => {
    const [min, max] = value;
    
    if (min >= max) return;
    setRatingRange([min, max]);
  };

  return (
    <aside className="md:max-w-2xs w-full md:border border-gray-200 rounded-md md:p-4 h-fit">
      <div className="flex justify-between items-center">
        <p className="font-medium pb-4 pl-4 md:p-0 leading-4">Фильтр</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetFilters}
          className="text-blue-600 hover:text-blue-700"
        >
          Сбросить все
        </Button>
      </div>
      <div className="h-[80dvh] overflow-y-auto md:overflow-y-visible px-4 md:p-0 md:h-auto">
        <div className="text-sm flex flex-col gap-4 pt-4">
          <div>
            <p className="font-medium">Рейтинг</p>
            <Slider
              className="pt-3"
              value={ratingRange}
              onValueChange={handleRatingChange}
              min={0}
              max={5}
              step={1}
            />
            <ul className="flex justify-between pt-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <li key={star} className="flex items-center gap-1">
                  <Star width={12} height={12} fill="gold" color="gold" />
                  <p className="text-xs">{star}</p>
                </li>
              ))}
            </ul>
            <div className="flex gap-2 mt-2 text-xs">
              <span>От: {ratingRange[0]}</span>
              <span>До: {ratingRange[1]}</span>
            </div>
          </div>
          <Separator />

          <div>
            <p className="font-medium">Цена</p>
            <div className="flex flex-col gap-2 pt-2">
              <InputGroup className="bg-gray-50">
                <InputGroupAddon>От</InputGroupAddon>
                <InputGroupInput
                  className="h-7"
                  type="number"
                  min={minProductPrice}
                  max={maxProductPrice}
                  value={priceRange[0]}
                  onChange={(e) => {
                    const value = Math.max(minProductPrice, Math.min(Number(e.target.value), priceRange[1] - 1));
                    setPriceRange([value, priceRange[1]]);
                  }}
                />
              </InputGroup>
              <InputGroup className="bg-gray-50">
                <InputGroupAddon>До</InputGroupAddon>
                <InputGroupInput
                  className="h-7"
                  type="number"
                  min={minProductPrice}
                  max={maxProductPrice}
                  value={priceRange[1]}
                  onChange={(e) => {
                    const value = Math.min(maxProductPrice, Math.max(Number(e.target.value), priceRange[0] + 1));
                    setPriceRange([priceRange[0], value]);
                  }}
                />
              </InputGroup>
            </div>
            <Slider
              className="pt-3"
              value={priceRange}
              onValueChange={handlePriceChange}
              min={minProductPrice}
              max={maxProductPrice}
              step={100}
            />
          </div>
          <Separator />

          {uniqueCategories.length > 0 && (
            <>
              <div>
                <p className="font-medium">Категории</p>
                <div className="flex flex-col gap-2 pt-2 max-h-40 overflow-y-auto">
                  {uniqueCategories.map((category) => (
                    <label key={category} htmlFor={`category-${category}`} className="flex items-center gap-2">
                      <Checkbox
                        id={`category-${category}`}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={(checked) => handleCategoryChange(category, !!checked)}
                      />
                      <span className="truncate">{category}</span>
                    </label>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          {uniqueManufacturers.length > 0 && (
            <>
              <div>
                <p className="font-medium">Производители</p>
                <div className="flex flex-col gap-2 pt-2 max-h-40 overflow-y-auto">
                  {uniqueManufacturers.map((manufacturer) => (
                    <label key={manufacturer} htmlFor={`manufacturer-${manufacturer}`} className="flex items-center gap-2">
                      <Checkbox
                        id={`manufacturer-${manufacturer}`}
                        checked={selectedManufacturers.includes(manufacturer)}
                        onCheckedChange={(checked) => handleManufacturerChange(manufacturer, !!checked)}
                      />
                      <span className="truncate">{manufacturer}</span>
                    </label>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          <div>
            <p className="font-medium">Наличие</p>
            <div className="flex flex-col gap-2 pt-2">
              <label htmlFor="in-stock" className="flex items-center gap-2">
                <Checkbox
                  id="in-stock"
                  checked={inStock}
                  onCheckedChange={(checked) => setInStock(!!checked)}
                />
                Только в наличии
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 w-full">
        <Button 
          className="w-full bg-blue-600"
          onClick={applyFilters}
        >
          Применить фильтры
        </Button>
      </div>
    </aside>
  );
};