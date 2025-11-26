"use client";

import { ProductCard } from "@/entities/product";

import { useProducts } from "@/shared/hooks/useProducts";

const ProductsList = () => {
  const { data, isLoading, isError } = useProducts();

  return (
    <div className="flex flex-col max-w-full">
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {data?.result.map((product, index) => (
          <ProductCard {...product} key={index} />
        ))}
      </div>
    </div>
  );
};

export default ProductsList;
