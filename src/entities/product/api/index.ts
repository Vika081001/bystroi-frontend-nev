import axios from "axios";

import { GetProductDto, GetProductsDto } from "../model/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://app.tablecrm.com/api/v1/mp";

export const fetchProducts = async (params: GetProductsDto) => {
  try {
    const requestParams = {
      page: params.page || 1,
      size: params.size || 20,
      sort_by: params.sort_by,
      sort_order: params.sort_order,
      category: params.category,
      manufacturer: params.manufacturer,
      min_price: params.min_price,
      max_price: params.max_price,
      rating_from: params.rating_from,
      rating_to: params.rating_to,
      in_stock: params.in_stock,
      global_category_id: params.global_category_id,
    };
    
    // Удаляем undefined значения из параметров
    Object.keys(requestParams).forEach(key => {
      if (requestParams[key as keyof typeof requestParams] === undefined) {
        delete requestParams[key as keyof typeof requestParams];
      }
    });
    
    console.log("Fetching products with params:", requestParams);
    
    const response = await axios.get(`${API_BASE_URL}/products`, {
      params: requestParams,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log("Products response:", {
      count: response.data?.count,
      resultLength: response.data?.result?.length,
      page: response.data?.page,
    });
    
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const fetchProduct = async (params: GetProductDto) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products/${params.product_id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

export const fetchProductServer = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      cache: "force-cache",
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch product");
    }
    
    return response.json();
  } catch (error) {
    console.error("Error fetching product on server:", error);
    return null;
  }
};