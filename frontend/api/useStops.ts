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

export function useReorderStopsMutation() {
  return useMutation({
    mutationFn: async ({ tripId, stopIds }: { tripId: string; stopIds: string[] }) => {
      const response = await apiClient.patch(`/trips/${tripId}/stops/reorder`, { stopIds });
      return response.data;
    },
  });
}

export function useReorderActivitiesMutation() {
  return useMutation({
    mutationFn: async ({ stopId, dayNumber, activityIds }: { stopId: string; dayNumber: number; activityIds: string[] }) => {
      // Per prompt instructions, PATCH /api/stop-activities/reorder
      const response = await apiClient.patch(`/stop-activities/reorder`, { stopId, dayNumber, activityIds });
      return response.data;
    },
  });
}



