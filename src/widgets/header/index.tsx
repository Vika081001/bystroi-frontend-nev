"use client";

import { PopoverContent } from "@radix-ui/react-popover";
import { Bell, Search, Star, User } from "lucide-react";
import Link from "next/link";
import React from "react";

import { LoginPopup } from "@/feature/auth";
import { CartPopup } from "@/feature/cart";
import { CategoryMenu } from "@/feature/category";
import { ChangeLocationModal } from "@/feature/change-location";
import { MobileSheet } from "@/feature/navigation/ui";
import { SearchSuggestions } from "@/feature/search-suggestions";

import { Button } from "@/shared/ui/kit/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/shared/ui/kit/input-group";
import { Popover, PopoverTrigger } from "@/shared/ui/kit/popover";

export const Header = () => {
  const searchRef = React.useRef<HTMLInputElement | null>(null);

  return (
    <header className="relative z-10 border-b border-gray-100">
      <div className="bg-gray-100">
        <div className="container">
          <div className="flex justify-between items-center py-1">
            <div className="flex gap-4">
              <ChangeLocationModal />
              <Button
                variant="link"
                className="text-sm font-normal p-0 h-auto tracking-tight text-gray-600"
              >
                About us
              </Button>
            </div>
            <div className="flex gap-4">
              <Button
                variant="link"
                className="text-sm font-normal p-0 h-auto tracking-tight text-gray-600"
              >
                Отзывы
              </Button>
              <Button
                variant="link"
                className="text-sm font-normal p-0 h-auto tracking-tight text-gray-600"
              >
                Вход в систему
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="flex gap-2 lg:gap-12 py-2 items-center justify-between">
          <Link
            href="/"
            className="flex gap-2 tracking-tight text-blue-600 text-2xl font-medium"
          >
            название
          </Link>
          <div className=" max-w-2xl w-full flex-1 items-center gap-2 hidden md:flex">
            <CategoryMenu />
            <Popover>
              <PopoverTrigger asChild>
                <InputGroup className="bg-gray-100">
                  <InputGroupInput
                    ref={searchRef}
                    placeholder="Ищите товары здесь..."
                  />
                  <InputGroupAddon>
                    <Search />
                  </InputGroupAddon>
                </InputGroup>
              </PopoverTrigger>
              <PopoverContent sideOffset={8}>
                <SearchSuggestions />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Button size="icon" variant="ghost" className="md:hidden">
              <Search width={20} height={20} />
            </Button>
            <Link href="/rating" className="hidden md:flex">
              <Button size="icon" variant="ghost">
                <Star width={20} height={20} />
              </Button>
            </Link>
            <CartPopup />
            <Button size="icon" variant="ghost" className="hidden md:flex">
              <Bell width={20} height={20} />
            </Button>
            <LoginPopup
              trigger={
                <Button size="icon" variant="ghost">
                  <User width={20} height={20} />
                </Button>
              }
            />
            <MobileSheet />
          </div>
        </div>
      </div>
    </header>
  );
};
