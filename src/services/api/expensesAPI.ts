import api from '../api';

export interface ExpenseCategory {
  id: number;
  storeId: number;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: number;
  storeId: number;
  categoryId: number;
  recordedBy: number;
  amount: number;
  date: string;
  referenceNo?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
  category: ExpenseCategory;
  employee: {
    name: string;
  };
}

export const expensesAPI = {
  // Categories
  getCategories: () => api.get<ExpenseCategory[]>('/expenses/categories').then((res: any) => res.data),
  createCategory: (data: { name: string; isActive?: boolean }) =>
    api.post<ExpenseCategory>('/expenses/categories', data).then((res: any) => res.data),
  updateCategory: (id: number, data: { name?: string; isActive?: boolean }) =>
    api.put<ExpenseCategory>(`/expenses/categories/${id}`, data).then((res: any) => res.data),
  deleteCategory: (id: number) => api.delete(`/expenses/categories/${id}`).then((res: any) => res.data),

  // Expenses
  getExpenses: (params?: { page?: number; limit?: number; categoryId?: number; startDate?: string; endDate?: string }) =>
    api.get<{ expenses: Expense[]; total: number; pages: number }>('/expenses', { params }).then((res: any) => res.data),
  createExpense: (data: { categoryId: number; amount: number; date?: string; referenceNo?: string; note?: string }) =>
    api.post<Expense>('/expenses', data).then((res: any) => res.data),
  updateExpense: (id: number, data: { categoryId?: number; amount?: number; date?: string; referenceNo?: string; note?: string }) =>
    api.put<Expense>(`/expenses/${id}`, data).then((res: any) => res.data),
  deleteExpense: (id: number) => api.delete(`/expenses/${id}`).then((res: any) => res.data),
};
