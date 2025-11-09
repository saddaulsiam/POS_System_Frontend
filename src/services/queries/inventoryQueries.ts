import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { inventoryAPI } from "../index";

export const inventoryQueryKeys = {
  movements: (productId?: number, params?: any) =>
    ["inventory", "movements", productId, params] as const,
  alerts: (params?: any) => ["inventory", "alerts", params] as const,
  purchaseOrders: (params?: any) =>
    ["inventory", "purchaseOrders", params] as const,
  purchaseOrder: (id: number) => ["inventory", "purchaseOrder", id] as const,
};

export function useStockMovements(productId?: number, params?: any) {
  return useQuery({
    queryKey: inventoryQueryKeys.movements(productId, params),
    queryFn: () => inventoryAPI.getStockMovements(productId, params),
    enabled: typeof productId === "number" || !productId,
  });
}

export function useInventoryAlerts(params?: any) {
  return useQuery({
    queryKey: inventoryQueryKeys.alerts(params),
    queryFn: () => inventoryAPI.getAlerts(params),
  });
}

export function useResolveAlert() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (alertId: number) => inventoryAPI.resolveAlert(alertId),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["inventory", "alerts"] }),
  });
}

export function usePurchaseOrders(params?: any) {
  return useQuery({
    queryKey: inventoryQueryKeys.purchaseOrders(params),
    queryFn: () => inventoryAPI.getAllPurchaseOrders(params),
  });
}

export function usePurchaseOrder(id?: number) {
  return useQuery({
    queryKey: inventoryQueryKeys.purchaseOrder(id ?? -1),
    queryFn: () => inventoryAPI.getPurchaseOrderById(id as number),
    enabled: typeof id === "number" && id > 0,
  });
}

export function useCreatePurchaseOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => inventoryAPI.createPurchaseOrder(data),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["inventory", "purchaseOrders"] }),
  });
}

export function useUpdateStock() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, data }: { productId: number; data: any }) =>
      inventoryAPI.updateStock(productId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["inventory", "movements"] });
      qc.invalidateQueries({ queryKey: ["reports", "inventory"] });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdatePurchaseOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      inventoryAPI.updatePurchaseOrder(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["inventory", "purchaseOrders"] });
    },
  });
}

export function useReceivePurchaseOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      items,
    }: {
      id: number;
      items: Array<{ itemId: number; receivedQuantity: number }>;
    }) => inventoryAPI.receiveItems(id, items),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["inventory", "purchaseOrders"] });
      qc.invalidateQueries({ queryKey: ["inventory", "movements"] });
      qc.invalidateQueries({ queryKey: ["reports", "inventory"] });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useCancelPurchaseOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => inventoryAPI.cancelPurchaseOrder(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["inventory", "purchaseOrders"] });
    },
  });
}

export function usePurchaseOrderStats(params?: any) {
  return useQuery({
    queryKey: ["inventory", "purchaseOrders", "stats", params],
    queryFn: () => inventoryAPI.getPurchaseOrderStats(params),
  });
}
