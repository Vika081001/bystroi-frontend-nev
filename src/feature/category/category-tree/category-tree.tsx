"use client"

import React, { useState } from "react";
import { ChevronRight, ChevronDown, Folder, FolderOpen, Edit, Trash2, Image as ImageIcon } from "lucide-react";

import { Button } from "@/shared/ui/kit/button";
import { Badge } from "@/shared/ui/kit/badge";
import { Category } from "@/shared/types/category";

interface CategoryTreeProps {
  categories: Category[];
  level?: number;
  onEdit: (category: Category) => void;
  onDelete: (id: number) => void;
  onUploadImage: (id: number) => void;
  selectedCategory?: Category | null;
}

export const CategoryTree: React.FC<CategoryTreeProps> = ({
  categories,
  level = 0,
  onEdit,
  onDelete,
  onUploadImage,
  selectedCategory,
}) => {
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);

  const toggleCategory = (id: number) => {
    setExpandedCategories((prev) =>
      prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-1">
      {categories.map((category) => {
        const isExpanded = expandedCategories.includes(category.id);
        const hasChildren = category.children && category.children.length > 0;
        const isSelected = selectedCategory?.id === category.id;

        return (
          <div key={category.id}>
            <div
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg transition-colors
                ${isSelected ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50"}
              `}
              style={{ paddingLeft: `${level * 20 + 12}px` }}
            >
              {hasChildren ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => toggleCategory(category.id)}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              ) : (
                <div className="w-6" />
              )}

              {isExpanded ? (
                <FolderOpen className="h-4 w-4 text-blue-500" />
              ) : (
                <Folder className="h-4 w-4 text-gray-500" />
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium truncate">{category.name}</span>
                  {!category.is_active && (
                    <Badge variant="outline" className="text-xs">
                      Неактивна
                    </Badge>
                  )}
                  <span className="text-xs text-gray-500">#{category.code}</span>
                </div>
                {category.description && (
                  <p className="text-xs text-gray-600 truncate">{category.description}</p>
                )}
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onUploadImage(category.id)}
                  title="Загрузить изображение"
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(category)}
                  title="Редактировать"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(category.id)}
                  title="Удалить"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {hasChildren && isExpanded && (
              <CategoryTree
                categories={category.children!}
                level={level + 1}
                onEdit={onEdit}
                onDelete={onDelete}
                onUploadImage={onUploadImage}
                selectedCategory={selectedCategory}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};