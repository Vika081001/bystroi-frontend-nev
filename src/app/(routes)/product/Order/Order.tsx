import { Heart, Minus, Plus, Share2 } from "lucide-react";
import React from "react";

import { Button } from "@/shared/ui/kit/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/shared/ui/kit/input-group";
import { Separator } from "@/shared/ui/kit/separator";

const ProductOrder = () => {
  return (
    <div className="xl:max-w-[280px] mx-auto max-w-lg w-full border border-gray-200 rounded-lg p-4 h-fit md:mt-12">
      <p className="font-medium tracking-tight">Оформить заказ</p>
      <div className="flex pt-4 justify-between items-center gap-2">
        <div>
          <p className="text-sm text-gray-500 inline-block">Количество:</p>{" "}
          <span className="text-sm">1</span>
        </div>
        <div className="max-w-32">
          <InputGroup>
            <InputGroupInput
              defaultValue={1}
              className="text-center border border-gray-200"
            />
            <InputGroupAddon className="pr-3">
              <Minus />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end" className="pl-3">
              <Plus className="text-blue-500" />
            </InputGroupAddon>
          </InputGroup>
        </div>
      </div>
      <Separator className="my-4" />
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">Всего:</p>
        <span className="text-lg font-medium">13.000 $</span>
      </div>
      <div className="pt-4 flex flex-col gap-2">
        <Button className="bg-blue-500 text-white w-full">
          <Plus /> В корзину
        </Button>
        <Button className="text-blue-500 w-full" variant="outline">
          Дополнительная кнопка
        </Button>
      </div>
      <div className="flex pt-4 justify-between">
        <button className="text-sm text-gray-600 flex items-center gap-1 ">
          <Heart width={16} height={16} className="fill-gray-600" />В Избранное
        </button>
        <button className="text-sm text-gray-600 flex items-center gap-1 ">
          <Share2 width={16} height={16} className="fill-gray-600" />
          Поделиться
        </button>
      </div>
    </div>
  );
};

export default ProductOrder;
