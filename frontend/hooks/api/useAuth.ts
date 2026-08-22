import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

export type LoginCredentials = z.infer<typeof loginSchema>;

export function useLoginMutation() {
  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const { data } = await apiClient.post("/auth/login", credentials);
      return data;
    },
  });
}
