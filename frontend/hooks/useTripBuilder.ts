import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";

export function useAddStopMutation(tripId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { cityId: string; startDate: Date; endDate: Date }) => {
      const res = await apiClient.post(`/trips/${tripId}/stops`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips", tripId] });
      queryClient.invalidateQueries({ queryKey: ["trips", tripId, "budget"] });
      toast.success("Stop added to trip!");
    },
    onError: (error: any) => {
      console.error("Add Stop Error:", error.response?.data);
      const msg = error.response?.data?.error;
      const details = error.response?.data?.details;
      if (details && Array.isArray(details)) {
        toast.error(details[0]?.message || "Validation failed");
      } else {
        toast.error(msg || "Failed to add stop");
      }
    },
  });
}

export function useDeleteStopMutation(tripId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (stopId: string) => {
      await apiClient.delete(`/stops/${stopId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips", tripId] });
      queryClient.invalidateQueries({ queryKey: ["trips", tripId, "budget"] });
      toast.success("Stop removed");
    },
  });
}

export function useAddActivityMutation(tripId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { stopId: string; activityId: string; dayNumber: number }) => {
      const res = await apiClient.post(`/stops/${data.stopId}/activities`, {
        activityId: data.activityId,
        dayNumber: data.dayNumber,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips", tripId] });
      queryClient.invalidateQueries({ queryKey: ["trips", tripId, "budget"] });
      toast.success("Activity added!");
    },
  });
}

export function useRemoveActivityMutation(tripId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (stopActivityId: string) => {
      await apiClient.delete(`/stop-activities/${stopActivityId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips", tripId] });
      queryClient.invalidateQueries({ queryKey: ["trips", tripId, "budget"] });
      toast.success("Activity removed");
    },
  });
}
