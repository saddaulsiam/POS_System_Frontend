import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { expensesAPI, Expense, ExpenseCategory } from '../api/expensesAPI';

export const expenseKeys = {
  all: ['expenses'] as const,
  lists: () => [...expenseKeys.all, 'list'] as const,
  list: (filters: string) => [...expenseKeys.lists(), { filters }] as const,
  categories: ['expenseCategories'] as const,
};

// Categories
export const useExpenseCategories = () => {
  return useQuery({
    queryKey: expenseKeys.categories,
    queryFn: () => expensesAPI.getCategories(),
  });
};

export const useCreateExpenseCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: expensesAPI.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.categories });
    },
  });
};

export const useUpdateExpenseCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { name?: string; isActive?: boolean } }) =>
      expensesAPI.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.categories });
    },
  });
};

export const useDeleteExpenseCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: expensesAPI.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.categories });
    },
  });
};

// Expenses
export const useExpenses = (params?: { page?: number; limit?: number; categoryId?: number; startDate?: string; endDate?: string }) => {
  return useQuery({
    queryKey: expenseKeys.list(JSON.stringify(params)),
    queryFn: () => expensesAPI.getExpenses(params),
  });
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: expensesAPI.createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
    },
  });
};

export const useUpdateExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { categoryId?: number; amount?: number; date?: string; referenceNo?: string; note?: string } }) =>
      expensesAPI.updateExpense(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
    },
  });
};

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: expensesAPI.deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
    },
  });
};
