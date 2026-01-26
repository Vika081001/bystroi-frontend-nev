// entities/cart/ui/cart-popup.tsx
"use client";

import { CartItem } from "@/entities/cart/";
import { useCart } from "@/entities/cart/model/hooks";
import { useCartItems } from "@/entities/cart/model/hooks";
import { PopoverClose } from "@radix-ui/react-popover";
import { ShoppingCart, X } from "lucide-react";
import React from "react";
import { isMobile } from "react-device-detect";

import { Button } from "@/shared/ui/kit/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/kit/popover";
import { Separator } from "@/shared/ui/kit/separator";

export const CartPopup = () => {
  const { data: cart, isLoading: isCartLoading, error: cartError } = useCart();
  const { 
    items, 
    isLoading: areItemsLoading, 
    hasError, 
    totalItems, 
    totalPrice 
  } = useCartItems(cart?.goods || []);

  const isLoading = isCartLoading || areItemsLoading;
  const itemCount = items?.length || 0;

  return (
     <Popover modal={isMobile}>
      <PopoverTrigger asChild>
        <Button size="icon" variant="ghost" className="relative cursor-pointer">
          <ShoppingCart width={20} height={20} />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {itemCount > 99 ? '9+' : itemCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="flex flex-col h-[calc(100dvh_-_85px)] md:h-auto w-screen rounded-none md:w-lg md:rounded-md overflow-hidden"
        sideOffset={8}
      >
        <div className="flex items-center justify-between pb-4 border-b flex-shrink-0">
          <p className="tracking-tight font-medium text-lg">Корзина</p>
          <PopoverClose asChild>
            <Button variant="outline" size="icon" className="text-gray-500">
              <X width={16} height={16} />
            </Button>
          </PopoverClose>
        </div>
        
         <div 
          className="flex-1 pt-4 min-h-0 overflow-y-auto"
        >
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-2">
                  <div className="rounded-md border border-gray-100 w-24 h-24 p-2 bg-gray-100 animate-pulse" />
                  <div className="py-1 flex-1 space-y-2">
                    <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
                    <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
                    <div className="flex justify-between pt-2">
                      <div className="h-8 bg-gray-100 rounded animate-pulse w-32" />
                      <div className="h-8 bg-gray-100 rounded animate-pulse w-16" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : cartError ? (
            <div className="text-center py-4 text-red-500">
              Ошибка загрузки корзины
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              Корзина пуста
            </div>
          ) : (
            <>
              {items.map((item, index) => (
                 <React.Fragment key={`cart-item-${item.nomenclature_id}-${item.warehouse_id || 0}`}>
                  <CartItem item={item} />
                  {index < items.length - 1 && <Separator className="my-4" />}
                </React.Fragment>
              ))}
            </>
          )}
        </div>
        <div className="mt-auto pt-4 border-t flex-shrink-0">
          <div>
            <div className="flex items-center justify-between">
              <p className="tracking-tight font-medium">Всего</p>
              <span className="tracking-tight font-medium">{totalPrice.toLocaleString("ru-RU")}₽</span>
            </div>
            <p className="text-sm/tight text-gray-500 tracking-tight pt-2">
              Стоимость доставки и налоги рассчитываются <br />
              при оформлении заказа.
            </p>
          </div>
          <div className="pt-2">
            <a href="/payment">
              <Button 
                size="lg" 
                className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer"
                disabled={isLoading || hasError}
              >
                Перейти к оформлению
              </Button>
            </a>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};