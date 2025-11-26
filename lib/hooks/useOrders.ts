import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api/client"
import { ListResponse } from "@/lib/types/api"
import { CreateOrderParams } from "../types/order"


export const useCreateOrder = () => {
    const queryClient = useQueryClient()
    
    return useMutation({
        mutationFn: async (orderData: CreateOrderParams) => {
            const response = await apiClient.post("/orders", orderData)
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] })
            queryClient.invalidateQueries({ queryKey: ["cart"] })
        },
    })
}

