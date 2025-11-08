import axios from "axios";
import { toast } from "@/hooks/use-toast";

// Use proxy in development to avoid ad blocker issues, use env var in production
const baseURL = import.meta.env.DEV 
  ? "/api"  // Use Vite proxy in development (avoids ad blockers)
  : (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") || "/api";

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("aurafit_token");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't show toast for network errors that are likely blocked by ad blockers
    const isBlocked = error.code === "ERR_BLOCKED_BY_CLIENT" || 
                      error.message?.includes("ERR_BLOCKED_BY_CLIENT") ||
                      error.message?.includes("Network Error") && !error.response;
    
    if (!isBlocked) {
      const status = error?.response?.status;
      const dataMessage = error?.response?.data?.message || error?.response?.data?.error;
      const message = dataMessage || (status ? `Request failed with status ${status}` : error.message || "Request failed");

      // Only show toast for actual API errors, not network blocks
      if (error.response || (error.request && !isBlocked)) {
        toast({
          title: "Request failed",
          description: message,
          variant: "destructive",
        });
      }
    }

    return Promise.reject(error);
  },
);

export const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message || error.response?.data?.error || error.message;
    return message || "Unexpected error";
  }
  if (error instanceof Error) return error.message;
  return "Unexpected error";
};

export default api;

