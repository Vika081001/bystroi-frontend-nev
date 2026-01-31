// widgets/product/deals.tsx
"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import { Product, useProducts, fetchProducts } from '@/entities/product';
import { ProductCard } from '@/entities/product';
import { ProductCardSkeleton } from '@/entities/product/ui/product-card-skeleton';
import { Button } from '@/shared/ui/kit/button';
import Link from 'next/link';

export const Deals = () => {
  const searchParams = useSearchParams();
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
    
    // Приоритет у address, если его нет - используем city (как с адресом)
    if (address) {
      baseParams.address = address;
    } else if (city) {
      // Передаем полное название города напрямую из URL (как с адресом)
      baseParams.city = city;
    }
    if (sellerId) {
      baseParams.seller_id = Number(sellerId);
    }
    // Координаты для выбора ближайшей цены
    // Сначала проверяем URL, если нет - берем из sessionStorage (автоматически определенный город)
    if (lat) {
      const latNum = Number(lat);
      if (!Number.isNaN(latNum)) {
        baseParams.lat = latNum;
      }
    } else if (typeof window !== 'undefined') {
      try {
        const detected = sessionStorage.getItem('detected_city');
        if (detected) {
          const parsed = JSON.parse(detected);
          if (parsed.lat != null) {
            baseParams.lat = parsed.lat;
          }
        }
      } catch (e) {
        // Игнорируем ошибки
      }
    }
    
    if (lon) {
      const lonNum = Number(lon);
      if (!Number.isNaN(lonNum)) {
        baseParams.lon = lonNum;
      }
    } else if (typeof window !== 'undefined') {
      try {
        const detected = sessionStorage.getItem('detected_city');
        if (detected) {
          const parsed = JSON.parse(detected);
          if (parsed.lon != null) {
            baseParams.lon = parsed.lon;
          }
        }
      } catch (e) {
        // Игнорируем ошибки
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
  
  
  // Параметры для основного запроса
  const params = useMemo(() => {
    const baseParams: any = {
    size: 20,
    sort_by: 'total_sold' as const,
    sort_order: 'desc' as const,
  };
    
    // Приоритет у address, если его нет - используем city (как с адресом)
    if (address) {
      baseParams.address = address;
    } else if (city) {
      // Передаем полное название города напрямую из URL (как с адресом)
      baseParams.city = city;
    }
    
    // Если у селлера есть товары - используем seller_id, иначе не используем
    if (sellerId && hasSellerProducts) {
      baseParams.seller_id = Number(sellerId);
    }
    
    // Координаты для выбора ближайшей цены
    // Сначала проверяем URL, если нет - берем из sessionStorage (автоматически определенный город)
    if (lat) {
      const latNum = Number(lat);
      if (!Number.isNaN(latNum)) {
        baseParams.lat = latNum;
      }
    } else if (typeof window !== 'undefined') {
      try {
        const detected = sessionStorage.getItem('detected_city');
        if (detected) {
          const parsed = JSON.parse(detected);
          if (parsed.lat != null) {
            baseParams.lat = parsed.lat;
          }
        }
      } catch (e) {
        // Игнорируем ошибки
      }
    }
    
    if (lon) {
      const lonNum = Number(lon);
      if (!Number.isNaN(lonNum)) {
        baseParams.lon = lonNum;
      }
    } else if (typeof window !== 'undefined') {
      try {
        const detected = sessionStorage.getItem('detected_city');
        if (detected) {
          const parsed = JSON.parse(detected);
          if (parsed.lon != null) {
            baseParams.lon = parsed.lon;
          }
        }
      } catch (e) {
        // Игнорируем ошибки
      }
    }
    
    return baseParams;
  }, [searchParams, hasSellerProducts, address, city, sellerId, lat, lon]);

  const { data, isLoading } = useProducts(params);

  return (
    <section className="py-8">
      <div className="container">
        <div className="flex items-center justify-between">
          <h2 className="font-medium text-lg tracking-tight">
            Лучшие предложения для вас
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
              <ProductCard key={product.id} {...product} />
            )) || []
          )}
        </div>
        <div className="md:hidden pt-4">
          <Button variant="outline">
            Все предложения
            <ArrowRight width={16} height={16} />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Deals;