import { apiClient } from "@/shared/api/client";

import { AddToCartDto, Cart, RemoveFromCartDto } from "../model/types";

const ENTITY_URL = "/cart";

export const fetchCart = async (contragent_phone: string): Promise<Cart> => {
  const response = await apiClient.get<Cart>(ENTITY_URL, {
    params: { contragent_phone },
  });
  return response.data;
};

export const addToCart = async (data: AddToCartDto): Promise<Cart> => {
  const payload = {
    ...data,
    good: {
      ...data.good,
      is_from_cart: data.good.is_from_cart ?? true,
    },
  };
  
  const response = await apiClient.post<Cart>(`${ENTITY_URL}/add`, payload);
  return response.data;
};

export const removeFromCart = async (
  data: RemoveFromCartDto,
): Promise<void> => {
  await apiClient.delete(`${ENTITY_URL}/remove`, { data });
};