import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { salarySheetsAPI } from "../api/salarySheetsAPI";
import { employeesAPI } from "../api/employeesAPI";

// Query Keys
export const salaryKeys = {
  all: ["salary-sheets"] as const,
  lists: () => [...salaryKeys.all, "list"] as const,
  list: (filters?: { month?: number | ""; year?: number | "" }) =>
    [...salaryKeys.lists(), filters] as const,
};

export const employeeKeys = {
  all: ["employees"] as const,
  lists: () => [...employeeKeys.all, "list"] as const,
  list: (filters?: any) => [...employeeKeys.lists(), filters] as const,
};

/**
 * Hook to fetch salary sheets with optional month/year filters
 */
export function useSalarySheets(month?: number | "", year?: number | "") {
  return useQuery({
    queryKey: salaryKeys.list({ month, year }),
    queryFn: async () => {
      const params: any = {};
      if (month !== "" && month !== undefined) params.month = month;
      if (year !== "" && year !== undefined) params.year = year;
      return await salarySheetsAPI.getAll(params);
    },
  });
}

/**
 * Hook to fetch employees (for salary sheet generation)
 */
export function useEmployeesForSalary() {
  return useQuery({
    queryKey: employeeKeys.list({ limit: 1000 }),
    queryFn: async () => {
      const res = await employeesAPI.getAll({ limit: 1000 });
      return res.data;
    },
  });
}

/**
 * Hook to create a salary sheet
 */
export function useCreateSalarySheet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Parameters<typeof salarySheetsAPI.create>[0]) =>
      salarySheetsAPI.create(data),
    onSuccess: () => {
      // Invalidate and refetch salary sheets
      queryClient.invalidateQueries({ queryKey: salaryKeys.all });
    },
  });
}

/**
 * Hook to update a salary sheet
 */
export function useUpdateSalarySheet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Parameters<typeof salarySheetsAPI.update>[1];
    }) => salarySheetsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: salaryKeys.all });
    },
  });
}

/**
 * Hook to mark a salary sheet as paid
 */
export function useMarkSalaryAsPaid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => salarySheetsAPI.markAsPaid(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: salaryKeys.all });
    },
  });
}

/**
 * Hook to delete a salary sheet
 */
export function useDeleteSalarySheet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => salarySheetsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: salaryKeys.all });
    },
  });
}

/**
 * Hook to bulk generate salary sheets for a month/year
 */
export function useBulkGenerateSalarySheets() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { month: number; year: number }) =>
      salarySheetsAPI.bulkGenerate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: salaryKeys.all });
    },
  });
}
