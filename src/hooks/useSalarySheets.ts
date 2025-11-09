import { useState } from "react";
import {
  useSalarySheets as useSalarySheetsQuery,
  useEmployeesForSalary,
} from "../services/queries/salaryQueries";
import { SalarySheet } from "../services/api/salarySheetsAPI";

export function useSalarySheets() {
  // Month/year filters (UI state)
  const [month, setMonth] = useState<number | "">("");
  const [year, setYear] = useState<number | "">("");

  // Fetch salary sheets with filters
  const {
    data: salarySheets = [],
    isLoading: loading,
    refetch: refetchSalarySheets,
  } = useSalarySheetsQuery(month, year);

  // Fetch employees
  const {
    data: employees = [],
    isLoading: empLoading,
    error: empErrorObj,
    refetch: fetchEmployees,
  } = useEmployeesForSalary();

  const empError = empErrorObj ? "Failed to load employees" : null;

  // For backward compatibility - allow setting sheets directly
  const setSalarySheets = (
    _sheets: SalarySheet[] | ((prev: SalarySheet[]) => SalarySheet[]),
  ) => {
    // Note: This won't actually work with React Query cache
    // Consumers should use mutations instead
    console.warn("setSalarySheets is deprecated - use mutations instead");
  };

  // For backward compatibility - allow manual loading state
  const setLoading = (_value: boolean) => {
    console.warn(
      "setLoading is deprecated - React Query manages this automatically",
    );
  };

  return {
    salarySheets,
    setSalarySheets,
    loading,
    setLoading,
    employees,
    empLoading,
    empError,
    fetchEmployees: () => fetchEmployees(),
    fetchSalarySheets: (newMonth?: number | "", newYear?: number | "") => {
      // Update filters if provided
      if (newMonth !== undefined) setMonth(newMonth);
      if (newYear !== undefined) setYear(newYear);
      // Note: Refetch will happen automatically due to query key change
      // But we can also trigger manual refetch
      refetchSalarySheets();
    },
    // Expose filters for consumers that need them
    month,
    setMonth,
    year,
    setYear,
  };
}
