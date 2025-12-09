"use client"

import React, { useState, useMemo } from "react";
import { X, Save, Plus } from "lucide-react";
import { Category, CreateCategoryDto, UpdateCategoryDto } from "@/shared/types/category";

interface CategoryFormProps {
  category?: Category | null;
  parentCategories: Category[];
  onSubmit: (data: CreateCategoryDto | UpdateCategoryDto) => void;
  onClose: () => void;
  isLoading: boolean;
  mode: "create" | "edit";
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  parentCategories,
  onSubmit,
  onClose,
  isLoading,
  mode,
}) => {

  const initialFormData = useMemo(() => {
    if (category && mode === "edit") {
      return {
        name: category.name,
        description: category.description,
        code: category.code,
        parent_id: category.parent_id,
        external_id: category.external_id,
        image_url: category.image_url,
        is_active: category.is_active,
      };
    } else {
      return {
        name: "",
        description: "",
        code: 0,
        parent_id: null,
        external_id: null,
        image_url: null,
        is_active: true,
      };
    }
  }, [category, mode]);

  const [formData, setFormData] = useState<CreateCategoryDto>(initialFormData);

  React.useEffect(() => {
    setFormData(initialFormData);
  }, [initialFormData]);

  const handleChange = (field: keyof CreateCategoryDto, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const generateCode = () => {
    const code = Math.floor(Math.random() * 10000) + 1;
    handleChange("code", code);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Название *
          </label>
          <input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Введите название категории"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="code" className="block text-sm font-medium text-gray-700">
            Код
          </label>
          <div className="flex gap-2">
            <input
              id="code"
              type="number"
              value={formData.code}
              onChange={(e) => handleChange("code", parseInt(e.target.value) || 0)}
              placeholder="Уникальный код категории"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="button"
              onClick={generateCode}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
            >
              <Plus className="h-4 w-4 inline mr-1" />
              Сгенерировать
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Описание
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Введите описание категории"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="parent_id" className="block text-sm font-medium text-gray-700">
            Родительская категория
          </label>
          <select
            id="parent_id"
            value={formData.parent_id?.toString() || "null"}
            onChange={(e) =>
              handleChange("parent_id", e.target.value === "null" ? null : parseInt(e.target.value))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="null">Без родительской категории</option>
            {parentCategories.map((cat) => (
              <option key={cat.id} value={cat.id.toString()}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="external_id" className="block text-sm font-medium text-gray-700">
            Внешний ID
          </label>
          <input
            id="external_id"
            value={formData.external_id || ""}
            onChange={(e) => handleChange("external_id", e.target.value || null)}
            placeholder="Внешний идентификатор"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">
          URL изображения
        </label>
        <input
          id="image_url"
          value={formData.image_url || ""}
          onChange={(e) => handleChange("image_url", e.target.value || null)}
          placeholder="https://example.com/image.jpg"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="is_active"
          checked={formData.is_active}
          onChange={(e) => handleChange("is_active", e.target.checked)}
          className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
        />
        <label htmlFor="is_active" className="text-sm text-gray-700">
          Активная категория
        </label>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Отмена
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="h-4 w-4 inline mr-2" />
          {isLoading
            ? "Сохранение..."
            : mode === "create"
            ? "Создать"
            : "Сохранить"}
        </button>
      </div>
    </form>
  );
};