import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api/client"
import { Review, GetReviewsParams, CreateReview, UpdateReview } from "@/lib/types/review"
import { ListResponse } from "@/lib/types/api"

export const useReviews = (params: GetReviewsParams) => {
    return useQuery<ListResponse<Review[]>>({
        queryKey: ["reviews", params],
        queryFn: async () => {
            const response = await apiClient.get("/reviews", { params })
            return response.data
        },
    })
}

export const useCreateReview = () => {
    const queryClient = useQueryClient()
    
    return useMutation({
        mutationFn: async (review: CreateReview) => {
            const response = await apiClient.post("/reviews", review)
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reviews"] })
        },
    })
}

export const useUpdateReview = () => {
    const queryClient = useQueryClient()
    
    return useMutation({
        mutationFn: async ({ id, ...review}: UpdateReview) => {
            const response = await apiClient.patch(`/reviews/${id}`, review)
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reviews"] })
        },
    })
}
