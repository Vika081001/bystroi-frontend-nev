// widgets/product/deals.tsx
"use client";

import React from 'react';
import { ArrowRight } from 'lucide-react';

import { Product, useProducts } from '@/entities/product';
import { ProductCard } from '@/entities/product';
import { ProductCardSkeleton } from '@/entities/product/ui/product-card-skeleton';
import { Button } from '@/shared/ui/kit/button';
import Link from 'next/link';

export const Deals = () => {
  const params = {
    size: 20,
    sort_by: 'total_sold' as const,
    sort_order: 'desc' as const,
  };

  const { data, isLoading } = useProducts(params);

  if (!data?.result?.length) {
    return null;
  }

  return (
    <section className="py-8">
      <div className="container">
        <div className="flex items-center justify-between">
          <h2 className="font-medium text-lg tracking-tight">
            Лучшие предложения для вас
          </h2>
          <Button variant="outline" className="hidden md:flex cursor-pointer">
            <Link href="/products">
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
            data.result.slice(0, 12).map((product: Product, index: number) => (
              <ProductCard key={product.id} {...product} />
            ))
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