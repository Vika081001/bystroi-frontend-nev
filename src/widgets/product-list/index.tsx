"use client";

import React, { useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

import { ProductCard } from "@/entities/product/ui";
import { ProductCardSkeleton } from "@/entities/product/ui/product-card-skeleton";
import { fetchProducts } from "@/entities/product/api";
import { GetProductsDto, Product } from "@/entities/product/model/types";

interface ProductsListProps {
  params: Partial<GetProductsDto>;
  onTotalCountChange?: (count: number) => void;
}

const ProductsList: React.FC<ProductsListProps> = ({ 
  params, 
  onTotalCountChange 
}) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ["products", params],
    queryFn: ({ pageParam = 1 }) =>
      fetchProducts({ 
        ...params, 
        page: pageParam as number, 
        size: params.size || 20 
      }),
    getNextPageParam: (lastPage) => {
      if (lastPage.page * lastPage.size < lastPage.count) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
  
  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  useEffect(() => {
    if (data?.pages?.[0]?.count !== undefined && onTotalCountChange) {
      onTotalCountChange(data.pages[0].count);
    }
  }, [data, onTotalCountChange]);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="flex-1">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {Array.from({ length: 20 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-2">Ошибка загрузки продуктов</div>
        <button 
          onClick={() => window?.location.reload()}
          className="text-blue-600 hover:underline"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  const totalCount = data?.pages?.[0]?.count || 0;

  if (totalCount === 0) {
    return (
      <div className="text-center py-12 w-full aligin-content-center">
        <p className="text-gray-500 mb-4">Товары не найдены</p>
        <p className="text-sm text-gray-400">
          Попробуйте изменить параметры фильтрации
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {data?.pages.map((page) => (
          <React.Fragment key={page.page}>
            {page.result.map((product: Product) => (
              <ProductCard {...product} key={product.id} />
            ))}
          </React.Fragment>
        ))}

        {isFetchingNextPage &&
          Array.from({ length: 5 }).map((_, index) => (
            <ProductCardSkeleton key={`loader-${index}`} />
          ))}
      </div>

      {hasNextPage && (
        <div ref={ref} className="h-10 w-full bg-transparent" />
      )}
    </div>
  );
};

export default ProductsList;