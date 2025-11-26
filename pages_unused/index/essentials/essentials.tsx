import React from "react";

import { Button } from "@/shared/ui/kit/button";

const Essentials = () => {
  return (
    <section className="py-24">
      <div className="container">
        <div>
          <p className="text-gray-500 uppercase font-medium tracking-tight">
            Аксессуары
          </p>
          <h2 className="text-3xl uppercase font-semibold py-2 tracking-tight">
            Аксессуары - это всякие ништячки
          </h2>
          <div className="flex justify-between items-end">
            <span className="text-sm text-gray-600 tracking-tight block">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Beatae
              quos <br /> ipsum iusto, quo atque consequuntur ullam.
            </span>
            <Button variant="outline" className="tracking-tight">
              show more
            </Button>
          </div>
        </div>
        <div className="pt-8 grid grid-cols-4 gap-6">
          <div className="rounded-lg cursor-pointer hover:ring-12 ring-gray-200 hover:bg-gray-200">
            <div className="rounded-xl overflow-hidden">
              <img
                className="object-cover h-full w-full pointer-events-none"
                src="https://placehold.co/400x400?text=image 1"
                alt="Placeholder"
              />
            </div>
            <p className="text-black uppercase tracking-tight pt-3 font-semibold text-lg">
              Название 1 товара
            </p>
            <span className="block">$100</span>
          </div>
          <div className="rounded-lg cursor-pointer hover:ring-12 ring-gray-200 hover:bg-gray-200">
            <div className="rounded-xl overflow-hidden">
              <img
                className="object-cover h-full w-full pointer-events-none"
                src="https://placehold.co/400x400?text=image 2"
                alt="Placeholder"
              />
            </div>
            <p className="text-black uppercase tracking-tight pt-3 font-semibold text-lg">
              Название 2 товара
            </p>
            <span className="block">$200</span>
          </div>
          <div className="rounded-lg cursor-pointer hover:ring-12 ring-gray-200 hover:bg-gray-200">
            <div className="rounded-xl overflow-hidden">
              <img
                className="object-cover h-full w-full pointer-events-none"
                src="https://placehold.co/400x400?text=image 3"
                alt="Placeholder"
              />
            </div>
            <p className="text-black uppercase tracking-tight pt-3 font-semibold text-lg">
              Название 3 товара
            </p>
            <span className="block">$300</span>
          </div>
          <div className="rounded-lg cursor-pointer hover:ring-12 ring-gray-200 hover:bg-gray-200">
            <div className="rounded-xl overflow-hidden">
              <img
                className="object-cover h-full w-full pointer-events-none"
                src="https://placehold.co/400x400?text=image 4"
                alt="Placeholder"
              />
            </div>
            <p className="text-black uppercase tracking-tight pt-3 font-semibold text-lg">
              Название 4 товара
            </p>
            <span className="block">$400</span>
          </div>
          <div className="rounded-lg cursor-pointer hover:ring-12 ring-gray-200 hover:bg-gray-200">
            <div className="rounded-xl overflow-hidden">
              <img
                className="object-cover h-full w-full pointer-events-none"
                src="https://placehold.co/400x400?text=image 1"
                alt="Placeholder"
              />
            </div>
            <p className="text-black uppercase tracking-tight pt-3 font-semibold text-lg">
              Название 1 товара
            </p>
            <span className="block">$100</span>
          </div>
          <div className="rounded-lg cursor-pointer hover:ring-12 ring-gray-200 hover:bg-gray-200">
            <div className="rounded-xl overflow-hidden">
              <img
                className="object-cover h-full w-full pointer-events-none"
                src="https://placehold.co/400x400?text=image 2"
                alt="Placeholder"
              />
            </div>
            <p className="text-black uppercase tracking-tight pt-3 font-semibold text-lg">
              Название 2 товара
            </p>
            <span className="block">$200</span>
          </div>
          <div className="rounded-lg cursor-pointer hover:ring-12 ring-gray-200 hover:bg-gray-200">
            <div className="rounded-xl overflow-hidden">
              <img
                className="object-cover h-full w-full pointer-events-none"
                src="https://placehold.co/400x400?text=image 3"
                alt="Placeholder"
              />
            </div>
            <p className="text-black uppercase tracking-tight pt-3 font-semibold text-lg">
              Название 3 товара
            </p>
            <span className="block">$300</span>
          </div>
          <div className="rounded-lg cursor-pointer hover:ring-12 ring-gray-200 hover:bg-gray-200">
            <div className="rounded-xl overflow-hidden">
              <img
                className="object-cover h-full w-full pointer-events-none"
                src="https://placehold.co/400x400?text=image 4"
                alt="Placeholder"
              />
            </div>
            <p className="text-black uppercase tracking-tight pt-3 font-semibold text-lg">
              Название 4 товара
            </p>
            <span className="block">$400</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Essentials;
