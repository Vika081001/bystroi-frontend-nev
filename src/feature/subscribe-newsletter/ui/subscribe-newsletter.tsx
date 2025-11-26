import { Calendar, Hand } from "lucide-react";
import React from "react";

import { Button } from "@/shared/ui/kit/button";
import { Input } from "@/shared/ui/kit/input";

const SubscribeNewsletter = () => {
  return (
    <section className="pt-8">
      <div className="container">
        <div className="relative isolate overflow-hidden bg-gray-100 rounded-lg py-6 md:py-8">
          <div className="px-4 md:px-8">
            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-8 lg:max-w-none lg:grid-cols-2">
              <div className="max-w-xl lg:max-w-lg">
                <h2 className="text-xl font-semibold tracking-tight">
                  Подпишитесь на нашу рассылку
                </h2>
                <p className="pt-1 text-sm text-gray-600">
                  Nostrud amet eu ullamco nisi aute in ad minim nostrud
                  adipisicing velit quis. Duis tempor incididunt dolore.
                </p>
                <div className="pt-4 flex max-w-md gap-x-4">
                  <label htmlFor="email-address" className="sr-only">
                    Email address
                  </label>
                  <Input
                    id="email-address"
                    type="email"
                    name="email"
                    required
                    placeholder="Введите ваш емейл..."
                    autoComplete="email"
                    className="bg-gray-200 text-sm"
                  />
                  <Button className="bg-blue-600">Подписаться</Button>
                </div>
              </div>
              <dl className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:pt-2">
                <div className="flex flex-col items-start">
                  <Button size="icon" variant="outline">
                    <Calendar width={20} height={20} />
                  </Button>
                  <dt className="pt-4 text-base font-medium">
                    Еженедельные статьи
                  </dt>
                  <dd className="pt-2 text-sm text-gray-500">
                    Non laboris consequat cupidatat laborum magna. Eiusmod non
                    irure cupidatat duis commodo amet.
                  </dd>
                </div>
                <div className="flex flex-col items-start">
                  <Button size="icon" variant="outline">
                    <Hand width={20} height={20} />
                  </Button>
                  <dt className="pt-4 text-base font-medium">Не спам</dt>
                  <dd className="pt-2 text-sm text-gray-500">
                    Non laboris consequat cupidatat laborum magna. Eiusmod non
                    irure cupidatat duis commodo amet.
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          <div
            aria-hidden="true"
            className="absolute top-0 left-1/2 -z-10 -translate-x-1/2 blur-3xl xl:-top-6"
          ></div>
        </div>
      </div>
    </section>
  );
};

export default SubscribeNewsletter;
