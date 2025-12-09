// widgets/product/product-viewed.tsx
"use client";

import React from 'react';
import Link from 'next/link';

import { useProductViewHistory } from '@/shared/hooks/use-product-view-history';
import { transformImageUrl } from '@/shared/lib/image-utils';

export const ProductViewed = () => {
  const { viewedProducts } = useProductViewHistory();

  if (viewedProducts.length === 0) {
    return null;
  }

  return (
    <section className="pt-8 pb-14 mt-8 border-t border-gray-200">
      <div className="container">
        <h2 className="font-medium text-lg tracking-tight">
          Недавно просмотренные
        </h2>
        <div className="pt-4 grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {viewedProducts.slice(0, 6).map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="group relative overflow-hidden h-72 rounded-lg border border-gray-100 shadow-sm hover:ring-2 ring-gray-200 flex items-end transition-all duration-300"
            >
              <div className="absolute inset-0">
                {product.images?.[0] ? (
                  <img
                    src={transformImageUrl(product.images[0])}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-gray-300" />
                      <p className="text-sm">Нет изображения</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              
              <div className="flex flex-col p-3 relative z-20 mt-auto flex-1 w-full">
                <div className="space-y-1">
                  <p className="tracking-tight font-medium leading-4 text-white line-clamp-2">
                    {product.name}
                  </p>
                  <span className="text-sm text-gray-300">{product.category_name}</span>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-lg text-white">
                      {product.price.toLocaleString('ru-RU')}₽
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductViewed;