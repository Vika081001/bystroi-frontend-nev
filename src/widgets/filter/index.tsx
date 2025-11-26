import { Star } from "lucide-react";
import React from "react";

import { Button } from "@/shared/ui/kit/button";
import { Checkbox } from "@/shared/ui/kit/checkbox";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/shared/ui/kit/input-group";
import { Separator } from "@/shared/ui/kit/separator";
import { Slider } from "@/shared/ui/kit/slider";

export const Filter = () => {
  return (
    <aside className="md:max-w-2xs w-full md:border border-gray-200 rounded-md md:p-4 h-fit">
      <p className="font-medium pb-4 pl-4 md:p-0 leading-4">Фильтр</p>
      <div className="h-[80dvh] overflow-y-auto md:overflow-y-visible px-4 md:p-0 md:h-auto">
        <div className="text-sm flex flex-col gap-4 pt-4">
          <div>
            <p className="font-medium">Рейтинг</p>
            <Slider
              className="pt-3"
              defaultValue={[75, 100]}
              max={100}
              step={25}
            />
            <ul className="flex justify-between pt-3">
              <li className="flex items-center gap-1">
                <Star width={12} height={12} fill="gold" color="gold" />
                <p className="text-xs">1</p>
              </li>
              <li className="flex items-center gap-1">
                <Star width={12} height={12} fill="gold" color="gold" />
                <p className="text-xs">2</p>
              </li>
              <li className="flex items-center gap-1">
                <Star width={12} height={12} fill="gold" color="gold" />
                <p className="text-xs">3</p>
              </li>
              <li className="flex items-center gap-1">
                <Star width={12} height={12} fill="gold" color="gold" />
                <p className="text-xs">4</p>
              </li>
              <li className="flex items-center gap-1">
                <Star width={12} height={12} fill="gold" color="gold" />
                <p className="text-xs">5</p>
              </li>
            </ul>
          </div>
          <Separator />
          <div>
            <p className="font-medium">Цена</p>
            <div className="flex flex-col gap-2 pt-2">
              <InputGroup className="bg-gray-50 ">
                <InputGroupAddon>От</InputGroupAddon>
                <InputGroupInput className="h-7" defaultValue={6.999} />
              </InputGroup>
              <InputGroup className="bg-gray-50 ">
                <InputGroupAddon>До</InputGroupAddon>
                <InputGroupInput className="h-7" defaultValue={123.999} />
              </InputGroup>
            </div>
          </div>
          <Separator />
          <div>
            <p className="font-medium">Брэнд</p>
            <div className="flex flex-col gap-2 pt-2">
              <label htmlFor="checkbox" className="flex items-center gap-2">
                <Checkbox id="checkbox" defaultChecked />
                Apple
              </label>
              <label htmlFor="checkbox" className="flex items-center gap-2">
                <Checkbox id="checkbox" />
                Samsung
              </label>
              <label htmlFor="checkbox" className="flex items-center gap-2">
                <Checkbox id="checkbox" />
                Xiaomi
              </label>
            </div>
            <button className="text-blue-600 ml-6 mt-2">Развернуть</button>
          </div>
          <Separator />
          <div>
            <p className="font-medium">Название</p>
            <div className="flex flex-col gap-2 pt-2">
              <label htmlFor="checkbox" className="flex items-center gap-2">
                <Checkbox id="checkbox" defaultChecked />
                Чекбокс
              </label>
              <label htmlFor="checkbox" className="flex items-center gap-2">
                <Checkbox id="checkbox" />
                Чекбокс 2
              </label>
              <label htmlFor="checkbox" className="flex items-center gap-2">
                <Checkbox id="checkbox" />
                Чекбокс 3
              </label>
            </div>
            <button className="text-blue-600 ml-6 mt-2">Развернуть</button>
          </div>
          <Separator />
          <div>
            <p className="font-medium">Название</p>
            <div className="flex flex-col gap-2 pt-2">
              <label htmlFor="checkbox" className="flex items-center gap-2">
                <Checkbox id="checkbox" defaultChecked />
                Чекбокс
              </label>
              <label htmlFor="checkbox" className="flex items-center gap-2">
                <Checkbox id="checkbox" />
                Чекбокс 2
              </label>
              <label htmlFor="checkbox" className="flex items-center gap-2">
                <Checkbox id="checkbox" />
                Чекбокс 3
              </label>
            </div>
            <button className="text-blue-600 ml-6 mt-2">Развернуть</button>
          </div>
          <Separator />
          <div>
            <p className="font-medium">Название</p>
            <div className="flex flex-col gap-2 pt-2">
              <label htmlFor="checkbox" className="flex items-center gap-2">
                <Checkbox id="checkbox" defaultChecked />
                Чекбокс
              </label>
              <label htmlFor="checkbox" className="flex items-center gap-2">
                <Checkbox id="checkbox" />
                Чекбокс 2
              </label>
              <label htmlFor="checkbox" className="flex items-center gap-2">
                <Checkbox id="checkbox" />
                Чекбокс 3
              </label>
            </div>
            <button className="text-blue-600 ml-6 mt-2">Развернуть</button>
          </div>
          <Separator />
          <div>
            <p className="font-medium">Название</p>
            <div className="flex flex-col gap-2 pt-2">
              <label htmlFor="checkbox" className="flex items-center gap-2">
                <Checkbox id="checkbox" defaultChecked />
                Чекбокс
              </label>
              <label htmlFor="checkbox" className="flex items-center gap-2">
                <Checkbox id="checkbox" />
                Чекбокс 2
              </label>
              <label htmlFor="checkbox" className="flex items-center gap-2">
                <Checkbox id="checkbox" />
                Чекбокс 3
              </label>
            </div>
            <button className="text-blue-600 ml-6 mt-2">Развернуть</button>
          </div>
        </div>
      </div>
      <div className="p-4 w-full md:hidden">
        <Button className="w-full bg-blue-600">Сохранить</Button>
      </div>
    </aside>
  );
};
