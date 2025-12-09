// entities/cart/model/hooks.ts
"use client"
import { useMutation, useQuery, useQueryClient, useQueries } from "@tanstack/react-query";

import * as cartApi from "../api";
import { AddToCartDto, RemoveFromCartDto } from "./types";
import { useContragentPhone } from "@/shared/hooks/useContragentPhone";
import { fetchProduct } from "@/entities/product/api";
import { Product } from "@/entities/product/model/types";
import { OrderGood, Cart } from "./types";

export const cartKeys = {
  root: ["cart"] as const,
  cartWithPhone: (phone: string) => [...cartKeys.root, phone] as const,
};

export const useCart = () => {
  const contragentPhone = useContragentPhone();
  
  return useQuery({
    queryKey: cartKeys.cartWithPhone(contragentPhone),
    queryFn: () => cartApi.fetchCart(contragentPhone),
    enabled: !!contragentPhone,
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const contragentPhone = useContragentPhone();

  return useMutation({
    mutationFn: (good: Omit<AddToCartDto['good'], 'is_from_cart'>) => 
      cartApi.addToCart({
        contragent_phone: contragentPhone,
        good: {
          ...good,
          quantity: good.quantity || 1,
          is_from_cart: true,
        },
      }),
    onMutate: async (variables) => {
      const queryKey = cartKeys.cartWithPhone(contragentPhone);
      const previousCart = queryClient.getQueryData<Cart>(queryKey);
      return { previousCart, variables };
    },
    onSuccess: (updatedCart, variables, context) => {
      const queryKey = cartKeys.cartWithPhone(contragentPhone);
      queryClient.setQueryData(queryKey, updatedCart);

      const { previousCart } = context;
      const warehouseId = variables.warehouse_id ?? null;
      const prevGood = previousCart?.goods.find(
        g => g.nomenclature_id === variables.nomenclature_id && (g.warehouse_id ?? null) === warehouseId
      );
      const newGood = updatedCart.goods.find(
        g => g.nomenclature_id === variables.nomenclature_id && (g.warehouse_id ?? null) === warehouseId
      );
      
      
      if (typeof window !== 'undefined') {
        const itemKey = `${variables.nomenclature_id}-${variables.warehouse_id ?? 'null'}`;
        const timestamps: Record<string, number> = JSON.parse(localStorage.getItem('cartItemTimestamps') || '{}');

        if (!prevGood && newGood) {
          timestamps[itemKey] = Date.now();
        } else if (prevGood && !newGood) {
          delete timestamps[itemKey];
        }
        localStorage.setItem('cartItemTimestamps', JSON.stringify(timestamps));
      }
    },
    onError: (error, variables, context) => {
      if (context?.previousCart) {
        const queryKey = cartKeys.cartWithPhone(contragentPhone);
        queryClient.setQueryData(queryKey, context.previousCart);
      }
      console.error("Ошибка при добавлении в корзину:", error);
    },
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  const contragentPhone = useContragentPhone();

  return useMutation({
    mutationFn: (data: Omit<RemoveFromCartDto, 'contragent_phone'>) => 
      cartApi.removeFromCart({
        contragent_phone: contragentPhone,
        ...data,
      }),
    onMutate: async (variables) => {
      const queryKey = cartKeys.cartWithPhone(contragentPhone);
      const previousCart = queryClient.getQueryData<Cart>(queryKey);
      return { previousCart, variables };
    },
    onSuccess: (undefined, variables) => {
      const queryKey = cartKeys.cartWithPhone(contragentPhone);
      queryClient.invalidateQueries({ queryKey });

      
      if (typeof window !== 'undefined') {
        const itemKey = `${variables.nomenclature_id}-${variables.warehouse_id ?? 'null'}`;
        const timestamps: Record<string, number> = JSON.parse(localStorage.getItem('cartItemTimestamps') || '{}');
        delete timestamps[itemKey];
        localStorage.setItem('cartItemTimestamps', JSON.stringify(timestamps));
      }
    },
    onError: (error, variables, context) => {
      if (context?.previousCart) {
        const queryKey = cartKeys.cartWithPhone(contragentPhone);
        queryClient.setQueryData(queryKey, context.previousCart);
      }
      console.error("Ошибка при удалении из корзины:", error);
    },
  });
};

export const useCartItems = (goods: OrderGood[]) => {
  const uniqueProductIds = Array.from(
    new Set(goods.map(item => item.nomenclature_id))
  );

  const productQueries = useQueries({
    queries: uniqueProductIds.map((productId) => ({
      queryKey: ["product", productId],
      queryFn: () => fetchProduct({ product_id: productId }),
      staleTime: 5 * 60 * 1000,
      enabled: !!productId,
    })),
  });

  let items = goods.map((good) => {
    const productQuery = productQueries.find(
      (query) => query.data?.id === good.nomenclature_id
    );
    
    const product = productQuery?.data;
    
    return {
      nomenclature_id: good.nomenclature_id,
      quantity: good.quantity || 1,
      warehouse_id: good.warehouse_id,
      product: product ? {
        id: product.id,
        name: product.name,
        price: product.price,
        images: product.images || [],
        manufacturer_name: product.manufacturer_name,
        seller_name: product.seller_name,
        category_name: product.category_name,
        unit_name: product.unit_name,
      } : undefined,
      isLoading: productQuery?.isLoading,
      error: productQuery?.error,
    };
  });

  
  if (typeof window !== 'undefined') {
    const timestamps: Record<string, number> = JSON.parse(localStorage.getItem('cartItemTimestamps') || '{}');
    items = items.sort((a, b) => {
      const keyA = `${a.nomenclature_id}-${a.warehouse_id ?? 'null'}`;
      const keyB = `${b.nomenclature_id}-${b.warehouse_id ?? 'null'}`;
      const tsA = timestamps[keyA] || 0;
      const tsB = timestamps[keyB] || 0;
      return tsA - tsB;
    });
  }

  const isLoading = productQueries.some(query => query.isLoading);
  const hasError = productQueries.some(query => query.isError);

  return {
    items,
    isLoading,
    hasError,
    totalItems: goods.reduce((sum, item) => sum + (item.quantity || 1), 0),
    totalPrice: items.reduce((sum, item) => {
      if (item.product) {
        return sum + (item.product.price * item.quantity);
      }
      return sum;
    }, 0),
  };
};
