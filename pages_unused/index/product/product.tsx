import { CloudHail } from "lucide-react";
import React from "react";

const BestProduct = () => {
  return (
    <section id="product" className="py-24">
      <div className="container">
        <div>
          <p className="text-gray-500 uppercase text-center font-medium tracking-tight">
            Лучший продукт
          </p>
          <h2 className="text-3xl uppercase font-semibold text-center py-2 tracking-tight">
            Напиши тут лучший товар
          </h2>
          <span className="text-sm text-gray-600 tracking-tight text-center block">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Beatae
            quos <br /> ipsum iusto, quo atque consequuntur ullam.
          </span>
        </div>
        <div className="pt-8 flex">
          <div className="flex flex-col gap-4 w-full max-w-2xs">
            <div className="h-2xs rounded-2xl p-8 border-gray-200 border-solid border">
              <div className="flex justify-center pt-4">
                <CloudHail />
              </div>
              <p className="text-xl uppercase font-semibold tracking-tight text-center pt-8 leading-6">
                РАНДОМНЫЙ ТЕКСТ
              </p>
              <span className="text-sm pt-2 text-center text-gray-600 tracking-tight leading-4 block">
                Lorem ipsum dolor adipisicing sit <br /> consectetur adipisicing
                elit.
              </span>
            </div>
            <div className="h-2xs rounded-2xl p-8 border-gray-200 border-solid border">
              <div className="flex justify-center pt-4">
                <CloudHail />
              </div>
              <p className="text-xl uppercase font-semibold tracking-tight text-center pt-8 leading-6">
                РАНДОМНЫЙ ТЕКСТ
              </p>
              <span className="text-sm pt-2 text-center text-gray-600 tracking-tight leading-4 block">
                Lorem ipsum dolor adipisicing sit <br /> consectetur adipisicing
                elit.
              </span>
            </div>
          </div>
          <div className="flex flex-1 justify-center">
            <img src="/giphy.gif" />
          </div>
          <div className="flex flex-col gap-4 w-full max-w-2xs">
            <div className="h-2xs rounded-2xl p-8 border-gray-200 border-solid border">
              <div className="flex justify-center pt-4">
                <CloudHail />
              </div>
              <p className="text-xl uppercase font-semibold tracking-tight text-center pt-8 leading-6">
                РАНДОМНЫЙ ТЕКСТ
              </p>
              <span className="text-sm pt-2 text-center text-gray-600 tracking-tight leading-4 block">
                Lorem ipsum dolor adipisicing sit <br /> consectetur adipisicing
                elit.
              </span>
            </div>
            <div className="h-2xs rounded-2xl p-8 border-gray-200 border-solid border">
              <div className="flex justify-center pt-4">
                <CloudHail />
              </div>
              <p className="text-xl uppercase font-semibold tracking-tight text-center pt-8 leading-6">
                РАНДОМНЫЙ ТЕКСТ
              </p>
              <span className="text-sm pt-2 text-center text-gray-600 tracking-tight leading-4 block">
                Lorem ipsum dolor adipisicing sit <br /> consectetur adipisicing
                elit.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BestProduct;
