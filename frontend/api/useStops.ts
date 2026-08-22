import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

interface UpdateStopData {
  startDate?: string;
  endDate?: string;
  budget?: number;
}

export function useUpdateStopMutation() {
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateStopData }) => {
      const response = await apiClient.patch(`/stops/${id}`, data);
      return response.data;
    },
  });
}

interface CreateStopData {
  cityId: string;
  startDate: string;
  endDate: string;
  budget?: number;
}

export function useCreateStopMutation() {
  return useMutation({
    mutationFn: async ({ tripId, data }: { tripId: string; data: CreateStopData }) => {
      const response = await apiClient.post(`/trips/${tripId}/stops`, data);
      return response.data;
    },
  });
}

interface AddActivityData {
  activityId: string;
  dayNumber: number;
}

export function useAddActivityToStopMutation() {
  return useMutation({
    mutationFn: async ({ stopId, data }: { stopId: string; data: AddActivityData }) => {
      const response = await apiClient.post(`/stops/${stopId}/activities`, data);
      return response.data;
    },
  });
}


