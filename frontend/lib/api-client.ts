import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Optional: Add interceptors for response error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can handle global error logging or token refresh here
    return Promise.reject(error);
  }
);
