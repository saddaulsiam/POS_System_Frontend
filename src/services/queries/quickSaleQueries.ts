import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { quickSaleItemsAPI } from "../index";

export const quickSaleQueryKeys = {
  all: ["quickSaleItems"] as const,
  detail: (id: number) => ["quickSaleItem", id] as const,
};

export function useQuickSaleItems() {
  return useQuery({
    queryKey: quickSaleQueryKeys.all,
    queryFn: () => quickSaleItemsAPI.getAll(),
  });
}

export function useCreateQuickSaleItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => quickSaleItemsAPI.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: quickSaleQueryKeys.all }),
  });
}

export function useUpdateQuickSaleItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: any) => quickSaleItemsAPI.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: quickSaleQueryKeys.all }),
  });
}

export function useDeleteQuickSaleItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => quickSaleItemsAPI.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: quickSaleQueryKeys.all }),
  });
}
