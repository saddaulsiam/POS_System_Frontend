import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { employeesAPI } from "../index";

export const employeeQueryKeys = {
  list: (params?: any) => ["employees", params] as const,
  detail: (id: number) => ["employee", id] as const,
};

export function useEmployees(params?: any) {
  return useQuery({
    queryKey: employeeQueryKeys.list(params),
    queryFn: () => employeesAPI.getAll(params),
  });
}

export function useEmployee(id?: number) {
  return useQuery({
    queryKey: employeeQueryKeys.detail(id ?? -1),
    queryFn: () => employeesAPI.getById(id as number),
    enabled: typeof id === "number" && id > 0,
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => employeesAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      employeesAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => employeesAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}

export function useUpdateEmployeePin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, pinCode }: { id: number; pinCode: string }) =>
      employeesAPI.resetPin(id, pinCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}
