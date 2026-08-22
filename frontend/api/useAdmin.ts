import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "USER" | "ADMIN";
  tripCount: number;
  joinedDate: string;
}

export function useAdminUsersQuery() {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: async (): Promise<AdminUser[]> => {
      const { data } = await apiClient.get("/admin/users");
      return data;
    },
  });
}

export interface PopularItem {
  id: string;
  name: string;
  popularityScore: number;
}

export function usePopularCitiesQuery() {
  return useQuery({
    queryKey: ["admin", "cities", "popular"],
    queryFn: async (): Promise<PopularItem[]> => {
      const { data } = await apiClient.get("/admin/cities/popular");
      return data;
    },
  });
}

export function usePopularActivitiesQuery() {
  return useQuery({
    queryKey: ["admin", "activities", "popular"],
    queryFn: async (): Promise<PopularItem[]> => {
      const { data } = await apiClient.get("/admin/activities/popular");
      return data;
    },
  });
}

export interface AdminTrends {
  totalUsers: number;
  tripsCreated: { date: string; count: number }[];
  statusDistribution: { status: string; count: number }[];
}

export function useAdminTrendsQuery() {
  return useQuery({
    queryKey: ["admin", "trends"],
    queryFn: async (): Promise<AdminTrends> => {
      const { data } = await apiClient.get("/admin/trends");
      return data;
    },
  });
}
