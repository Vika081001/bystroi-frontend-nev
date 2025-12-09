import { SortBy, SortOrder } from "@/entities/product/model/types";
import { Product } from "@/entities/product/model/types";

export const sortProducts = (
  products: Product[],
  sort_by: SortBy,
  sort_order: SortOrder
): Product[] => {
  if (!products || products.length === 0) return products;

  
  const hasNonNullValues = products.some(product => {
    const value = product[sort_by];
    return value != null && value !== undefined;
  });

  
  if (!hasNonNullValues) {
    return products;
  }

  
  return [...products].sort((a, b) => {
    const aValue = a[sort_by];
    const bValue = b[sort_by];

    
    if (aValue == null && bValue == null) return 0;
    
    
    if (aValue == null) return 1;
    
    
    if (bValue == null) return -1;

    
    if (sort_order === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });
};