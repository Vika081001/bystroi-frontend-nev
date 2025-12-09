"use client"

import React, { useState, useEffect } from "react";
import { FolderTree, Plus, RefreshCw, AlertTriangle, X, Save, Upload, Image as ImageIcon, Edit, Trash2 } from "lucide-react";

import { CategoryTree } from "@/feature/category/category-tree/category-tree";
import { CategoryForm } from "@/feature/category/category-tree/category-form";
import { ImageUploadModal } from "@/feature/image/image-upload";
import {
  useCategoryTree,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useUploadCategoryImage,
} from "@/shared/hooks/useCategory";
import { Category } from "@/shared/types/category";

export default function CategoriesAdminPage() {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const [categoryForImageUpload, setCategoryForImageUpload] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [viewMode, setViewMode] = useState<"tree" | "flat">("tree");

  const {
    data: treeData,
    isLoading: isLoadingTree,
    refetch: refetchTree,
  } = useCategoryTree();

  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();
  const uploadImageMutation = useUploadCategoryImage();

  const categories = treeData?.result || [];
  const flatCategories: Category[] = [];

  const flattenCategories = (cats: Category[], level: number = 0) => {
    cats.forEach((cat) => {
      flatCategories.push({ ...cat });
      if (cat.children && cat.children.length > 0) {
        flattenCategories(cat.children, level + 1);
      }
    });
  };

  if (categories.length > 0) {
    flattenCategories(categories);
  }
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreateCategory = async (data: any) => {
    try {
      await createCategoryMutation.mutateAsync(data);
      showToast("Категория создана");
      setShowCreateModal(false);
      refetchTree();
    } catch (error) {
      showToast("Не удалось создать категорию", 'error');
    }
  };

  const handleEditCategory = async (data: any) => {
    if (!selectedCategory) return;

    try {
      await updateCategoryMutation.mutateAsync({
        id: selectedCategory.id,
        data,
      });
      showToast("Категория обновлена");
      setShowEditModal(false);
      setSelectedCategory(null);
      refetchTree();
    } catch (error) {
      showToast("Не удалось обновить категорию", 'error');
    }
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;

    try {
      await deleteCategoryMutation.mutateAsync(categoryToDelete);
      showToast("Категория удалена");
      setShowDeleteDialog(false);
      setCategoryToDelete(null);
      refetchTree();
    } catch (error) {
      showToast("Не удалось удалить категорию", 'error');
    }
  };

  const handleUploadImage = async (id: number, file: File) => {
    try {
      await uploadImageMutation.mutateAsync({ id, file });
      showToast("Изображение загружено");
      refetchTree();
    } catch (error) {
      showToast("Не удалось загрузить изображение", 'error');
      throw error;
    }
  };

  const handleEditClick = (category: Category) => {
    setSelectedCategory(category);
    setShowEditModal(true);
  };

  const handleDeleteClick = (id: number) => {
    setCategoryToDelete(id);
    setShowDeleteDialog(true);
  };

  const handleUploadImageClick = (id: number) => {
    const category = flatCategories.find((cat) => cat.id === id);
    if (category) {
      setCategoryForImageUpload({ id, name: category.name });
      setShowImageUploadModal(true);
    }
  };

  const refreshData = () => {
    refetchTree();
    showToast("Данные обновлены");
  };

  const Skeleton = ({ className }: { className: string }) => (
    <div className={`bg-gray-200 animate-pulse rounded ${className}`} />
  );

  const Button = ({ 
    children, 
    onClick, 
    disabled = false, 
    variant = 'default',
    size = 'default',
    className = '',
    type = 'button'
  }: { 
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    variant?: 'default' | 'outline' | 'ghost';
    size?: 'default' | 'sm' | 'lg';
    className?: string;
    type?: 'button' | 'submit';
  }) => {
    const baseClasses = 'font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    const variantClasses = {
      default: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
      ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    };

    const sizeClasses = {
      default: 'px-4 py-2 text-sm',
      sm: 'px-3 py-1.5 text-xs',
      lg: 'px-6 py-3 text-base',
    };

    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`
          ${baseClasses}
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${className}
        `}
      >
        {children}
      </button>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {}
      {toast && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
          toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.message}
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Управление категориями</h1>
          <p className="text-gray-500">
            Создание, редактирование и удаление категорий товаров
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={refreshData}
            disabled={isLoadingTree}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`h-4 w-4 ${isLoadingTree ? "animate-spin" : ""}`} />
            Обновить
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Создать категорию
          </button>
        </div>
      </div>

      {}
      <div className="flex gap-2 mb-4 p-1 bg-gray-100 rounded-lg w-fit">
        <button
          onClick={() => setViewMode("tree")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md ${
            viewMode === "tree" ? "bg-white shadow" : "hover:bg-gray-50"
          }`}
        >
          <FolderTree className="h-4 w-4" />
          Древовидный вид
        </button>
        <button
          onClick={() => setViewMode("flat")}
          className={`px-4 py-2 rounded-md ${
            viewMode === "flat" ? "bg-white shadow" : "hover:bg-gray-50"
          }`}
        >
          Список ({flatCategories.length})
        </button>
      </div>

      {viewMode === "tree" ? (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Дерево категорий</h2>
          </div>
          <div className="p-4">
            {isLoadingTree ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FolderTree className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>Категории не найдены</p>
                <p className="text-sm">Создайте первую категорию</p>
              </div>
            ) : (
              <CategoryTree
                categories={categories}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
                onUploadImage={handleUploadImageClick}
                selectedCategory={selectedCategory}
              />
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Список категорий</h2>
          </div>
          <div className="p-4">
            {isLoadingTree ? (
              <div className="space-y-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {flatCategories.map((category) => {
                  const level = (category.parent_id ? 1 : 0);
                  return (
                    <div
                      key={category.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <div
                            className="text-sm font-medium"
                            style={{ marginLeft: `${level * 20}px` }}
                          >
                            {category.name}
                          </div>
                          {!category.is_active && (
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                              Неактивна
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          Код: {category.code} | ID: {category.id}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditClick(category)}
                          className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                        >
                          Редактировать
                        </button>
                        <button
                          onClick={() => handleDeleteClick(category.id)}
                          className="px-3 py-1 border border-red-300 text-red-600 rounded-md text-sm hover:bg-red-50"
                        >
                          Удалить
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Создание новой категории</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <CategoryForm
                parentCategories={flatCategories}
                onSubmit={handleCreateCategory}
                onClose={() => setShowCreateModal(false)}
                isLoading={createCategoryMutation.isPending}
                mode="create"
              />
            </div>
          </div>
        </div>
      )}

      {}
      {showEditModal && selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Редактирование категории</h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedCategory(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <CategoryForm
                category={selectedCategory}
                parentCategories={flatCategories.filter(
                  (cat) => cat.id !== selectedCategory.id
                )}
                onSubmit={handleEditCategory}
                onClose={() => {
                  setShowEditModal(false);
                  setSelectedCategory(null);
                }}
                isLoading={updateCategoryMutation.isPending}
                mode="edit"
              />
            </div>
          </div>
        </div>
      )}

      {}
      {showImageUploadModal && categoryForImageUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-bold">Загрузка изображения</h2>
                  <p className="text-sm text-gray-500">Категория: {categoryForImageUpload.name}</p>
                </div>
                <button
                  onClick={() => {
                    setShowImageUploadModal(false);
                    setCategoryForImageUpload(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <ImageUploadModal
                categoryId={categoryForImageUpload.id}
                categoryName={categoryForImageUpload.name}
                onUpload={handleUploadImage}
                onClose={() => {
                  setShowImageUploadModal(false);
                  setCategoryForImageUpload(null);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <h2 className="text-xl font-bold">Подтверждение удаления</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Вы уверены, что хотите удалить эту категорию? Это действие нельзя отменить.
                {categoryToDelete && (
                  <p className="mt-2 font-medium">
                    Категория ID: {categoryToDelete}
                  </p>
                )}
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowDeleteDialog(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Отмена
                </button>
                <button
                  onClick={handleDeleteCategory}
                  disabled={deleteCategoryMutation.isPending}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleteCategoryMutation.isPending ? "Удаление..." : "Удалить"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Статистика</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl font-bold">{flatCategories.length}</div>
            <div className="text-sm text-gray-500">Всего категорий</div>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {flatCategories.filter((cat) => cat.is_active).length}
            </div>
            <div className="text-sm text-gray-500">Активных категорий</div>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl font-bold">
              {flatCategories.filter((cat) => cat.children && cat.children.length > 0)
                .length}
            </div>
            <div className="text-sm text-gray-500">Категорий с подкатегориями</div>
          </div>
        </div>
      </div>
    </div>
  );
}