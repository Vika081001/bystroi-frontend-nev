import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api/client"
import { Product, ProductsParams } from "@/lib/types/product"
import { ListResponse } from "@/lib/types/api"

export const useProducts = (params: ProductsParams = { page: 1, size: 20, sort_order: "desc"}) => {
    return useQuery<ListResponse<Product[]>>({
        queryKey: ["products", params],
        queryFn: async () => {
            const response = await apiClient.get("/products", { params })
            
            return response.data
        },
    })
}

