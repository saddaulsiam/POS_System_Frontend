import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { parkedSalesAPI } from "../index";

export const parkedSalesQueryKeys = {
  list: () => ["parkedSales"] as const,
  detail: (id: number) => ["parkedSale", id] as const,
};

export function useParkedSales() {
  return useQuery({
    queryKey: parkedSalesQueryKeys.list(),
    queryFn: () => parkedSalesAPI.getAll(),
  });
}

export function useCreateParkedSale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => parkedSalesAPI.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["parkedSales"] }),
  });
}

export function useDeleteParkedSale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => parkedSalesAPI.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["parkedSales"] }),
  });
}
