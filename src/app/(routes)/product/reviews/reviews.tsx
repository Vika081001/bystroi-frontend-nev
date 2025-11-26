import { Star, ThumbsDown, ThumbsUp } from "lucide-react";
import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/kit/avatar";
import { Badge } from "@/shared/ui/kit/badge";
import { Button } from "@/shared/ui/kit/button";
import { Progress } from "@/shared/ui/kit/progress";
import { Separator } from "@/shared/ui/kit/separator";

const ProductReviews = () => {
  return (
    <section className="pt-8 mt-8 border-t border-gray-200">
      <h2 className="font-medium text-lg tracking-tight">Блок отзывов</h2>
      <div className="flex pt-8 gap-8 flex-col lg:flex-row">
        <div className="h-fit md:max-w-xs w-full border border-gray-200 rounded-lg p-4">
          <div className="flex gap-4">
            <div>
              <p className="text-6xl">4.9</p>
              <div className="flex items-center gap-0.5 pt-2">
                <Star
                  width={16}
                  height={16}
                  strokeWidth={1}
                  fill="gold"
                  stroke="gold"
                />
                <Star
                  width={16}
                  height={16}
                  strokeWidth={1}
                  fill="gold"
                  stroke="gold"
                />
                <Star
                  width={16}
                  height={16}
                  strokeWidth={1}
                  fill="gold"
                  stroke="gold"
                />
                <Star
                  width={16}
                  height={16}
                  strokeWidth={1}
                  fill="gold"
                  stroke="gold"
                />
                <Star
                  width={16}
                  height={16}
                  strokeWidth={1}
                  fill="gold"
                  stroke="gold"
                />
              </div>
              <span className="text-xs text-gray-500">233 отзыва</span>
            </div>
            <div className="flex flex-col gap-0.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm block w-3 text-center">5</span>
                <Progress value={95} className="w-full h-1.5" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm block w-3 text-center">4</span>
                <Progress value={12} className="w-full  h-1.5" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm block w-3 text-center">3</span>
                <Progress value={0} className="w-full  h-1.5" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm block w-3 text-center">2</span>
                <Progress value={0} className="w-full  h-1.5" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm block w-3 text-center">1</span>
                <Progress value={0} className="w-full  h-1.5" />
              </div>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Качество</p>
              <div className="flex items-center gap-1">
                <div className="flex items-center gap-0.5">
                  <Star
                    width={16}
                    height={16}
                    strokeWidth={1}
                    fill="gold"
                    stroke="gold"
                  />
                  <Star
                    width={16}
                    height={16}
                    strokeWidth={1}
                    fill="gold"
                    stroke="gold"
                  />
                  <Star
                    width={16}
                    height={16}
                    strokeWidth={1}
                    fill="gold"
                    stroke="gold"
                  />
                  <Star
                    width={16}
                    height={16}
                    strokeWidth={1}
                    fill="gold"
                    stroke="gold"
                  />
                  <Star
                    width={16}
                    height={16}
                    strokeWidth={1}
                    fill="gold"
                    stroke="gold"
                  />
                </div>
                <span className="text-sm">5.0</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Цена</p>
              <div className="flex items-center gap-1">
                <div className="flex items-center gap-0.5">
                  <Star
                    width={16}
                    height={16}
                    strokeWidth={1}
                    fill="gold"
                    stroke="gold"
                  />
                  <Star
                    width={16}
                    height={16}
                    strokeWidth={1}
                    fill="gold"
                    stroke="gold"
                  />
                  <Star
                    width={16}
                    height={16}
                    strokeWidth={1}
                    fill="gold"
                    stroke="gold"
                  />
                  <Star
                    width={16}
                    height={16}
                    strokeWidth={1}
                    fill="gold"
                    stroke="gold"
                  />
                  <Star
                    width={16}
                    height={16}
                    strokeWidth={1}
                    fill="gold"
                    stroke="gold"
                  />
                </div>
                <span className="text-sm">5.0</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Доставка</p>
              <div className="flex items-center gap-1">
                <div className="flex items-center gap-0.5">
                  <Star
                    width={16}
                    height={16}
                    strokeWidth={1}
                    fill="gold"
                    stroke="gold"
                  />
                  <Star
                    width={16}
                    height={16}
                    strokeWidth={1}
                    fill="gold"
                    stroke="gold"
                  />
                  <Star
                    width={16}
                    height={16}
                    strokeWidth={1}
                    fill="gold"
                    stroke="gold"
                  />
                  <Star
                    width={16}
                    height={16}
                    strokeWidth={1}
                    fill="gold"
                    stroke="gold"
                  />
                  <Star
                    width={16}
                    height={16}
                    strokeWidth={1}
                    fill="gold"
                    stroke="gold"
                  />
                </div>
                <span className="text-sm">5.0</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Прочее</p>
              <div className="flex items-center gap-1">
                <div className="flex items-center gap-0.5">
                  <Star
                    width={16}
                    height={16}
                    strokeWidth={1}
                    fill="gold"
                    stroke="gold"
                  />
                  <Star
                    width={16}
                    height={16}
                    strokeWidth={1}
                    fill="gold"
                    stroke="gold"
                  />
                  <Star
                    width={16}
                    height={16}
                    strokeWidth={1}
                    fill="gold"
                    stroke="gold"
                  />
                  <Star
                    width={16}
                    height={16}
                    strokeWidth={1}
                    fill="gold"
                    stroke="gold"
                  />
                  <Star
                    width={16}
                    height={16}
                    strokeWidth={1}
                    fill="gold"
                    stroke="gold"
                  />
                </div>
                <span className="text-sm">5.0</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex gap-2 flex-wrap">
            <Badge
              variant="outline"
              className="h-7 border-blue-600 bg-blue-50 text-blue-600"
            >
              Новые
            </Badge>
            <Badge variant="outline" className="h-7">
              Старые
            </Badge>
            <Badge variant="outline" className="h-7">
              <Star width={16} height={16} fill="gold" stroke="gold" />
              <span>1</span>
            </Badge>
            <Badge variant="outline" className="h-7">
              <Star width={16} height={16} fill="gold" stroke="gold" />
              <span>2</span>
            </Badge>
            <Badge variant="outline" className="h-7">
              <Star width={16} height={16} fill="gold" stroke="gold" />
              <span>3</span>
            </Badge>
            <Badge variant="outline" className="h-7">
              <Star width={16} height={16} fill="gold" stroke="gold" />
              <span>4</span>
            </Badge>
            <Badge variant="outline" className="h-7">
              <Star width={16} height={16} fill="gold" stroke="gold" />
              <span>5</span>
            </Badge>
          </div>
          <div className="pt-8">
            <p className="font-medium tracking-tight">Фотографии</p>
            <div className="pt-4 grid grid-cols-5 gap-2 md:gap-4">
              <div className="aspect-square rounded-sm overflow-hidden">
                <img
                  src="https://picsum.photos/800/600"
                  className="object-cover w-full h-full"
                  alt="img"
                />
              </div>
              <div className="aspect-square rounded-sm overflow-hidden">
                <img
                  src="https://picsum.photos/800/600"
                  className="object-cover w-full h-full"
                  alt="img"
                />
              </div>
              <div className="aspect-square rounded-sm overflow-hidden">
                <img
                  src="https://picsum.photos/800/600"
                  className="object-cover w-full h-full"
                  alt="img"
                />
              </div>
              <div className="aspect-square rounded-sm overflow-hidden">
                <img
                  src="https://picsum.photos/800/600"
                  className="object-cover w-full h-full"
                  alt="img"
                />
              </div>
              <div className="aspect-square rounded-sm overflow-hidden">
                <img
                  src="https://picsum.photos/800/600"
                  className="object-cover w-full h-full"
                  alt="img"
                />
              </div>
            </div>
          </div>
          <div className="pt-8">
            <p className="font-medium tracking-tight">Отзывы</p>
            <ul className="flex flex-col gap-4 pt-6">
              <li>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        alt="@shadcn"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-medium">Костя</p>
                  </div>
                  <p className="text-sm text-gray-500">19 час. назад</p>
                </div>
                <div className="flex items-center gap-0.5 pt-2">
                  <Star
                    width={16}
                    height={16}
                    strokeWidth={1}
                    fill="gold"
                    stroke="gold"
                  />
                  <Star
                    width={16}
                    height={16}
                    strokeWidth={1}
                    fill="gold"
                    stroke="gold"
                  />
                  <Star
                    width={16}
                    height={16}
                    strokeWidth={1}
                    fill="gold"
                    stroke="gold"
                  />
                  <Star
                    width={16}
                    height={16}
                    strokeWidth={1}
                    fill="gold"
                    stroke="gold"
                  />
                  <Star
                    width={16}
                    height={16}
                    strokeWidth={1}
                    fill="gold"
                    stroke="gold"
                  />
                </div>
                <div className="pt-1">
                  <p className="font-medium tracking-tight">
                    Отличный звук, отличный день!
                  </p>
                  <span className="text-sm text-gray-500">
                    AirPods 3 Pro Max Ultra
                  </span>
                  <p className="text-sm">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quam quasi reprehenderit quisquam eum recusandae, vero amet
                    velit neque, explicabo exercitationem quas autem at suscipit
                    ipsam culpa ratione iure, eius pariatur.
                  </p>
                </div>
                <div className="pt-4 flex gap-2 items-center flex-wrap">
                  <Button variant="outline" size="sm" className="text-blue-600">
                    <ThumbsUp width={16} height={16} />
                    <span className="text-sm">23 Понравилось</span>
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600">
                    <ThumbsDown width={16} height={16} />
                    <span className="text-sm">5 Не понравилось</span>
                  </Button>
                </div>
              </li>
              <li className="py-2">
                <Separator />
              </li>
              <li>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        alt="@shadcn"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-medium">Костя</p>
                  </div>
                  <p className="text-sm text-gray-500">19 час. назад</p>
                </div>
                <div className="flex items-center gap-0.5 pt-2">
                  <Star
                    width={16}
                    height={16}
                    strokeWidth={1}
                    fill="gold"
                    stroke="gold"
                  />
                  <Star
                    width={16}
                    height={16}
                    strokeWidth={1}
                    fill="gold"
                    stroke="gold"
                  />
                  <Star
                    width={16}
                    height={16}
                    strokeWidth={1}
                    fill="gold"
                    stroke="gold"
                  />
                  <Star
                    width={16}
                    height={16}
                    strokeWidth={1}
                    fill="gold"
                    stroke="gold"
                  />
                  <Star
                    width={16}
                    height={16}
                    strokeWidth={1}
                    fill="gold"
                    stroke="gold"
                  />
                </div>
                <div className="pt-1">
                  <p className="font-medium tracking-tight">
                    Отличный звук, отличный день!
                  </p>
                  <span className="text-sm text-gray-500">
                    AirPods 3 Pro Max Ultra
                  </span>
                  <p className="text-sm">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quam quasi reprehenderit quisquam eum recusandae, vero amet
                    velit neque, explicabo exercitationem quas autem at suscipit
                    ipsam culpa ratione iure, eius pariatur.
                  </p>
                </div>
                <div className="pt-4 flex gap-2 items-center flex-wrap">
                  <Button variant="outline" size="sm" className="text-blue-600">
                    <ThumbsUp width={16} height={16} />
                    <span className="text-sm">23 Понравилось</span>
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600">
                    <ThumbsDown width={16} height={16} />
                    <span className="text-sm">5 Не понравилось</span>
                  </Button>
                </div>
              </li>
              <li className="py-2">
                <Separator />
              </li>
              <li>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        alt="@shadcn"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-medium">Костя</p>
                  </div>
                  <p className="text-sm text-gray-500">19 час. назад</p>
                </div>
                <div className="flex items-center gap-0.5 pt-2">
                  <Star
                    width={16}
                    height={16}
                    strokeWidth={1}
                    fill="gold"
                    stroke="gold"
                  />
                  <Star
                    width={16}
                    height={16}
                    strokeWidth={1}
                    fill="gold"
                    stroke="gold"
                  />
                  <Star
                    width={16}
                    height={16}
                    strokeWidth={1}
                    fill="gold"
                    stroke="gold"
                  />
                  <Star
                    width={16}
                    height={16}
                    strokeWidth={1}
                    fill="gold"
                    stroke="gold"
                  />
                  <Star
                    width={16}
                    height={16}
                    strokeWidth={1}
                    fill="gold"
                    stroke="gold"
                  />
                </div>
                <div className="pt-1">
                  <p className="font-medium tracking-tight">
                    Отличный звук, отличный день!
                  </p>
                  <span className="text-sm text-gray-500">
                    AirPods 3 Pro Max Ultra
                  </span>
                  <p className="text-sm">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quam quasi reprehenderit quisquam eum recusandae, vero amet
                    velit neque, explicabo exercitationem quas autem at suscipit
                    ipsam culpa ratione iure, eius pariatur.
                  </p>
                  <div className="pt-4 grid grid-cols-6 gap-4">
                    <div className="aspect-square rounded-sm overflow-hidden">
                      <img
                        src="https://picsum.photos/800/600"
                        className="object-cover w-full h-full"
                        alt="img"
                      />
                    </div>
                    <div className="aspect-square rounded-sm overflow-hidden">
                      <img
                        src="https://picsum.photos/800/600"
                        className="object-cover w-full h-full"
                        alt="img"
                      />
                    </div>
                  </div>
                </div>
                <div className="pt-4 flex gap-2 items-center flex-wrap">
                  <Button variant="outline" size="sm">
                    <ThumbsUp
                      width={16}
                      height={16}
                      className="text-blue-600"
                    />
                    <span className="text-sm">23 Понравилось</span>
                  </Button>
                  <Button variant="outline" size="sm">
                    <ThumbsDown
                      width={16}
                      height={16}
                      className="text-red-600"
                    />
                    <span className="text-sm">5 Не понравилось</span>
                  </Button>
                </div>
              </li>
              <li className="pt-2">
                <Button
                  variant="link"
                  className="p-0 text-blue-600 cursor-pointer"
                >
                  Все отзывы
                </Button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductReviews;
