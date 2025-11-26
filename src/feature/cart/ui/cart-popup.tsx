import { CartItem } from "@/entities/cart/";
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
  return (
    <Popover modal={isMobile}>
      <PopoverTrigger asChild>
        <Button size="icon" variant="ghost">
          <ShoppingCart width={20} height={20} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="flex flex-col h-[calc(100dvh_-_85px)] md:h-auto w-screen rounded-none md:w-lg md:rounded-md"
        sideOffset={8}
      >
        <div className="flex items-center justify-between">
          <p className="tracking-tight font-medium">Корзина</p>
          <PopoverClose asChild>
            <Button variant="outline" size="icon" className="text-gray-500">
              <X width={16} height={16} />
            </Button>
          </PopoverClose>
        </div>
        <div className="flex flex-col gap-2 pt-4 flex-1">
          <CartItem />
          <Separator className="my-4" />
          <CartItem />
          <Separator className="my-4" />
          <div className="mt-auto md:mt-0">
            <div>
              <div className="flex items-center justify-between">
                <p className="tracking-tight font-medium">Всего</p>
                <span className="tracking-tight font-medium">300$</span>
              </div>
              <p className="text-sm/tight text-gray-500 tracking-tight pt-2">
                Стоимость доставки и налоги рассчитываются <br />
                при оформлении заказа.
              </p>
            </div>
            <div className="pt-2">
              <a href="/payment">
                <Button size="lg" className="w-full bg-blue-600">
                  Оплатить
                </Button>
              </a>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
