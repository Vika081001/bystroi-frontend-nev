import { CategoryTree } from "../types/category";

export const findCategoryPath = (
  categories: CategoryTree[],
  targetId: number,
  currentPath: CategoryTree[] = []
): CategoryTree[] | null => {
  for (const category of categories) {
    const newPath = [...currentPath, category];
    
    if (category.id === targetId) {
      return newPath;
    }
    
    if (category.children && category.children.length > 0) {
      const childPath = findCategoryPath(category.children, targetId, newPath);
      if (childPath) {
        return childPath;
      }
    }
  }
  return null;
};


export const getCategoryPathString = (
  categories: CategoryTree[],
  targetId: number
): string => {
  const path = findCategoryPath(categories, targetId);
  return path ? path.map(cat => cat.name).join(' → ') : '';
};