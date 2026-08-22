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

export const registerSchema = z.object({
  firstName: z.string().min(2, { message: "First name is required." }),
  lastName: z.string().min(2, { message: "Last name is required." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().optional(),
  city: z.string().min(2, { message: "City is required." }),
  country: z.string().min(2, { message: "Country is required." }),
  additionalInfo: z.string().optional(),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

export type RegisterCredentials = z.infer<typeof registerSchema>;

export function useRegisterMutation() {
  return useMutation({
    mutationFn: async (credentials: RegisterCredentials) => {
      const { data } = await apiClient.post("/auth/register", credentials);
      return data;
    },
  });
}

