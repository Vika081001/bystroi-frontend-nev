import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/shared/api/client";
import { ListResponse } from "@/shared/types/api";
import { GetProductsParams, Product } from "@/shared/types/product";

export const useProducts = (
  params: GetProductsParams = { page: 1, size: 20, sort_order: "desc" },
) => {
  return useQuery<ListResponse<Product[]>>({
    queryKey: ["products", params],
    queryFn: async () => {
      const response = await apiClient.get("/products", { params });

      return response.data;
    },
  });
};
