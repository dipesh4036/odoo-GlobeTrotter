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
