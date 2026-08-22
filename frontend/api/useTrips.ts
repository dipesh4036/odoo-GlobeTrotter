import { useQuery, useMutation } from "@tanstack/react-query";
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

import { z } from "zod";

export const createTripSchema = z.object({
  name: z.string().min(1, { message: "Trip name is required." }),
  description: z.string().optional(),
  startDate: z.date({
    required_error: "Start date is required.",
  }),
  endDate: z.date({
    required_error: "End date is required.",
  }),
}).refine((data) => data.endDate >= data.startDate, {
  message: "End date must be on or after the start date.",
  path: ["endDate"],
});

export type CreateTripData = z.infer<typeof createTripSchema>;

export function useCreateTripMutation() {
  return useMutation({
    mutationFn: async (tripData: CreateTripData) => {
      const { data } = await apiClient.post("/trips", tripData);
      return data;
    },
  });
}

