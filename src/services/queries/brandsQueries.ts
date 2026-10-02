import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { brandsAPI } from "../index";

export const brandQueryKeys = {
  all: ["brands"] as const,
  detail: (id: number) => ["brand", id] as const,
};

export function useBrands() {
  return useQuery({
    queryKey: brandQueryKeys.all,
    queryFn: () => brandsAPI.getAll(),
  });
}

export function useBrand(id?: number) {
  return useQuery({
    queryKey: brandQueryKeys.detail(id ?? -1),
    queryFn: () => brandsAPI.getById(id as number),
    enabled: typeof id === "number" && id > 0,
  });
}

export function useCreateBrand() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => brandsAPI.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: brandQueryKeys.all }),
  });
}

export function useUpdateBrand() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      brandsAPI.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: brandQueryKeys.all }),
  });
}

export function useDeleteBrand() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => brandsAPI.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: brandQueryKeys.all }),
  });
}
