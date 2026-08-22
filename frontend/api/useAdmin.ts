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
