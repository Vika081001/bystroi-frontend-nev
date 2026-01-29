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
      // Приоритет у address, если его нет - используем city (обратная совместимость)
      address: params.address || params.city,
      seller_id: params.seller_id,
      lat: params.lat,
      lon: params.lon,
    };
    
    // Удаляем undefined значения из параметров
    Object.keys(requestParams).forEach(key => {
      if (requestParams[key as keyof typeof requestParams] === undefined) {
        delete requestParams[key as keyof typeof requestParams];
      }
    });
    
    const response = await axios.get(`${API_BASE_URL}/products`, {
      params: requestParams,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const fetchProduct = async (params: GetProductDto) => {
  try {
    const requestParams: { lat?: number; lon?: number; address?: string; city?: string } = {
      lat: params.lat,
      lon: params.lon,
      address: params.address,
      city: params.city,
    };
    
    // Удаляем undefined значения из параметров
    Object.keys(requestParams).forEach(key => {
      if (requestParams[key as keyof typeof requestParams] === undefined) {
        delete requestParams[key as keyof typeof requestParams];
      }
    });
    
    const response = await axios.get(`${API_BASE_URL}/products/${params.product_id}`, {
      params: Object.keys(requestParams).length > 0 ? requestParams : undefined,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

export const fetchProductServer = async (id: string, lat?: number, lon?: number, address?: string, city?: string) => {
  try {
    const params = new URLSearchParams();
    if (lat != null) {
      params.append('lat', String(lat));
    }
    if (lon != null) {
      params.append('lon', String(lon));
    }
    if (address) {
      params.append('address', address);
    }
    if (city) {
      params.append('city', city);
    }
    
    const url = `${API_BASE_URL}/products/${id}${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url, {
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