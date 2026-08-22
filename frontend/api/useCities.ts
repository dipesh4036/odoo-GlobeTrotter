import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export interface City {
  id: string;
  name: string;
  country: string;
  region: string;
  costIndex: number;
  popularity: number;
  imageUrl: string | null;
}

export function useCitiesQuery() {
  return useQuery({
    queryKey: ["cities"],
    queryFn: async (): Promise<City[]> => {
      const { data } = await apiClient.get("/cities");
      return data;
    },
  });
}
