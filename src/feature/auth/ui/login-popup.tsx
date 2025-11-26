"use client";
import React, { useState } from "react";

import { useAuthStore } from "@/entities/user";

import { Button } from "@/shared/ui/kit/button";
import { Input } from "@/shared/ui/kit/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/kit/popover";

export const LoginPopup: React.FC<{ trigger: React.ReactNode }> = ({
  trigger,
}) => {
  const { isAuthenticated, user, login, logout } = useAuthStore();
  const [phone, setPhone] = useState("");

  const handleLogin = () => {
    login(phone);
  };
  const handleLogout = () => {
    logout();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        align="end"
        className="flex flex-col h-[calc(100dvh_-_85px)] md:h-auto w-screen rounded-none md:w-sm md:rounded-md"
        sideOffset={8}
      >
        {isAuthenticated ? (
          <>
            <div className="flex">
              <div>
                <p className="text-sm font-medium tracking-tight">
                  Вы авторизованы под номером {user?.contragent_phone}
                </p>
                <span className="text-sm/tight pt-1 tracking-tight text-gray-500 block">
                  Вы можете выйти из аккаунта.
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2 pt-4">
              <Button
                className="w-full"
                variant={"destructive"}
                onClick={handleLogout}
              >
                Выход
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex">
              <div>
                <p className="text-sm font-medium tracking-tight">
                  Авторизация
                </p>
                <span className="text-sm/tight pt-1 tracking-tight text-gray-500 block">
                  Введите свой номер телефона ниже.
                </span>
              </div>
            </div>
            <form className="pt-4">
              <div className="flex flex-col gap-4">
                <div className="grid gap-1">
                  <label htmlFor="email" className="text-sm">
                    Телефон
                  </label>
                  <Input
                    id="phone"
                    type="number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+7"
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 pt-4">
                <Button className="bg-blue-600 w-full" onClick={handleLogin}>
                  Вход
                </Button>
              </div>
            </form>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
};
