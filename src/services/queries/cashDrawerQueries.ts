import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cashDrawerAPI } from "../index";

export const cashDrawerQueryKeys = {
  list: (params?: any) => ["cashDrawer", "list", params] as const,
  current: () => ["cashDrawer", "current"] as const,
  detail: (id: number) => ["cashDrawer", "detail", id] as const,
  reconciliation: (id: number) => ["cashDrawer", "reconciliation", id] as const,
  stats: (params?: any) => ["cashDrawer", "stats", params] as const,
};

export function useCashDrawers(params?: any) {
  return useQuery({
    queryKey: cashDrawerQueryKeys.list(params),
    queryFn: () => cashDrawerAPI.getAll(params),
  });
}

export function useCurrentCashDrawer() {
  return useQuery({
    queryKey: cashDrawerQueryKeys.current(),
    queryFn: () => cashDrawerAPI.getCurrent(),
  });
}

export function useCashDrawer(id?: number) {
  return useQuery({
    queryKey: cashDrawerQueryKeys.detail(id ?? -1),
    queryFn: () => cashDrawerAPI.getById(id as number),
    enabled: typeof id === "number" && id > 0,
  });
}

export function useCashDrawerReconciliation(id?: number) {
  return useQuery({
    queryKey: cashDrawerQueryKeys.reconciliation(id ?? -1),
    queryFn: () => cashDrawerAPI.getReconciliation(id as number),
    enabled: typeof id === "number" && id > 0,
  });
}

export function useCashDrawerStats(params?: any) {
  return useQuery({
    queryKey: cashDrawerQueryKeys.stats(params),
    queryFn: () => cashDrawerAPI.getStats(params),
  });
}

export function useOpenCashDrawer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { openingBalance: number }) => cashDrawerAPI.open(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cashDrawer"] });
    },
  });
}

export function useCloseCashDrawer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: { closingBalance: number; actualCash?: number; notes?: string };
    }) => cashDrawerAPI.close(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cashDrawer"] });
    },
  });
}
