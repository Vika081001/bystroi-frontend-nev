import { Grip, Menu } from "lucide-react";
import Link from "next/link";
import React from "react";

import { Button } from "@/shared/ui/kit/button";
import { Separator } from "@/shared/ui/kit/separator";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui/kit/sheet";

export const MobileSheet = () => {
  return (
    <Sheet>
      <SheetTrigger asChild className="flex md:hidden">
        <Button variant="ghost" size="icon">
          <Menu width={20} height={20} />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="racking-tight text-blue-600 text-2xl font-medium">
            название
          </SheetTitle>
        </SheetHeader>
        <ul className="flex flex-col gap-4 px-4">
          <li className="w-full">
            <Button size="lg" variant="outline" className="w-full">
              <Grip width={16} height={16} />
              Каталог
            </Button>
          </li>
          <li>
            <Separator />
          </li>
          <li>
            <Link href="/" className="text-lg tracking-tight font-medium">
              Категории
            </Link>
          </li>
          <li>
            <Separator />
          </li>
          <li>
            <Link href="/" className="text-lg tracking-tight font-medium">
              Контакты
            </Link>
          </li>
          <li>
            <Separator />
          </li>
          <li>
            <Link href="/" className="text-lg tracking-tight font-medium">
              Популярное
            </Link>
          </li>
          <li>
            <Separator />
          </li>
          <li>
            <Link href="/" className="text-lg tracking-tight font-medium">
              Недавно просмотренные
            </Link>
          </li>
          <li>
            <Separator />
          </li>
          <li>
            <Link href="/rating" className="text-lg tracking-tight font-medium">
              Рейтинг
            </Link>
          </li>
        </ul>
        <SheetFooter>
          {/* <HeaderUser trigger={<Button type="submit">Вход в кабинет</Button>} /> */}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
