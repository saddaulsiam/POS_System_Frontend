import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { productsAPI } from "../index";

export const productQueryKeys = {
  all: ["products"] as const,
  list: (params?: any) => ["products", params] as const,
  infinite: (params?: any) => ["products", "infinite", params] as const,
  detail: (id: number) => ["product", id] as const,
};

export function useProducts(params?: any) {
  return useQuery({
    queryKey: productQueryKeys.list(params),
    queryFn: () => productsAPI.getAll(params),
  });
}

export function useInfiniteProducts(params?: any) {
  return useInfiniteQuery({
    queryKey: productQueryKeys.infinite(params),
    queryFn: ({ pageParam = 1 }) =>
      productsAPI.getAll({ ...params, page: pageParam, limit: 20 }),
    getNextPageParam: (lastPage, allPages) => {
      // Check if there are more pages
      if (lastPage?.data?.length === 20) {
        return allPages.length + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
}

export function useProduct(id?: number) {
  return useQuery({
    queryKey: productQueryKeys.detail(id ?? -1),
    queryFn: () => productsAPI.getById(id as number),
    enabled: typeof id === "number" && id > 0,
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => productsAPI.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: productQueryKeys.all }),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      productsAPI.update(id, { ...data, id }),
    onSuccess: () => qc.invalidateQueries({ queryKey: productQueryKeys.all }),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => productsAPI.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: productQueryKeys.all }),
  });
}

export function useProductImageUpload() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
      productsAPI.uploadImage(id, formData),
    onSuccess: () => qc.invalidateQueries({ queryKey: productQueryKeys.all }),
  });
}
