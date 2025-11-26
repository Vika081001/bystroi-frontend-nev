"use client";
import { LockIcon } from "lucide-react";
import { MinusIcon, PlusIcon } from "lucide-react";
import React from "react";

import { Button } from "@/shared/ui/kit/button";
import { ButtonGroup } from "@/shared/ui/kit/button-group";
import { Checkbox } from "@/shared/ui/kit/checkbox";
import { Input } from "@/shared/ui/kit/input";
import { InputGroup, InputGroupInput } from "@/shared/ui/kit/input-group";
import { Label } from "@/shared/ui/kit/label";
import { Separator } from "@/shared/ui/kit/separator";
import { Textarea } from "@/shared/ui/kit/textarea";

const Payment = () => {
  const [isChecked, setIsChecked] = React.useState(false);
  const [count, setCount] = React.useState(1);

  return (
    <div className="py-4 md:py-8">
      <div className="container">
        <div className="w-full max-w-5xl mx-auto">
          <h1 className="text-xl font-medium tracking-tight pb-4">Оплата</h1>
          <div className="flex flex-col-reverse gap-8 lg:grid grid-cols-7">
            <form action="" className="col-span-3">
              <Button className="w-full">
                <svg
                  viewBox="0 0 50 20"
                  fill="currentColor"
                  className="!w-auto"
                >
                  <path d="M9.536 2.579c-.571.675-1.485 1.208-2.4 1.132-.113-.914.334-1.884.858-2.484C8.565.533 9.564.038 10.374 0c.095.951-.276 1.884-.838 2.579zm.829 1.313c-1.324-.077-2.457.751-3.085.751-.638 0-1.6-.713-2.647-.694-1.362.019-2.628.79-3.323 2.017-1.429 2.455-.372 6.09 1.009 8.087.676.99 1.485 2.075 2.552 2.036 1.009-.038 1.409-.656 2.628-.656 1.228 0 1.58.656 2.647.637 1.104-.019 1.8-.99 2.475-1.979.771-1.122 1.086-2.217 1.105-2.274-.02-.019-2.133-.828-2.152-3.263-.02-2.036 1.666-3.007 1.742-3.064-.952-1.408-2.437-1.56-2.951-1.598zm7.645-2.76v14.834h2.305v-5.072h3.19c2.913 0 4.96-1.998 4.96-4.89 0-2.893-2.01-4.872-4.885-4.872h-5.57zm2.305 1.941h2.656c2 0 3.142 1.066 3.142 2.94 0 1.875-1.142 2.95-3.151 2.95h-2.647v-5.89zM32.673 16.08c1.448 0 2.79-.733 3.4-1.893h.047v1.779h2.133V8.582c0-2.14-1.714-3.52-4.351-3.52-2.447 0-4.256 1.399-4.323 3.32h2.076c.171-.913 1.018-1.512 2.18-1.512 1.41 0 2.2.656 2.2 1.865v.818l-2.876.171c-2.675.162-4.123 1.256-4.123 3.159 0 1.922 1.495 3.197 3.637 3.197zm.62-1.76c-1.229 0-2.01-.59-2.01-1.494 0-.933.752-1.475 2.19-1.56l2.562-.162v.837c0 1.39-1.181 2.379-2.743 2.379zM41.1 20c2.247 0 3.304-.856 4.227-3.454l4.047-11.341h-2.342l-2.714 8.763h-.047l-2.714-8.763h-2.409l3.904 10.799-.21.656c-.352 1.114-.923 1.542-1.942 1.542-.18 0-.533-.02-.676-.038v1.779c.133.038.705.057.876.057z"></path>
                </svg>
              </Button>
              <div className="flex items-center gap-2 py-4">
                <Separator className="flex-1" />
                <span className="text-gray-500 text-sm">или</span>
                <Separator className="flex-1" />
              </div>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="name">Имя</Label>
                  <Input id="name" type="text" required placeholder="Коля" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="number">Номер телефона</Label>
                  <Input
                    id="number"
                    type="number"
                    required
                    placeholder="+32 000 000 000"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="delivery">Адрес доставки</Label>
                  <Input
                    id="delivery"
                    type="text"
                    required
                    placeholder="улица пушкина дом калатушкина"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="delivery">Примечание</Label>
                  <Textarea
                    id="delivery"
                    required
                    rows={10}
                    placeholder="всякие нюансы"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={isChecked}
                    onCheckedChange={(checked) => {
                      setIsChecked(!!checked);
                    }}
                  />
                  <Label htmlFor="terms">
                    Заказ оформляется для другого человека
                  </Label>
                </div>
                {isChecked && (
                  <React.Fragment>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="name">Имя получателя</Label>
                      <Input
                        id="name"
                        type="text"
                        required
                        placeholder="Коля"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="number">Номер телефона получателя</Label>
                      <Input
                        id="number"
                        type="number"
                        required
                        placeholder="+32 000 000 000"
                      />
                    </div>
                  </React.Fragment>
                )}
                <Button className="bg-blue-600">Оплатить 3000$</Button>
                <div className="flex justify-center items-center text-gray-500 gap-1">
                  <LockIcon width={16} height={16} />

                  <span className="text-sm text-center">
                    Платежные данные хранятся в виде обычного текста
                  </span>
                </div>
              </div>
            </form>
            <div className="flex flex-col gap-2 col-span-4">
              <div className="flex gap-2">
                <div className="rounded-md border border-gray-100 w-24 h-24 p-2">
                  <img className="w-full h-full" src="/airpods.png" />
                </div>
                <div className="py-1 flex-1">
                  <div className="flex justify-between items-center">
                    <p className="text-sm tracking-tight font-medium">
                      AirPods Pro Max
                    </p>
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
                          onChange={(e) =>
                            setCount(Number(e.target.value) || 1)
                          }
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
              <Separator className="my-4" />
              <div className="flex gap-2">
                <div className="rounded-md border border-gray-100 w-24 h-24 p-2">
                  <img className="w-full h-full" src="/airpods.png" />
                </div>
                <div className="py-1 flex-1">
                  <div className="flex justify-between items-center">
                    <p className="text-sm tracking-tight font-medium">
                      AirPods Pro Max
                    </p>
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
                          onChange={(e) =>
                            setCount(Number(e.target.value) || 1)
                          }
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
