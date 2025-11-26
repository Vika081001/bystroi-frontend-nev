import React from "react";
import { isMobile } from "react-device-detect";

import ProductOrder from "./Order";
import ProductViewed from "./Viewed";
import ProductInfo from "./info";
import ProductReviews from "./reviews";
import ProductСharacteristics from "./Сharacteristics";

const Product = () => {
  return (
    <div className="container">
      <div className="flex gap-8 flex-col xl:flex-row">
        <div className="flex flex-col">
          <ProductInfo />

          {isMobile && <ProductOrder />}
          <ProductСharacteristics />
          <ProductReviews />
        </div>
        {!isMobile && <ProductOrder />}
      </div>

      <ProductViewed />
    </div>
  );
};

export default Product;
