import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productVariantsAPI } from "../index";

export const productVariantQueryKeys = {
  list: (params?: any) => ["productVariants", params] as const,
  detail: (id: number) => ["productVariant", id] as const,
};

export function useProductVariants(params?: any) {
  return useQuery({
    queryKey: productVariantQueryKeys.list(params),
    queryFn: () => productVariantsAPI.getAll(params),
    enabled: params !== undefined,
  });
}

export function useProductVariant(id?: number) {
  return useQuery({
    queryKey: productVariantQueryKeys.detail(id ?? -1),
    queryFn: () => productVariantsAPI.getById(id as number),
    enabled: typeof id === "number" && id > 0,
  });
}

export function useLookupVariant() {
  return useMutation({
    mutationFn: ({
      barcode,
      silent = false,
    }: {
      barcode: string;
      silent?: boolean;
    }) => productVariantsAPI.lookup(barcode, silent),
  });
}

export function useCreateProductVariant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Parameters<typeof productVariantsAPI.create>[0]) =>
      productVariantsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productVariants"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateProductVariant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Parameters<typeof productVariantsAPI.update>[1];
    }) => productVariantsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productVariants"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useDeleteProductVariant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => productVariantsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productVariants"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
