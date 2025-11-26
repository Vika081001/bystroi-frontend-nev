import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import React from "react";

import { Product } from "@/shared/types";
import { Button } from "@/shared/ui/kit/button";

type ProductCardProps = Pick<
  Product,
  "id" | "name" | "price" | "category_name" | "images"
>;

export const ProductCard = ({
  id,
  name,
  price,
  category_name,
  images,
}: ProductCardProps) => {
  return (
    <a
      href="/product"
      className="relative overflow-hidden h-72 rounded-lg border border-gray-100 shadow-sm hover:ring-2 ring-gray-200 flex items-end"
    >
      <div className="absolute inset-0">
        {images && (
          <Image
            src={images[0]}
            className="w-full h-full object-cover"
            objectFit="cover"
            alt={name}
            priority={false}
            fill={true}
          />
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="flex flex-col gap-3 p-3 relative z-10 mt-auto flex-1">
        <div>
          <p className="tracking-tight font-medium leading-4 text-white">
            {name}
          </p>
          <span className="text-gray-300 text-sm block">{category_name}</span>
          <b className="font-medium text-white">${price}</b>
        </div>
        <Button className="w-full" variant="outline">
          <ShoppingCart width={16} height={16} />В корзину
        </Button>
      </div>
    </a>
  );
};
