// import { ProductsList } from '@/widgets/product'
import { ArrowRight, ShoppingCart } from "lucide-react";
import React from "react";

import { Button } from "@/shared/ui/kit/button";

const Recommendation = () => {
  return (
    <section className="pt-8">
      <div className="container">
        <div className="flex items-center justify-between">
          <h2 className="font-medium text-lg tracking-tight">
            Рекомендации по основным вашим просмотрам
          </h2>
          <Button variant="outline" className="hidden md:flex">
            Все рекомендации
            <ArrowRight width={16} height={16} />
          </Button>
        </div>
        <div className="pt-4 grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {/* {Array.from({ length: 14 }, (_, i) => i + 1).map((index) => (
                        <ProductItem key={index} />
                    ))} */}
          {/* <ProductsList /> */}
        </div>
        <div className="pt-4 block md:hidden">
          <Button variant="outline">
            Все рекомендации
            <ArrowRight width={16} height={16} />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Recommendation;
