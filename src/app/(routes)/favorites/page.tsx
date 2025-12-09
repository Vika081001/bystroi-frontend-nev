"use client";

import { Heart } from "lucide-react";
import React, { useState, useEffect } from "react";
import Link from "next/link";

import { useFavorites } from "@/shared/hooks/useFavorites";
import { ProductCard } from "@/entities/product/ui/product-card";
import { ProductCardSkeleton } from "@/entities/product/ui/product-card-skeleton";
import { fetchProduct } from "@/entities/product/api";
import { Button } from "@/shared/ui/kit/button";

const FavoritesPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: favorites, isLoading: isFavoritesLoading } = useFavorites({ page: currentPage });
  const [productsData, setProductsData] = useState<Record<number, any>>({});
  const [loadingProducts, setLoadingProducts] = useState<Record<number, boolean>>({});
  const [allProductsLoaded, setAllProductsLoaded] = useState(false);

  useEffect(() => {
    if (favorites?.result && favorites.result.length > 0 && !allProductsLoaded) {
      const loadAllProducts = async () => {
        const newProductsData: Record<number, any> = {};
        const newLoadingProducts: Record<number, boolean> = {};

        favorites.result.forEach(favorite => {
          newLoadingProducts[favorite.nomenclature_id] = true;
        });

        setLoadingProducts(newLoadingProducts);

        try {
          const productPromises = favorites.result.map(async (favorite) => {
            try {
              const product = await fetchProduct({ product_id: favorite.nomenclature_id });
              return { id: favorite.nomenclature_id, data: product };
            } catch (error) {
              console.error(`Ошибка при загрузке товара ${favorite.nomenclature_id}:`, error);
              return { id: favorite.nomenclature_id, data: null };
            }
          });

          const productsResults = await Promise.all(productPromises);
          
          productsResults.forEach(result => {
            if (result.data) {
              newProductsData[result.id] = result.data;
            }
          });

          setProductsData(newProductsData);
          setAllProductsLoaded(true);
        } catch (error) {
          console.error("Ошибка при загрузке всех продуктов:", error);
        } finally {
          setLoadingProducts({});
        }
      };

      loadAllProducts();
    }
  }, [favorites, allProductsLoaded]);

  const isLoading = isFavoritesLoading || !allProductsLoaded;
  const hasItems = favorites?.result && favorites.result.length > 0;
  if (isLoading && !favorites) {
    return (
      <div className="container py-8 min-h-185 flex flex-col">
        <div className="flex items-center justify-between mb-6 mt-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-gray-200 rounded-md animate-pulse" />
            <div className="h-8 w-48 bg-gray-200 rounded-md animate-pulse" />
          </div>
          <div className="h-6 w-24 bg-gray-200 rounded-md animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 flex-grow">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-185 flex flex-col">
      <div className="container py-8 flex-grow">
        <div className="flex items-center justify-between mb-6 mt-3">
          <h1 className="flex gap-2 tracking-tight text-blue-600 text-2xl font-medium">
            <Heart className="h-6 w-6 text-red-500 fill-red-500" />
            Избранное
          </h1>
          {hasItems && (
            <span className="text-gray-500 text-sm md:text-base">
              {favorites?.count || 0} товаров
            </span>
          )}
        </div>

        {!hasItems ? (
          <div className="text-center py-12 md:py-24 flex-grow flex flex-col justify-center">
            <Heart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              В избранном пока ничего нет
            </h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Добавляйте товары в избранное, нажимая на иконку ♡ на карточке товара
            </p>
            <Link href="/">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Перейти к покупкам
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="pt-4 grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {favorites?.result?.map((favorite, index) => {
                const product = productsData[favorite.nomenclature_id];
                const isLoadingProduct = loadingProducts[favorite.nomenclature_id];

                if (isLoadingProduct) {
                  return <ProductCardSkeleton key={`skeleton-${favorite.id}`} />;
                }

                if (!product) {
                  return null;
                }

                return (
                  <ProductCard
                    key={`product-${favorite.id}`}
                    {...product}
                    listing_pos={index + 1}
                    listing_page={currentPage}
                    hideFavoriteButton={true}
                  />
                );
              })}
            </div>

            {favorites && favorites.count > 20 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                {currentPage > 1 && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setCurrentPage(prev => prev - 1);
                      setAllProductsLoaded(false);
                    }}
                    disabled={currentPage === 1}
                  >
                    Назад
                  </Button>
                )}
                
                <span className="text-gray-600 text-sm">
                  Страница {currentPage} из {Math.ceil(favorites.count / 20)}
                </span>
                
                {currentPage < Math.ceil(favorites.count / 20) && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setCurrentPage(prev => prev + 1);
                      setAllProductsLoaded(false);
                    }}
                  >
                    Вперед
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;