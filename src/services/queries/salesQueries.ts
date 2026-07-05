import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { salesAPI } from "../index";

export const salesQueryKeys = {
  list: (params?: any) => ["sales", params] as const,
  detail: (id: number) => ["sale", id] as const,
};

export function useSales(params?: any) {
  return useQuery({
    queryKey: salesQueryKeys.list(params),
    queryFn: () => salesAPI.getAll(params),
  });
}

export function useSale(id?: number) {
  return useQuery({
    queryKey: salesQueryKeys.detail(id ?? -1),
    queryFn: () => salesAPI.getById(id as number),
    enabled: typeof id === "number" && id > 0,
  });
}

export function useCreateSale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => salesAPI.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sales"] }),
  });
}

export function useSaleByReceiptId(receiptId?: string) {
  const normalizedReceiptId = receiptId?.trim() || "";
  const canSearchByReceiptId = normalizedReceiptId.length >= 10;

  return useQuery({
    queryKey: ["sale", "receipt", receiptId] as const,
    queryFn: () => salesAPI.getByReceiptId(normalizedReceiptId),
    enabled: canSearchByReceiptId,
  });
}

export function useRefundSale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      salesAPI.processRefund(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sales"] }),
  });
}

export function useVoidSale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      salesAPI.voidSale(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sales"] }),
  });
}
