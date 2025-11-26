import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/shared/api/client";
import { ListResponse } from "@/shared/types/api";
import { Event } from "@/shared/types/event";

export const useEvents = () => {
  return useQuery<Event[]>({
    queryKey: ["events"],
    queryFn: async () => {
      const response = await apiClient.get("/events");
      return response.data;
    },
  });
};

export const useEvent = (id: string) => {
  return useQuery<Event>({
    queryKey: ["event", id],
    queryFn: async () => {
      const response = await apiClient.get(`/events/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};
