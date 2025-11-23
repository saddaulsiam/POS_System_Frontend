import { useQuery } from "@tanstack/react-query";
import api from "../api";

// Query Keys
export const auditLogsKeys = {
  all: ["auditLogs"] as const,
  list: (params?: any) => [...auditLogsKeys.all, "list", params] as const,
};

export const useAuditLogs = (params?: {
  page?: number;
  limit?: number;
  userId?: string;
  action?: string;
  entity?: string;
}) => {
  return useQuery({
    queryKey: auditLogsKeys.list(params),
    queryFn: async () => {
      const res = await api.get("/audit-logs", { params });
      return {
        logs: res.data.logs || [],
        total: res.data.total || 0,
      };
    },
  });
};
