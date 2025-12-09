// файл: /shared/ui/categories/index.tsx
"use client";

import { ArrowRight } from "lucide-react";
import React from "react";
import Link from "next/link";

import { Button } from "@/shared/ui/kit/button";
import { useCategories, useCategoryTree } from "@/shared/hooks/useCategory";
import { Skeleton } from "@/shared/ui/kit/skeleton";
import { transformImageUrl } from "@/shared/lib/image-utils";

const Categories = () => {
  const { data: categoriesData, isLoading } = useCategoryTree();

  const softGradients = [
    "linear-gradient(135deg, #f9d8d6 0%, #f8e1e7 100%)",
    "linear-gradient(135deg, #dcecfb 0%, #f5e9ff 100%)",
    "linear-gradient(135deg, #fff5d7 0%, #ffdada 100%)",
    "linear-gradient(135deg, #e8f9e9 0%, #d8f3ff 100%)",
    "linear-gradient(135deg, #e3fdfd 0%, #ffe6fa 100%)",
    "linear-gradient(135deg, #f6f3ff 0%, #e4f0ff 100%)",
    "linear-gradient(135deg, #fff0f5 0%, #fef6e4 100%)",
    "linear-gradient(135deg, #f8d3ff 0%, #d6e4ff 100%)",
  ];

  const fallbackImages = [
    "buisnes.jpg",
    "domdacha.jpg", 
    "animals.jpg",
    "acses.jpg",
    "items.jpg",
    "house.jpg",
    "work.jpg"
  ];

  if (isLoading) {
    return (
      <section className="pt-8">
        <div className="container">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="pt-4 grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-56 rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }


  const mainCategories = categoriesData?.result?.filter(
    category => !category.parent_id
  ) || [];

  const displayedCategories = mainCategories.slice(0, 7);

  return (
    <section className="pt-8">
      <div className="container">
        <div className="flex items-center justify-between">
          <h2 className="font-medium text-lg tracking-tight">
            Популярные категории
          </h2>
          <Button variant="outline" className="hover:ring-gray-200">
            <Link href="/categories">
              Все категории <ArrowRight width={16} height={16} className="inline"/>
            </Link>
          </Button>
        </div>
        <div className="pt-4 grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7">
          {displayedCategories.map((category, index) => {
            const gradient = softGradients[index % softGradients.length];

            return (
              <a
                href={`/products?category=${category.name}`}
                style={{ background: gradient }}
                className="relative group flex h-56 items-end p-4 rounded-lg overflow-hidden hover:ring-2 hover:ring-gray-200"
                key={category.id}
              >
                <div className="flex justify-center absolute inset-0 brightness-75 group-hover:brightness-50">
                  {category.image_url ? (
                    <img
                      src={transformImageUrl(category.image_url)}
                      className="w-full object-cover"
                      alt={category.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/airpods.png";
                      }}
                    />
                  ) : (
                    <img
                      src={fallbackImages[index]}
                      className="w-full object-fill"
                      alt={category.name}
                    />
                  )}
                </div>
                <p className="leading-4 pt-3 text-xl font-medium tracking-tight relative text-white">
                  {category.name}
                </p>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;