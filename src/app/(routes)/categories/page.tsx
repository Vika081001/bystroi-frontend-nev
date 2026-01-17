// файл: app/(routes)/categories/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";

import { useCategoryTree } from "@/shared/hooks/useCategory";
import { Skeleton } from "@/shared/ui/kit/skeleton";
import { transformImageUrl } from "@/shared/lib/image-utils";
import { Button } from "@/shared/ui/kit/button";
import { ArrowLeft, ChevronRight, Grid3X3 } from "lucide-react";
import { BreadcrumbsDemo } from "@/shared/ui/breadcrumbs";

const CategoriesPage = () => {
  // Показываем только категории с актуальными товарами
  const { data: categoryTreeData, isLoading } = useCategoryTree(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const [expandedCategories, setExpandedCategories] = useState<Record<number, boolean>>({});
  const mainCategories = categoryTreeData?.result?.filter(
    category => category.is_active && !category.parent_id
  ) || [];

  const selectedCategory = selectedCategoryId 
    ? mainCategories.find(cat => cat.id === selectedCategoryId)
    : null;

  const firstLevelChildren = selectedCategory?.children?.filter(child => child.is_active) || [];
  
  useEffect(() => {
    if (!isMobile && mainCategories.length > 0 && !selectedCategoryId) {
      setTimeout(() => {
        setSelectedCategoryId(mainCategories[0].id);
      }, 0);
    }
  }, [mainCategories, isMobile, selectedCategoryId]);

  const getNestedSubcategories = useCallback((parentId: number) => {
    const category = categoryTreeData?.result?.find(cat => cat.id === parentId);
    if (!category) return [];

    const getAllChildren = (cat: any): any[] => {
      const children = cat.children?.filter((child: any) => child.is_active) || [];
      return children.flatMap((child: any) => [
        child,
        ...getAllChildren(child)
      ]);
    };
    
    return getAllChildren(category);
  }, [categoryTreeData]);

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="container">
          <div className="mb-8">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-96 mt-2" />
          </div>
          <div className="flex gap-8">
            <Skeleton className="w-64 h-[600px]" />
            <div className="flex-1">
              <Skeleton className="h-8 w-64 mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-32 rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container">
        <div className="mb-8 flex justify-between">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              На главную
            </Link>
          </Button>
          <div className="hidden inline-flex items-center gap-2 text-gray-500 inline">
              <Grid3X3 className="h-4 w-4 inline" />
              <span>{mainCategories.length} категорий</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 min-h-190">
          <div className="w-full md:w-90 flex-shrink-0">
            <div className="sticky top-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Все категории</h1>
                            <p className="text-gray-500 mt-2">
                                Выберите категорию товаров для просмотра подкатегорий
                            </p>
                    </div>
                </div>
        
              <div className="space-y-1 max-h-full overflow-y-auto pr-2">
                {mainCategories.map((category) => {
                  const isSelected = selectedCategoryId === category.id;
                  const childCount = category.children?.filter((child: any) => child.is_active).length || 0;
                  
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategoryId(category.id)}
                      onMouseEnter={() => !isMobile && setSelectedCategoryId(category.id)}
                      className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center justify-between group ${
                        isSelected 
                          ? 'bg-blue-50 border border-blue-100 text-blue-700' 
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {category.image_url ? (
                          <img
                            src={"https://app.tablecrm.com/api/v1/" + category.image_url}
                            alt={category.name}
                            className="h-8 w-8 object-fill rounded"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/category-placeholder.png";
                            }}
                          />
                        ) : (
                          <div className="h-8 w-8 rounded bg-gray-100 flex items-center justify-center">
                            <span className="text-gray-400 text-sm">📦</span>
                          </div>
                        )}
                        <span className="font-medium truncate">{category.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {childCount > 0 && (
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            isSelected 
                              ? 'bg-blue-100 text-blue-600' 
                              : 'bg-gray-100 text-gray-500'
                          }`}>
                            {childCount}
                          </span>
                        )}
                        <ChevronRight className={`h-4 w-4 transition-transform ${
                          isSelected ? 'text-blue-500 rotate-90' : 'text-gray-400'
                        }`} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex-1">
            {selectedCategory ? (
              <>
                <div className="mb-6 flex justify-between justify-content-center">
                  <div className="flex gap-4 mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        {selectedCategory.name}
                      </h2>
                      {selectedCategory.description && (
                        <p className="text-gray-600 mt-1">{selectedCategory.description}</p>
                      )}
                    </div>
                  </div>
                  
                  <Button asChild className="mb-6 bg-blue-500">
                    <Link href={`/products?category=${selectedCategory.id}`}>
                      Перейти к товарам этой категории
                    </Link>
                  </Button>
                </div>

                {firstLevelChildren.length > 0 ? (
                <div className="max-h-165 overflow-y-scroll pr-2">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    Подкатегории
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {firstLevelChildren.map((child) => {
                        const grandChildren = child.children?.filter((gc: any) => gc.is_active) || [];
                        const isExpanded = expandedCategories[child.id] || false;
                        
                        const displayChildren = isExpanded ? grandChildren : grandChildren.slice(0, 5);
                        
                        return (
                        <div
                            key={child.id}
                            className="border rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all"
                        >
                            <Link 
                            href={`/products?category=${child.name}`}
                            className="block"
                            >
                            <div className="flex items-center gap-3 mb-3">
                                {child.image_url ? (
                                <img
                                    src={transformImageUrl(child.image_url)}
                                    alt={child.name}
                                    className="h-12 w-12 object-cover rounded"
                                    onError={(e) => {
                                    (e.target as HTMLImageElement).src = "/category-placeholder.png";
                                    }}
                                />
                                ) : (
                                <div className="h-12 w-12 rounded bg-gray-100 flex items-center justify-center">
                                    <span className="text-gray-400">📦</span>
                                </div>
                                )}
                                <div className="flex-1">
                                <h4 className="font-medium text-gray-800 group-hover:text-blue-600">
                                    {child.name}
                                </h4>
                                </div>
                            </div>
                            </Link>
                            
                            {grandChildren.length > 0 ? (
                            <div className="space-y-1 mt-3">
                                <p className="text-sm font-medium text-gray-600 mb-2">
                                Подразделы:
                                </p>
                                {displayChildren.map((grandChild: any) => (
                                <Link
                                    key={grandChild.id}
                                    href={`/products?category=${grandChild.name}`}
                                    className="block text-sm text-gray-600 hover:text-blue-600 py-1 px-2 hover:bg-blue-50 rounded"
                                >
                                    {grandChild.name}
                                </Link>
                                ))}
                                
                                {grandChildren.length > 5 && (
                                <button
                                    onClick={() => setExpandedCategories(prev => ({
                                    ...prev,
                                    [child.id]: !prev[child.id]
                                    }))}
                                    className="block text-sm text-blue-600 hover:text-blue-700 py-1 px-2 hover:bg-blue-50 rounded font-medium mt-2"
                                >
                                    {isExpanded ? 'Свернуть' : `+${grandChildren.length - 5} еще`}
                                </button>
                                )}
                            </div>
                            ) : (
                            <Link
                                href={`/products?category=${child.name}`}
                                className="block text-sm text-gray-600 hover:text-blue-600 py-2 px-2 hover:bg-blue-50 rounded mt-2"
                            >
                                Перейти к товарам этой подкатегории
                            </Link>
                            )}
                        </div>
                        );
                    })}
                    </div>
                </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-4xl mb-4">📭</div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">
                      Нет подкатегорий
                    </h3>
                    <p className="text-gray-500 mb-6">
                      В этой категории пока нет подкатегорий
                    </p>
                    <Button asChild>
                      <Link href={`/products?category=${selectedCategory.id}`}>
                        Смотреть товары категории
                      </Link>
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 md:hidden">
                <div className="text-gray-400 text-4xl mb-4">👆</div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Выберите категорию
                </h3>
                <p className="text-gray-500">
                  Нажмите на категорию слева, чтобы увидеть ее подкатегории
                </p>
              </div>
            )}
          </div>
        </div>

        {isMobile && !selectedCategory && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 md:hidden">
            <p className="text-center text-gray-600 mb-2">
              Выберите категорию из списка выше
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;