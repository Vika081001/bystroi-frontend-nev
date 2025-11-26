import React from "react";

const ProductViewed = () => {
  return (
    <section className="pt-8 pb-14 mt-8 border-t border-gray-200">
      <h2 className="font-medium text-lg tracking-tight">
        Недавно просмотренные
      </h2>
      <div className="pt-4 grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {/* {Array.from({ length: 7 }, (_, i) => i + 1).map((index) => (
                    <ProductItem key={index} />
                ))} */}
        {/* <ProductsList /> */}
      </div>
    </section>
  );
};

export default ProductViewed;
