import { apiClient } from "@/shared/api/client";

import { Product } from "../model/types";

export const fetchProductById = async (productId: number): Promise<Product> => {
  const response = await apiClient.get<Product>(`/products/${productId}`);
  return response.data;
};