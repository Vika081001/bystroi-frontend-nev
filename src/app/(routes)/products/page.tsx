import { SlidersHorizontal } from "lucide-react";
import React from "react";

import { Filter } from "@/widgets/filter";
import ProductsList from "@/widgets/product-list";

import { BreadcrumbsDemo } from "@/shared/ui/breadcrumbs";
import { Button } from "@/shared/ui/kit/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/kit/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/kit/select";

const Products = () => {
  return (
    <div className="py-2 pb-12">
      <div className="container">
        <BreadcrumbsDemo isProduct={false} />
        <div className="flex flex-col gap-2 md:flex-row md:justify-between">
          <h1 className="text-lg font-medium tracking-tight">Наушники (322)</h1>
          <div className="flex gap-2">
            <Select value="today">
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="today">Популярное</SelectItem>
                  <SelectItem value="yesterday">Новинки</SelectItem>
                  <SelectItem value="week">Дорогие</SelectItem>
                  <SelectItem value="month">Дешевые</SelectItem>
                  <SelectItem value="year">Интересные</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Dialog>
              <DialogTrigger asChild className="md:hidden">
                <Button variant="outline" className="font-normal">
                  <SlidersHorizontal />
                  Фильтр
                </Button>
              </DialogTrigger>
              <DialogContent className="p-0">
                <DialogTitle></DialogTitle>
                <Filter />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="flex pt-4 gap-8 relative">
          <div className="hidden md:block">
            <Filter />
          </div>
          <ProductsList />
        </div>
      </div>
    </div>
  );
};

export default Products;
