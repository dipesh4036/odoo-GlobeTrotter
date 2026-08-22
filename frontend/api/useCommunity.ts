import { useQuery, useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export interface CommunityPost {
  id: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    photoUrl: string | null;
  };
  trip?: {
    name: string;
  } | null;
}

export function useCommunityPostsQuery(search?: string, sort?: string) {
  return useQuery({
    queryKey: ["community", search, sort],
    queryFn: async (): Promise<CommunityPost[]> => {
      const { data } = await apiClient.get("/community", {
        params: { search, sort },
      });
      return data;
    },
  });
}

export interface CreatePostData {
  content: string;
  tripId?: string;
}

export function useCreateCommunityPostMutation() {
  return useMutation({
    mutationFn: async (postData: CreatePostData) => {
      const { data } = await apiClient.post("/community", postData);
      return data;
    },
  });
}
