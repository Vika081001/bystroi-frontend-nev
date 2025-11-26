import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api/client"
import { Location, GetLocationParams } from "@/lib/types/location"
import { ListResponse } from "@/lib/types/api"

export const useLocations = (params: GetLocationParams = { page: 1, size: 20 }) => {
    return useQuery<ListResponse<Location[]>>({
        queryKey: ["locations", params],
        queryFn: async () => {
            const response = await apiClient.get("/locations")
            return response.data
        },
    })
}
