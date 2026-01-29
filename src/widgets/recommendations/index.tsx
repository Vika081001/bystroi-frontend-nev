"use client"

import { ArrowRight } from 'lucide-react';
import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import { useProductViewHistory } from '@/shared/hooks/use-product-view-history';
import { Product, useProducts, fetchProducts } from '@/entities/product';
import { ProductCard } from '@/entities/product/ui/product-card';
import { ProductCardSkeleton } from '@/entities/product/ui/product-card-skeleton';
import { Button } from '@/shared/ui/kit/button';
import Link from 'next/link';

const DEFAULT_RECOMMENDATIONS = {
  size: 20,
  sort_by: 'total_sold' as const,
  sort_order: 'desc' as const,
};

export const Recommendation = () => {
  const searchParams = useSearchParams();
  const { getRecommendationsParams, viewedProducts } = useProductViewHistory();
  const [params, setParams] = useState<any>(DEFAULT_RECOMMENDATIONS);
  const [fallbackMode, setFallbackMode] = useState(false);
  const sellerId = searchParams.get('seller_id');
  const address = searchParams.get('address'); // Приоритет у address
  const city = searchParams.get('city'); // Обратная совместимость
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  
  // Сначала проверяем, есть ли товары у селлера
  const sellerParams = useMemo(() => {
    const baseParams: any = {
      size: 1, // Проверяем только наличие товаров
      sort_by: 'total_sold' as const,
      sort_order: 'desc' as const,
    };
    
    // Приоритет у address, если его нет - используем city
    if (address) {
      baseParams.address = address;
    } else if (city) {
      baseParams.city = city;
    }
    if (sellerId) {
      baseParams.seller_id = Number(sellerId);
    }
    // Координаты для выбора ближайшей цены
    if (lat) {
      const latNum = Number(lat);
      if (!Number.isNaN(latNum)) {
        baseParams.lat = latNum;
      }
    }
    if (lon) {
      const lonNum = Number(lon);
      if (!Number.isNaN(lonNum)) {
        baseParams.lon = lonNum;
      }
    }
    
    return baseParams;
  }, [address, city, sellerId, lat, lon]);
  
  const { data: sellerData } = useQuery({
    queryKey: ["products", "seller_check", sellerParams],
    queryFn: () => fetchProducts(sellerParams),
    enabled: !!sellerId, // Проверяем только если есть seller_id
    staleTime: 5 * 60 * 1000,
  });
  
  // Определяем, есть ли товары у селлера (проверяем и count, и наличие товаров в result)
  const hasSellerProducts = sellerData && sellerData.count > 0 && sellerData.result && sellerData.result.length > 0;
 
  const { data, isLoading, refetch } = useProducts(params);
  
  // Объединяем параметры из URL (city, seller_id) с параметрами рекомендаций
  useEffect(() => {
    const recommendationParams = getRecommendationsParams();
   
    let baseParams: any;
    if (recommendationParams) {
      baseParams = { ...recommendationParams };
      setFallbackMode(false);
    } else {
      baseParams = { ...DEFAULT_RECOMMENDATIONS };
      setFallbackMode(false);
    }
    
    // Приоритет у address, если его нет - используем city
    if (address) {
      baseParams.address = address;
    } else if (city) {
      baseParams.city = city;
    }
    
    // Если у селлера есть товары - используем seller_id, иначе не используем
    if (sellerId && hasSellerProducts) {
      baseParams.seller_id = Number(sellerId);
    } else if (sellerId && hasSellerProducts === false) {
      delete baseParams.seller_id;
    }
    
    // Координаты для выбора ближайшей цены
    if (lat) {
      const latNum = Number(lat);
      if (!Number.isNaN(latNum)) {
        baseParams.lat = latNum;
      }
    }
    if (lon) {
      const lonNum = Number(lon);
      if (!Number.isNaN(lonNum)) {
        baseParams.lon = lonNum;
      }
    }
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setParams(baseParams);
  }, [searchParams, getRecommendationsParams, viewedProducts, hasSellerProducts, address, city, sellerId, lat, lon]);
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
          <Button variant="outline" className="hidden md:flex cursor-pointer">
            <Link href={`/products?${searchParams.toString()}`}>
              Все предложения
              <ArrowRight width={16} height={16} className='inline ml-1' />
            </Link>
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