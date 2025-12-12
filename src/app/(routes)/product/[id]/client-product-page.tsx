// app/product/[id]/client-product-page.tsx
"use client";

import React, { useEffect } from 'react';
import { AddToCart } from "@/feature/add-to-cart";
import { useProductViewHistory } from '@/shared/hooks/use-product-view-history';

interface ClientProductPageProps {
  product: any;
  addToCartProps: {
    productId: number;
    unitName: string;
    initialPrice: number;
    initialName: string;
    initialImages: string[];
    quantity?: number
  };
}

export function ClientProductPage({ product, addToCartProps }: ClientProductPageProps) {
  const { addToViewHistory } = useProductViewHistory();

  useEffect(() => {
    if (product) {
      addToViewHistory(product);
    }
  }, [product, addToViewHistory]);

  const addToCartPropsWithQuantity = {
    ...addToCartProps,
    quantity: addToCartProps.quantity || 1,
  };

  return <AddToCart {...addToCartPropsWithQuantity} />;
}