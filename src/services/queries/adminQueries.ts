import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminAPI } from "../index";

export const adminQueryKeys = {
  stats: () => ["admin", "stats"] as const,
  stores: (params?: any) => ["admin", "stores", params] as const,
  subscriptions: (params?: any) => ["admin", "subscriptions", params] as const,
  payments: (params?: any) => ["admin", "payments", params] as const,
};

export function useAdminStats() {
  return useQuery({
    queryKey: adminQueryKeys.stats(),
    queryFn: () => adminAPI.getStats(),
  });
}

export function useAdminStores(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}) {
  return useQuery({
    queryKey: adminQueryKeys.stores(params),
    queryFn: () => adminAPI.getStores(params),
  });
}

export function useToggleStoreStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      adminAPI.toggleStoreStatus(id, isActive),
    onSuccess: () => {
      // Invalidate all admin related queries
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
  });
}

export function useAdminSubscriptions(params?: {
  page?: number;
  limit?: number;
  status?: string;
}) {
  return useQuery({
    queryKey: adminQueryKeys.subscriptions(params),
    queryFn: () => adminAPI.getSubscriptions(params),
  });
}

export function useAdminPayments(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  plan?: string;
}) {
  return useQuery({
    queryKey: adminQueryKeys.payments(params),
    queryFn: () => adminAPI.getPayments(params),
  });
}

export function useResetOwnerPin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, pinCode }: { id: number; pinCode: string }) =>
      adminAPI.resetOwnerPin(id, pinCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
  });
}

export function useUpdateSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
      plan,
      endDate,
      gracePeriodDays,
    }: {
      id: number;
      status: string;
      plan: string;
      endDate: string | null;
      gracePeriodDays?: number;
    }) => adminAPI.updateSubscription(id, { status, plan, endDate, gracePeriodDays }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
  });
}

export function useImpersonateStore() {
  return useMutation({
    mutationFn: (id: number) => adminAPI.impersonateStore(id),
  });
}

export function useDeleteStore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminAPI.deleteStore(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
  });
}

export function useExtendSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, days }: { id: number; days: number }) =>
      adminAPI.extendSubscription(id, days),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
  });
}
