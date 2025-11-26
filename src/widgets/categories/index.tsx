"use cache";

import { ArrowRight } from "lucide-react";
import React from "react";

import { Button } from "@/shared/ui/kit/button";

const Categories = async () => {
  const softGradients = [
    "linear-gradient(135deg, #f9d8d6 0%, #f8e1e7 100%)", // розово-персиковый
    "linear-gradient(135deg, #dcecfb 0%, #f5e9ff 100%)", // голубо-сиреневый
    "linear-gradient(135deg, #fff5d7 0%, #ffdada 100%)", // кремово-розовый
    "linear-gradient(135deg, #e8f9e9 0%, #d8f3ff 100%)", // мятно-голубой
    "linear-gradient(135deg, #e3fdfd 0%, #ffe6fa 100%)", // небесный с розовым
    "linear-gradient(135deg, #f6f3ff 0%, #e4f0ff 100%)", // бело-лиловый
    "linear-gradient(135deg, #fff0f5 0%, #fef6e4 100%)", // молочно-пудровый
    "linear-gradient(135deg, #f8d3ff 0%, #d6e4ff 100%)", // лавандово-голубой
  ];

  const categories = [
    "Одежда",
    "Обувь",
    "Аксессуары",
    "Электроника",
    "Смартфоны",
    "Бытовая техника",
    "Компьютеры и ноутбуки",
    "Дом и интерьер",
    "Мебель",
  ];

  return (
    <section className="pt-8">
      <div className="container">
        <div className="flex items-center justify-between">
          <h2 className="font-medium text-lg tracking-tight">
            Популярные категории
          </h2>
          <Button variant="outline">
            Все категории
            <ArrowRight width={16} height={16} />
          </Button>
        </div>
        <div className="pt-4 grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7">
          {Array.from({ length: 7 }, (_, i) => i + 1).map((index) => {
            const gradient = softGradients[index % softGradients.length];

            return (
              <a
                href="/products"
                style={{ background: gradient }}
                className="relative group flex h-56 items-end p-4 rounded-lg overflow-hidden hover:ring-2 hover:ring-gray-200"
                key={index}
              >
                <div className="flex justify-center absolute inset-0 brightness-75 group-hover:brightness-50">
                  <img
                    src="https://picsum.photos/800/600"
                    className="w-full object-cover"
                    alt="airpods"
                  />
                </div>
                <p className="leading-4 pt-3 text-xl font-medium tracking-tight relative text-white">
                  {categories[index]}
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
