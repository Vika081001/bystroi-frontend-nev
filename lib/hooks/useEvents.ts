import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api/client"
import { Event } from "@/lib/types/event"
import { ListResponse } from "@/lib/types/api"

export const useEvents = () => {
    return useQuery<Event[]>({
        queryKey: ["events"],
        queryFn: async () => {
            const response = await apiClient.get("/events")
            return response.data
        },
    })
}

export const useEvent = (id: string) => {
    return useQuery<Event>({
        queryKey: ["event", id],
        queryFn: async () => {
            const response = await apiClient.get(`/events/${id}`)
            return response.data
        },
        enabled: !!id,
    })
}
