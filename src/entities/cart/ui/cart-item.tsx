"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/shared/ui/kit/button";
import { ButtonGroup } from "@/shared/ui/kit/button-group";
import { InputGroup, InputGroupInput } from "@/shared/ui/kit/input-group";

export const CartItem = () => {
  const [count, setCount] = useState(1);

  return (
    <div className="flex gap-2">
      <div className="rounded-md border border-gray-100 w-24 h-24 p-2">
        <img className="w-full h-full" src="/airpods.png" />
      </div>
      <div className="py-1 flex-1">
        <div className="flex justify-between items-center">
          <p className="text-sm tracking-tight font-medium">AirPods Pro Max</p>
          <span className="font-medium">100$</span>
        </div>
        <span className="text-sm text-gray-600">Apple</span>
        <div className="flex justify-between items-center gap-2 pt-2">
          <ButtonGroup aria-label="count" className="h-fit">
            <Button
              variant="outline"
              size="icon-sm"
              disabled={count < 2}
              onClick={() => setCount((prev) => prev - 1)}
            >
              <MinusIcon />
            </Button>
            <InputGroup className="w-10 h-8">
              <InputGroupInput
                type="number"
                value={count}
                onChange={(e) => setCount(Number(e.target.value) || 1)}
                className="px-1 text-center"
              />
            </InputGroup>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setCount((prev) => prev + 1)}
            >
              <PlusIcon />
            </Button>
          </ButtonGroup>
          <div className="flex justify-end">
            <Button variant="link" className="text-blue-600 px-0">
              Удалить
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
