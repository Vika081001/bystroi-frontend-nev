import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import * as productApi from "../api";
import { GetProductDto, GetProductsDto } from "../model/types";

export const productKeys = {
  root: ["product"] as const,
};

export const useProducts = (params: GetProductsDto) => {
  return useQuery({
    queryKey: [...productKeys.root, params],
    queryFn: () => productApi.fetchProducts(params),
  });
};

export const useProduct = (params: GetProductDto) => {
  return useQuery({
    queryKey: [...productKeys.root, params],
    queryFn: () => productApi.fetchProduct(params),
  });
};

export const useInfProducts = (params: Omit<GetProductsDto, "page">) => {
  return useInfiniteQuery({
    queryKey: [...productKeys.root, params],
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) =>
      productApi.fetchProducts({ ...params, page: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      const pageSize = params.size || 20;

      if (!lastPage.result || lastPage.result.length < pageSize) {
        return undefined;
      }
      return allPages.length + 1;
    },
  });
};