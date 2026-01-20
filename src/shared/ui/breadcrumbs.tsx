"use client"
import Link from "next/link";
import React, { useMemo } from "react";
import { useCategoryTree } from "../hooks/useCategory";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./kit/breadcrumb";

interface BreadcrumbsDemoProps {
  isProduct?: boolean;
  productName?: string;
  categoryName?: string;
}

export const BreadcrumbsDemo: React.FC<BreadcrumbsDemoProps> = ({
  isProduct = false,
  productName = "",
  categoryName = null,
}) => {
  const { data: categoryTreeData } = useCategoryTree();

  
  const findCategoryPathByName = useMemo(() => {
    if (!categoryName || !categoryTreeData?.result) return [];

    const findPath = (
      categories: any[],
      targetName: string,
      currentPath: any[] = []
    ): any[] | null => {
      for (const category of categories) {
        const newPath = [...currentPath, category];
        
        
        const normalize = (str: string) => 
          str.toLowerCase().replace(/\s+/g, '').trim();
        
        if (normalize(category.name) === normalize(targetName)) {
          return newPath;
        }
        
        
        if (category.children && category.children.length > 0) {
          const childPath = findPath(category.children, targetName, newPath);
          if (childPath) {
            return childPath;
          }
        }
      }
      return null;
    };

    const path = findPath(categoryTreeData.result, categoryName);
    return path || [];
  }, [categoryName, categoryTreeData]);

  const getCategoryUrl = (category: any) => {
    return `/products/?global_category_id=${category.id}`;
  };

  if (isProduct) {
    return (
      <Breadcrumb className="py-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Главная</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/categories">Категории</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            
          <BreadcrumbPage>{categoryName}</BreadcrumbPage>
            
          </BreadcrumbItem>
          
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{productName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  return (
    <Breadcrumb className="py-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Главная</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        
        {categoryName && findCategoryPathByName.length > 0 ? (
          findCategoryPathByName.map((category, index) => {
            const isLast = index === findCategoryPathByName.length - 1;
            
            return (
              <React.Fragment key={category.id}>
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{category.name}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={getCategoryUrl(category)}>
                        {category.name}
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            );
          })
        ) : (
          <BreadcrumbItem>
            <BreadcrumbPage>Категории</BreadcrumbPage>
          </BreadcrumbItem>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};