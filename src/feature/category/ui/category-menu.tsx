import { GripIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

import { Button } from "@/shared/ui/kit/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/kit/popover";

export const CategoryMenu = () => {
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
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="text-gray-700">
          <GripIcon width={16} height={16} />
          каталог
        </Button>
      </PopoverTrigger>
      <PopoverContent sideOffset={8} className="w-screen rounded-none p-0 py-4">
        <div className="flex">
          <div className="container">
            <div className="grid grid-cols-3 gap-8">
              <Link
                href="/products"
                className="relative group flex h-24 items-end p-4 rounded-lg overflow-hidden hover:ring-2 hover:ring-gray-200"
              >
                <div className="flex justify-center absolute inset-0 brightness-75 group-hover:brightness-50">
                  <img
                    src="https://picsum.photos/800/600"
                    className="w-full object-cover"
                    alt="airpods"
                  />
                </div>
                <p className="leading-4 pt-3 text-xl font-medium tracking-tight relative text-white">
                  Популярное
                </p>
              </Link>
              <Link
                href="/products"
                className="relative group flex h-24 items-end p-4 rounded-lg overflow-hidden hover:ring-2 hover:ring-gray-200"
              >
                <div className="flex justify-center absolute inset-0 brightness-75 group-hover:brightness-50">
                  <img
                    src="https://picsum.photos/800/600"
                    className="w-full object-cover"
                    alt="airpods"
                  />
                </div>
                <p className="leading-4 pt-3 text-xl font-medium tracking-tight relative text-white">
                  Популярное
                </p>
              </Link>
              <Link
                href="/products"
                className="relative group flex h-24 items-end p-4 rounded-lg overflow-hidden hover:ring-2 hover:ring-gray-200"
              >
                <div className="flex justify-center absolute inset-0 brightness-75 group-hover:brightness-50">
                  <img
                    src="https://picsum.photos/800/600"
                    className="w-full object-cover"
                    alt="airpods"
                  />
                </div>
                <p className="leading-4 pt-3 text-xl font-medium tracking-tight relative text-white">
                  Популярное
                </p>
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="flex gap-4">
                <Link
                  href="/products"
                  className="relative group flex h-56 w-42 items-end p-4 rounded-lg overflow-hidden hover:ring-2 hover:ring-gray-200"
                >
                  <div className="flex justify-center absolute inset-0 brightness-75 group-hover:brightness-50">
                    <img
                      src="https://picsum.photos/800/600"
                      className="w-full object-cover"
                      alt="airpods"
                    />
                  </div>
                  <p className="leading-4 pt-3 text-xl font-medium tracking-tight relative text-white">
                    Популярное
                  </p>
                </Link>
                <div className="flex flex-col gap-2">
                  <Link href="/" className="font-medium text-lg tracking-tight">
                    {categories[0]}
                  </Link>
                  <div className="flex flex-col gap-1">
                    <Link
                      href="/"
                      className="text-sm tracking-tight text-gray-500"
                    >
                      Подкатегория
                    </Link>
                    <Link
                      href="/"
                      className="text-sm tracking-tight text-gray-500"
                    >
                      Подкатегория
                    </Link>
                    <Link
                      href="/"
                      className="text-sm tracking-tight text-gray-500"
                    >
                      Подкатегория
                    </Link>
                  </div>
                  <Link href="/" className="font-medium text-lg tracking-tight">
                    {categories[1]}
                  </Link>
                  <div className="flex flex-col gap-1">
                    <Link
                      href="/"
                      className="text-sm tracking-tight text-gray-500"
                    >
                      Подкатегория
                    </Link>
                    <Link
                      href="/"
                      className="text-sm tracking-tight text-gray-500"
                    >
                      Подкатегория
                    </Link>
                    <Link
                      href="/"
                      className="text-sm tracking-tight text-gray-500"
                    >
                      Подкатегория
                    </Link>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Link href="/" className="font-medium text-lg tracking-tight">
                    {categories[2]}
                  </Link>
                  <div className="flex flex-col gap-1">
                    <Link
                      href="/"
                      className="text-sm tracking-tight text-gray-500"
                    >
                      Подкатегория
                    </Link>
                    <Link
                      href="/"
                      className="text-sm tracking-tight text-gray-500"
                    >
                      Подкатегория
                    </Link>
                    <Link
                      href="/"
                      className="text-sm tracking-tight text-gray-500"
                    >
                      Подкатегория
                    </Link>
                  </div>
                  <Link href="/" className="font-medium text-lg tracking-tight">
                    {categories[3]}
                  </Link>
                  <div className="flex flex-col gap-1">
                    <Link
                      href="/"
                      className="text-sm tracking-tight text-gray-500"
                    >
                      Подкатегория
                    </Link>
                    <Link
                      href="/"
                      className="text-sm tracking-tight text-gray-500"
                    >
                      Подкатегория
                    </Link>
                    <Link
                      href="/"
                      className="text-sm tracking-tight text-gray-500"
                    >
                      Подкатегория
                    </Link>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <Link
                  href="/products"
                  className="relative group flex h-56 w-42 items-end p-4 rounded-lg overflow-hidden hover:ring-2 hover:ring-gray-200"
                >
                  <div className="flex justify-center absolute inset-0 brightness-75 group-hover:brightness-50">
                    <img
                      src="https://picsum.photos/800/600"
                      className="w-full object-cover"
                      alt="airpods"
                    />
                  </div>
                  <p className="leading-4 pt-3 text-xl font-medium tracking-tight relative text-white">
                    Популярное
                  </p>
                </Link>
                <div className="flex flex-col gap-2">
                  <Link href="/" className="font-medium text-lg tracking-tight">
                    {categories[0]}
                  </Link>
                  <div className="flex flex-col gap-1">
                    <Link
                      href="/"
                      className="text-sm tracking-tight text-gray-500"
                    >
                      Подкатегория
                    </Link>
                    <Link
                      href="/"
                      className="text-sm tracking-tight text-gray-500"
                    >
                      Подкатегория
                    </Link>
                    <Link
                      href="/"
                      className="text-sm tracking-tight text-gray-500"
                    >
                      Подкатегория
                    </Link>
                  </div>
                  <Link href="/" className="font-medium text-lg tracking-tight">
                    {categories[1]}
                  </Link>
                  <div className="flex flex-col gap-1">
                    <Link
                      href="/"
                      className="text-sm tracking-tight text-gray-500"
                    >
                      Подкатегория
                    </Link>
                    <Link
                      href="/"
                      className="text-sm tracking-tight text-gray-500"
                    >
                      Подкатегория
                    </Link>
                    <Link
                      href="/"
                      className="text-sm tracking-tight text-gray-500"
                    >
                      Подкатегория
                    </Link>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Link href="/" className="font-medium text-lg tracking-tight">
                    {categories[2]}
                  </Link>
                  <div className="flex flex-col gap-1">
                    <Link
                      href="/"
                      className="text-sm tracking-tight text-gray-500"
                    >
                      Подкатегория
                    </Link>
                    <Link
                      href="/"
                      className="text-sm tracking-tight text-gray-500"
                    >
                      Подкатегория
                    </Link>
                    <Link
                      href="/"
                      className="text-sm tracking-tight text-gray-500"
                    >
                      Подкатегория
                    </Link>
                  </div>
                  <Link href="/" className="font-medium text-lg tracking-tight">
                    {categories[3]}
                  </Link>
                  <div className="flex flex-col gap-1">
                    <Link
                      href="/"
                      className="text-sm tracking-tight text-gray-500"
                    >
                      Подкатегория
                    </Link>
                    <Link
                      href="/"
                      className="text-sm tracking-tight text-gray-500"
                    >
                      Подкатегория
                    </Link>
                    <Link
                      href="/"
                      className="text-sm tracking-tight text-gray-500"
                    >
                      Подкатегория
                    </Link>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <Link
                  href="/products"
                  className="relative group flex h-56 w-42 items-end p-4 rounded-lg overflow-hidden hover:ring-2 hover:ring-gray-200"
                >
                  <div className="flex justify-center absolute inset-0 brightness-75 group-hover:brightness-50">
                    <img
                      src="https://picsum.photos/800/600"
                      className="w-full object-cover"
                      alt="airpods"
                    />
                  </div>
                  <p className="leading-4 pt-3 text-xl font-medium tracking-tight relative text-white">
                    Популярное
                  </p>
                </Link>
                <div className="flex flex-col gap-2">
                  <Link href="/" className="font-medium text-lg tracking-tight">
                    {categories[0]}
                  </Link>
                  <div className="flex flex-col gap-1">
                    <Link
                      href="/"
                      className="text-sm tracking-tight text-gray-500"
                    >
                      Подкатегория
                    </Link>
                    <Link
                      href="/"
                      className="text-sm tracking-tight text-gray-500"
                    >
                      Подкатегория
                    </Link>
                    <Link
                      href="/"
                      className="text-sm tracking-tight text-gray-500"
                    >
                      Подкатегория
                    </Link>
                  </div>
                  <Link href="/" className="font-medium text-lg tracking-tight">
                    {categories[1]}
                  </Link>
                  <div className="flex flex-col gap-1">
                    <Link
                      href="/"
                      className="text-sm tracking-tight text-gray-500"
                    >
                      Подкатегория
                    </Link>
                    <Link
                      href="/"
                      className="text-sm tracking-tight text-gray-500"
                    >
                      Подкатегория
                    </Link>
                    <Link
                      href="/"
                      className="text-sm tracking-tight text-gray-500"
                    >
                      Подкатегория
                    </Link>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Link href="/" className="font-medium text-lg tracking-tight">
                    {categories[2]}
                  </Link>
                  <div className="flex flex-col gap-1">
                    <Link
                      href="/"
                      className="text-sm tracking-tight text-gray-500"
                    >
                      Подкатегория
                    </Link>
                    <Link
                      href="/"
                      className="text-sm tracking-tight text-gray-500"
                    >
                      Подкатегория
                    </Link>
                    <Link
                      href="/"
                      className="text-sm tracking-tight text-gray-500"
                    >
                      Подкатегория
                    </Link>
                  </div>
                  <Link href="/" className="font-medium text-lg tracking-tight">
                    {categories[3]}
                  </Link>
                  <div className="flex flex-col gap-1">
                    <Link
                      href="/"
                      className="text-sm tracking-tight text-gray-500"
                    >
                      Подкатегория
                    </Link>
                    <Link
                      href="/"
                      className="text-sm tracking-tight text-gray-500"
                    >
                      Подкатегория
                    </Link>
                    <Link
                      href="/"
                      className="text-sm tracking-tight text-gray-500"
                    >
                      Подкатегория
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
