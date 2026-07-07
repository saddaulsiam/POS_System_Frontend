import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminAPI } from "../index";

export const adminQueryKeys = {
  stats: () => ["admin", "stats"] as const,
  stores: (params?: any) => ["admin", "stores", params] as const,
  subscriptions: (params?: any) => ["admin", "subscriptions", params] as const,
  payments: (params?: any) => ["admin", "payments", params] as const,
  settings: () => ["admin", "settings"] as const,
  publicSettings: () => ["public", "settings"] as const,
  promoCodes: () => ["admin", "promoCodes"] as const,
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
  plan?: string;
  sortBy?: string;
  dateJoined?: string;
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
  search?: string;
  status?: string;
  plan?: string;
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
    }) =>
      adminAPI.updateSubscription(id, {
        status,
        plan,
        endDate,
        gracePeriodDays,
      }),
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

export function useAdminSettings() {
  return useQuery({
    queryKey: adminQueryKeys.settings(),
    queryFn: () => adminAPI.getSystemSettings(),
  });
}

export function useUpdateAdminSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (settings: any) => adminAPI.updateSystemSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.settings() });
    },
  });
}

export function usePublicSettings() {
  return useQuery({
    queryKey: adminQueryKeys.publicSettings(),
    queryFn: () => adminAPI.getPublicSettings(),
  });
}

export function useBroadcastAnnouncements() {
  return useMutation({
    mutationFn: (params: {
      subject: string;
      body: string;
      targetAudience: string;
    }) => adminAPI.broadcastAnnouncements(params),
  });
}

export function useSendRenewalReminder() {
  return useMutation({
    mutationFn: (id: number) => adminAPI.sendRenewalReminder(id),
  });
}

export function useTestSmtpConnection() {
  return useMutation({
    mutationFn: (settings: {
      smtpHost: string;
      smtpPort: number;
      smtpUser: string;
      smtpPass: string;
    }) => adminAPI.testSmtpConnection(settings),
  });
}

export function useAdminPromoCodes() {
  return useQuery({
    queryKey: adminQueryKeys.promoCodes(),
    queryFn: () => adminAPI.getPromoCodes(),
  });
}

export function useCreatePromoCode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (promo: any) => adminAPI.createPromoCode(promo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.promoCodes() });
    },
  });
}

export function useUpdatePromoCode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, promo }: { id: number; promo: any }) =>
      adminAPI.updatePromoCode(id, promo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.promoCodes() });
    },
  });
}

export function useTogglePromoCode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminAPI.togglePromoCode(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.promoCodes() });
    },
  });
}

export function useDeletePromoCode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminAPI.deletePromoCode(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.promoCodes() });
    },
  });
}

export function useValidatePromoCode() {
  return useMutation({
    mutationFn: (params: { code: string; plan: string }) =>
      adminAPI.validatePromoCode(params),
  });
}

export function useApplyTrialPromo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (code: string) => adminAPI.applyTrialPromo(code),
    onSuccess: () => {
      // Invalidate active tenant subscriptions
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
    },
  });
}
