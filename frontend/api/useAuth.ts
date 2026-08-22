import { useMutation, useQuery } from "@tanstack/react-query";
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

export function useLogoutMutation() {
  return useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.post("/auth/logout");
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

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export type ForgotPasswordCredentials = z.infer<typeof forgotPasswordSchema>;

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: async (credentials: ForgotPasswordCredentials) => {
      const { data } = await apiClient.post("/auth/forgot-password", credentials);
      return data;
    },
  });
}
export const resetPasswordSchema = z.object({
  token: z.string().min(1, { message: "Token is required" }),
  newPassword: z.string().min(8, { message: "Password must be at least 8 characters." }),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

export type ResetPasswordCredentials = z.infer<typeof resetPasswordSchema>;

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: async ({ token, newPassword }: Pick<ResetPasswordCredentials, 'token' | 'newPassword'>) => {
      const { data } = await apiClient.post("/auth/reset-password", { token, newPassword });
      return data;
    },
  });
}

export const updateUserSchema = z.object({
  firstName: z.string().min(2, { message: "First name is required." }),
  lastName: z.string().min(2, { message: "Last name is required." }),
  phone: z.string().optional(),
  city: z.string().min(2, { message: "City is required." }),
  country: z.string().min(2, { message: "Country is required." }),
  additionalInfo: z.string().optional(),
  languageId: z.string().optional(),
});

export type UpdateUserCredentials = z.infer<typeof updateUserSchema>;

export function useUpdateUserMutation() {
  return useMutation({
    mutationFn: async (credentials: UpdateUserCredentials) => {
      const { data } = await apiClient.patch("/users/me", credentials);
      return data;
    },
  });
}

export interface SavedDestination {
  id: string;
  userId: string;
  cityId: string;
  cityName: string;
  imageUrl: string | null;
  savedAt: string;
}

export function useSavedDestinationsQuery() {
  return useQuery({
    queryKey: ["savedDestinations"],
    queryFn: async (): Promise<SavedDestination[]> => {
      const { data } = await apiClient.get("/users/me/saved-destinations");
      return data;
    },
  });
}

export function useRemoveSavedDestinationMutation() {
  return useMutation({
    mutationFn: async (cityId: string) => {
      const { data } = await apiClient.delete(`/users/me/saved-destinations/${cityId}`);
      return data;
    },
  });
}

export function useDeleteAccountMutation() {
  return useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.delete("/users/me");
      return data;
    },
  });
}
