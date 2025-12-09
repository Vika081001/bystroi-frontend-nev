// app/product/[id]/Сharacteristics.tsx - ОБНОВЛЕННЫЙ ФАЙЛ
import React from "react";

import { Product } from "@/entities/product";

type ProductСharacteristicsProps = Pick<Product, 'attributes' | 'manufacturer_name' | 'category_name'>;

const ProductСharacteristics = ({ 
  attributes = [], 
  manufacturer_name,
  category_name 
}: ProductСharacteristicsProps) => {
  
  if (!attributes || attributes.length === 0) {
    return null;
  }

  const half = Math.ceil(attributes.length / 2);
  const firstColumn = attributes.slice(0, half);

  const secondColumn = attributes.slice(half);
  const baseCharacteristics = [
    { name: "Бренд", value: manufacturer_name || "Не указан" },
    { name: "Категория", value: category_name || "Не указана" },
  ];

  return (
    <section className="pt-8 mt-8 border-t border-gray-200">
      <div>
        <h2 className="text-lg font-medium tracking-tight">Характеристики</h2>
        <div className="flex text-sm pt-8 flex-col md:flex-row gap-4 md:gap-12">
          <div className="flex flex-col gap-4 w-full">
            {baseCharacteristics.map((char, index) => (
              <div className="flex" key={`base-${index}`}>
                <div className="max-w-36 w-full shrink-0">
                  <p className="text-gray-500">{char.name}</p>
                </div>
                <div>
                  <span>{char.value}</span>
                </div>
              </div>
            ))}
          
            {firstColumn.map((attr, index) => (
              <div className="flex" key={index}>
                <div className="max-w-36 w-full shrink-0">
                  <p className="text-gray-500">{attr.name}</p>
                </div>
                <div>
                  <span>{attr.value}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col gap-4 w-full">
            {secondColumn.map((attr, index) => (
              <div className="flex" key={index + firstColumn.length}>
                <div className="max-w-36 w-full shrink-0">
                  <p className="text-gray-500">{attr.name}</p>
                </div>
                <div>
                  <span>{attr.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductСharacteristics;