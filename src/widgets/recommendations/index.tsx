"use client"

import { ArrowRight } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { useProductViewHistory } from '@/shared/hooks/use-product-view-history';
import { Product, useProducts } from '@/entities/product';
import { ProductCard } from '@/entities/product/ui/product-card';
import { ProductCardSkeleton } from '@/entities/product/ui/product-card-skeleton';
import { Button } from '@/shared/ui/kit/button';

const DEFAULT_RECOMMENDATIONS = {
  size: 20,
  sort_by: 'total_sold' as const,
  sort_order: 'desc' as const,
};

export const Recommendation = () => {
  const { getRecommendationsParams, viewedProducts } = useProductViewHistory();
  const [params, setParams] = useState<any>(DEFAULT_RECOMMENDATIONS);
  const [fallbackMode, setFallbackMode] = useState(false);
 
  const { data, isLoading, refetch } = useProducts(params);
  useEffect(() => {
    const recommendationParams = getRecommendationsParams();
   
    if (recommendationParams) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setParams(recommendationParams);
      setFallbackMode(false);
    } else {
      setParams(DEFAULT_RECOMMENDATIONS);
      setFallbackMode(false);
    }
  }, [getRecommendationsParams, viewedProducts]);
  useEffect(() => {
    if (!isLoading && data?.result?.length === 0 && !fallbackMode) {
     
      const recommendationParams = getRecommendationsParams();
      if (recommendationParams?.category) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setParams({
          category: recommendationParams.category,
          size: 20,
          sort_by: 'total_sold' as const,
          sort_order: 'desc' as const,
        });
        setFallbackMode(true);
      }
    }
  }, [data, isLoading, fallbackMode, getRecommendationsParams]);
  useEffect(() => {
    if (!isLoading && data?.result?.length === 0 && fallbackMode) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setParams(DEFAULT_RECOMMENDATIONS);
    }
  }, [data, isLoading, fallbackMode]);
  if (!data?.result?.length && !isLoading) {
    return null;
  }
  const title = fallbackMode
    ? "Рекомендуемые товары"
    : "Рекомендации по основным вашим просмотрам";
  return (
    <section className="pt-8">
      <div className="container">
        <div className="flex items-center justify-between">
          <h2 className="font-medium text-lg tracking-tight">
            {title}
          </h2>
          <Button variant="outline" className="hidden md:flex">
            Все рекомендации
            <ArrowRight width={16} height={16} />
          </Button>
        </div>
        <div className="pt-4 grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))
          ) : (
            data?.result?.slice(0, 12).map((product: Product, index: number) => (
              <ProductCard 
                key={product.id} 
                {...product} 
                position={index + 1}
                page={1}
                isRecommendation={true}
              />
            ))
          )}
        </div>
        <div className="pt-4 block md:hidden">
          <Button variant="outline">
            Все рекомендации
            <ArrowRight width={16} height={16} />
          </Button>
        </div>
      </div>
    </section>
  );
};
export default Recommendation;