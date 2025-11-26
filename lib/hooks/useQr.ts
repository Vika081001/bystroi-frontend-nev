import { useQuery, useMutation } from "@tanstack/react-query"
import { apiClient } from "@/lib/api/client"

export const useResolveQr = (hash: string) => {
    return useQuery({
        queryKey: ["qr", hash],
        queryFn: async () => {
            const response = await apiClient.get(`/qr/${hash}`)
            return response.data
        },
    })
}

// export const useGenerateQr = () => {
//     return useMutation({
//         mutationFn: async (data: { productId: string; quantity?: number }) => {
//             const response = await apiClient.post("/qr/generate", data)
//             return response.data
//         },
//     })
// }

