import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export interface Activity {
  id: string;
  cityId: string;
  name: string;
  description: string;
  category: string;
  cost: number;
  durationMin: number;
  imageUrl: string | null;
  popularity: number;
  cityName: string;
}

export function useActivitiesQuery(params?: { cityId?: string; category?: string; maxCost?: number }) {
  return useQuery({
    queryKey: ["activities", params],
    queryFn: async (): Promise<Activity[]> => {
      const { data } = await apiClient.get("/activities", { params });
      return data;
    },
  });
}

export function useActivityByIdQuery(id: string | null) {
  return useQuery({
    queryKey: ["activities", id],
    queryFn: async (): Promise<Activity> => {
      const { data } = await apiClient.get(`/activities/${id}`);
      return data;
    },
    enabled: !!id,
  });
}
