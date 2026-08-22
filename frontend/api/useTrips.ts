import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export interface Trip {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  coverPhotoUrl: string | null;
  startDate: string;
  endDate: string;
  status: "ONGOING" | "UPCOMING" | "COMPLETED" | "CANCELLED";
  isPublic: boolean;
  publicSlug: string | null;
  createdAt: string;
}

export function useTripsQuery(status?: string) {
  return useQuery({
    queryKey: ["trips", status],
    queryFn: async (): Promise<Trip[]> => {
      const { data } = await apiClient.get("/trips", {
        params: { status },
      });
      return data;
    },
  });
}
