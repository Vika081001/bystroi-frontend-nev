import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api/client"
import { AddToCartParams, Cart, OrderGood, RemoveFromCartParams } from "@/lib/types/cart"

export const useCart = () => {
    return useQuery<Cart>({
        queryKey: ["cart"],
        queryFn: async () => {
            const response = await apiClient.get("/cart")
            return response.data
        },
    })
}

export const useAddToCart = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (item: AddToCartParams) => {
            const response = await apiClient.post("/cart/add", item)
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] })
        },
    })
}

export const useRemoveFromCart = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (item: RemoveFromCartParams) => {
            await apiClient.delete(`/cart/remove`, { data: item })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] })
        },
    })
}