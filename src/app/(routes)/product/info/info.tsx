import { AvatarFallback } from "@radix-ui/react-avatar";
import { Star } from "lucide-react";
import React from "react";

import { ProductImages } from "@/entities/product/ui/product-images";

import { BreadcrumbsDemo } from "@/shared/ui/breadcrumbs";
import { Avatar, AvatarImage } from "@/shared/ui/kit/avatar";
import { Badge } from "@/shared/ui/kit/badge";
import { Button } from "@/shared/ui/kit/button";
import { Separator } from "@/shared/ui/kit/separator";

const ProductInfo = () => {
  return (
    <section>
      <BreadcrumbsDemo />
      <div className="flex gap-8 flex-col lg:flex-row">
        <ProductImages />
        <div className="flex-1">
          <h1 className="text-xl font-medium tracking-tight">
            Apple AirPods Pro (наушнички)
          </h1>
          <div className="flex pt-2 items-center gap-2">
            <div className="flex items-center gap-0.5">
              <Star
                width={16}
                height={16}
                strokeWidth={1}
                fill="gold"
                stroke="gold"
              />
              <Star
                width={16}
                height={16}
                strokeWidth={1}
                fill="gold"
                stroke="gold"
              />
              <Star
                width={16}
                height={16}
                strokeWidth={1}
                fill="gold"
                stroke="gold"
              />
              <Star
                width={16}
                height={16}
                strokeWidth={1}
                fill="gold"
                stroke="gold"
              />
              <Star width={16} height={16} strokeWidth={1} stroke="gold" />
            </div>
            <span className="text-xs text-gray-600">203 отзыва</span>
          </div>
          <Separator className="w-full my-4" />
          <div className="flex flex-col gap-3">
            <div className="flex flex-col text-sm">
              <div className="flex gap-0.5">
                <span className="text-gray-500">Модель: </span>
                <p>3 Pro</p>
              </div>
              <div className="flex mt-2 h-7 gap-2">
                <Badge
                  variant="outline"
                  className="border-blue-500 bg-blue-50 text-blue-500"
                >
                  3 Pro Max
                </Badge>
                <Badge variant="outline">3 Pro</Badge>
              </div>
            </div>
            <div className="flex flex-col text-sm">
              <div className="flex gap-0.5">
                <span className="text-gray-500">Модель: </span>
                <p>3 Pro</p>
              </div>
              <div className="flex mt-2 h-7 gap-2">
                <Badge
                  variant="outline"
                  className="border-blue-500 bg-blue-50 text-blue-500"
                >
                  3 Pro Max
                </Badge>
                <Badge variant="outline">3 Pro</Badge>
              </div>
            </div>
            <div className="flex flex-col text-sm">
              <div className="flex gap-0.5">
                <span className="text-gray-500">Цвет: </span>
                <p>Silver</p>
              </div>
              <div className="flex mt-2 h-7 gap-2">
                <span className="block w-7 h-7 rounded-full bg-gray-300 ring-1 border-1 border-white ring-blue-600" />
                <span className="block w-7 h-7 rounded-full bg-amber-300" />
                <span className="block w-7 h-7 rounded-full bg-black" />
                <span className="block w-7 h-7 rounded-full bg-white border border-black" />
              </div>
            </div>
          </div>
          <Separator className="w-full my-4" />
          <p className="text-sm text-gray-500">Продавец</p>
          <div className="flex items-center gap-2 pt-2">
            <Avatar className="size-10">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">Ozon</p>
              <div className="flex items-center gap-0.5">
                <Star
                  width={12}
                  height={12}
                  strokeWidth={1}
                  fill="gold"
                  stroke="gold"
                />
                <Star
                  width={12}
                  height={12}
                  strokeWidth={1}
                  fill="gold"
                  stroke="gold"
                />
                <Star
                  width={12}
                  height={12}
                  strokeWidth={1}
                  fill="gold"
                  stroke="gold"
                />
                <Star
                  width={12}
                  height={12}
                  strokeWidth={1}
                  fill="gold"
                  stroke="gold"
                />
                <Star width={12} height={12} strokeWidth={1} stroke="gold" />
              </div>
            </div>
          </div>
          <Separator className="w-full my-4" />
          <div className="h-16 overflow-hidden relative ">
            <p className="text-sm tracking-tight h-12 overflow-hidden">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia
              atque dignissimos temporibus? Culpa ut quia, eaque voluptates
              fugiat odio consequuntur iure tempora illum doloremque error
              necessitatibus modi! Illo, dolores voluptates?
            </p>
            <Button
              variant="link"
              className="p-0 text-blue-600 absolute -bottom-2 z-10"
            >
              Развернуть
            </Button>
            <div className="absolute bottom-4 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductInfo;
