import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { customersAPI } from "../index";

export const customerQueryKeys = {
  list: (params?: any) => ["customers", params] as const,
  detail: (id: number) => ["customer", id] as const,
};

export function useCustomers(params?: any) {
  return useQuery({
    queryKey: customerQueryKeys.list(params),
    queryFn: () => customersAPI.getAll(params),
  });
}

export function useCustomer(id?: number) {
  return useQuery({
    queryKey: customerQueryKeys.detail(id ?? -1),
    queryFn: () => customersAPI.getById(id as number),
    enabled: typeof id === "number" && id > 0,
  });
}

export function useCreateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => customersAPI.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["customers"] }),
  });
}

export function useUpdateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      customersAPI.update(id, data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["customers"] });
      qc.invalidateQueries({ queryKey: ["customer", variables.id] });
    },
  });
}

export function useDeleteCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => customersAPI.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["customers"] }),
  });
}
