// файл: /shared/ui/category-menu.tsx
import { GripIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

import { Button } from "@/shared/ui/kit/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/kit/popover";
import { useCategoryTree } from "@/shared/hooks/useCategory";
import { Skeleton } from "@/shared/ui/kit/skeleton";
import { transformImageUrl } from "@/shared/lib/image-utils";

export const CategoryMenu = () => {
  // Показываем только категории с актуальными товарами
  const { data: categoryTreeData, isLoading, error } = useCategoryTree(true);

  const mainCategories = categoryTreeData?.result?.filter(
    category => {
      // Показываем только активные главные категории
      if (!category.is_active || category.parent_id) {
        return false;
      }
      
      // Функция для проверки, есть ли у категории или её дочерних категорий товары
      const hasProductsInTree = (cat: typeof category): boolean => {
        // Если у категории есть флаг has_products, используем его
        if (cat.has_products === true) {
          return true;
        }
        
        // Если у категории есть дочерние категории, проверяем их рекурсивно
        if (cat.children && cat.children.length > 0) {
          return cat.children.some(child => {
            if (!child.is_active) return false;
            return hasProductsInTree(child);
          });
        }
        
        return false;
      };
      
      // Проверяем, есть ли товары в дереве категории
      return hasProductsInTree(category);
    }
  ) || [];

  const getFirstLevelChildren = (categoryId: number) => {
    const category = categoryTreeData?.result?.find(cat => cat.id === categoryId);
    return category?.children?.filter(child => child.is_active) || [];
  };

  if (isLoading) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="text-gray-700 p-4 h-10">
            <GripIcon width={16} height={16} />
            Каталог
          </Button>
        </PopoverTrigger>
        <PopoverContent sideOffset={8} className="w-screen rounded-none p-0 py-4">
          <div className="flex">
            <div className="container">
              <div className="grid grid-cols-3 gap-8">
                {[1, 2, 3].map(i => (
                  <div key={i} className="relative flex h-24 items-end p-4 rounded-lg overflow-hidden">
                    <Skeleton className="absolute inset-0 w-full h-full" />
                    <Skeleton className="h-6 w-3/4 relative" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  if (error) {
    return (
      <Button variant="outline" className="text-gray-700 p-4 h-10">
        <GripIcon width={16} height={16} />
        Каталог
      </Button>
    );
  }

  const popularCategories = mainCategories.slice(0, 3);
  const columnCategories = mainCategories.slice(3, 9);

  const columnGroups = [];
  for (let i = 0; i < columnCategories.length; i += 2) {
    columnGroups.push(columnCategories.slice(i, i + 2));
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="text-gray-700 p-4 h-10 cursor-pointer">
          <GripIcon width={16} height={16} />
          Каталог
        </Button>
      </PopoverTrigger>
      <PopoverContent sideOffset={8} className="w-screen rounded-none p-0 py-4">
        <div className="flex">
          <div className="container">
            <div className="grid grid-cols-3 gap-8">
              {popularCategories.map((category) => (
                <Link
                  href={`/products?global_category_id=${category.id}`}
                  key={category.id}
                  className="relative group flex h-24 items-end p-4 rounded-lg overflow-hidden hover:ring-2 hover:ring-gray-200"
                >
                  <div className="flex justify-center absolute inset-0 brightness-75 group-hover:brightness-50">
                    {category.image_url ? (
                      <img
                        src={"https://app.tablecrm.com/api/v1/" + category.image_url}
                        className="w-full object-cover"
                        alt={category.name}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/airpods.jpeg";
                        }}
                      />
                    ) : (
                      <img
                        src="https://avatars.mds.yandex.net/i?id=c5ca2b4ff0c629b038e6630fbc5eb33911f331f5-4872059-images-thumbs&n=13"
                        className="w-full object-cover"
                        alt="placeholder"
                      />
                    )}
                  </div>
                  <p className="leading-4 pt-3 text-xl font-medium tracking-tight relative text-white">
                    {category.name}
                  </p>
                </Link>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8">
              {columnGroups.map((group, groupIndex) => (
                <div key={groupIndex} className="flex gap-4">
                  {group[0] && (
                    <Link
                      href={`/products?global_category_id=${group[0].id}`}
                      className="relative group flex h-56 w-42 items-end p-4 rounded-lg overflow-hidden hover:ring-2 hover:ring-gray-200"
                    >
                      <div className="flex justify-center absolute inset-0 brightness-75 group-hover:brightness-50">
                        {group[0].image_url ? (
                          <img
                            src={"https://app.tablecrm.com/api/v1/" + group[0].image_url}
                            className="w-full object-cover"
                            alt={group[0].name}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/airpods.jpeg";
                            }}
                          />
                        ) : (
                          <img
                            src="https://avatars.mds.yandex.net/i?id=c5ca2b4ff0c629b038e6630fbc5eb33911f331f5-4872059-images-thumbs&n=13"
                            className="w-full object-fill"
                            alt="placeholder"
                          />
                        )}
                      </div>
                      <p className="leading-4 pt-3 text-xl font-medium tracking-tight relative text-white">
                        {group[0].name}
                      </p>
                    </Link>
                  )}
                  
                  <div className="flex flex-col gap-2 flex-1">
                    {group.map((category) => {
                      const children = getFirstLevelChildren(category.id);
                      return (
                        <React.Fragment key={category.id}>
                          <Link 
                            href={`/products?global_category_id=${category.id}`} 
                            className="font-medium text-lg tracking-tight hover:text-blue-600"
                          >
                            {category.name}
                          </Link>
                          <div className="flex flex-col gap-1">
                            {children
                              .slice(0, 3)
                              .map((child) => (
                                <Link
                                  key={child.id}
                                  href={`/products?global_category_id=${child.id}`}
                                  className="text-sm tracking-tight text-gray-500 hover:text-gray-700"
                                >
                                  {child.name}
                                </Link>
                              ))
                            }
                          </div>
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};