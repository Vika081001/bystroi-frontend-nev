// app/product/[id]/page.tsx
import React from "react";
import { isMobile } from "react-device-detect";

import { fetchProductServer } from "@/entities/product";

import { ProductViewed } from "./Viewed/Viewed";
import ProductInfo from "./info";
import ProductReviews from "./reviews";
import ProductСharacteristics from "./Сharacteristics";

import { ClientProductPage } from "./client-product-page";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const productId = parseInt(id);

  const product = await fetchProductServer(id);

  if (!product || !productId) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold text-red-500">Товар не найден</h1>
        <p className="mt-4 text-gray-600">Попробуйте найти другой товар</p>
      </div>
    );
  }

  const addToCartProps = {
    productId,
    unitName: product.unit_name,
    initialPrice: product.price,
    initialName: product.name,
    initialImages: product.images || [],
  };

  return (
    <>
      <div className="container py-8">
        <div className="flex gap-4 flex-col xl:flex-row">
          <div className="flex flex-col flex-1">
            <ProductInfo {...product} />
            {isMobile && <ClientProductPage product={product} addToCartProps={addToCartProps} />}
            <ProductСharacteristics 
              attributes={product.attributes} 
              manufacturer_name={product.manufacturer_name}
              category_name={product.category_name}
              {...product}
            />
            
            <ProductReviews 
              entityType="nomenclature" 
              entityId={productId} 
            />
          </div>
          
          {!isMobile && (
            <div className="xl:w-80 sticky absolute top-24 h-fit">
              <ClientProductPage product={product} addToCartProps={addToCartProps} />
            </div>
          )}
        </div>
        
        <ProductViewed />
      </div>
    </>
  );
}