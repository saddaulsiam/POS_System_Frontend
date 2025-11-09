import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationsAPI } from "../api/notificationsAPI";
import toast from "react-hot-toast";

// Query Keys
export const notificationsKeys = {
  all: ["notifications"] as const,
  list: (params?: { page?: number; limit?: number }) =>
    [...notificationsKeys.all, "list", params] as const,
};

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Get paginated notifications
 */
export const useNotifications = (params?: {
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: notificationsKeys.list(params),
    queryFn: () => notificationsAPI.getAll(params),
  });
};

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Mark a notification as read
 */
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => notificationsAPI.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationsKeys.all });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.error || "Failed to mark notification as read",
      );
    },
  });
};
