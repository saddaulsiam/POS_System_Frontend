import { useState, useEffect, useCallback } from "react";
import { employeesAPI } from "../services/api/employeesAPI";
import { salarySheetsAPI, SalarySheet } from "../services/api/salarySheetsAPI";
import { Employee } from "../types/employeeTypes";

export function useSalarySheets() {
  const [salarySheets, setSalarySheets] = useState<SalarySheet[]>([]);
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [empLoading, setEmpLoading] = useState(false);
  const [empError, setEmpError] = useState<string | null>(null);

  const fetchEmployees = useCallback(async () => {
    setEmpLoading(true);
    setEmpError(null);
    try {
      const res = await employeesAPI.getAll({ limit: 1000 });
      setEmployees(res.data);
    } catch (err: any) {
      setEmpError("Failed to load employees");
    } finally {
      setEmpLoading(false);
    }
  }, []);

  const fetchSalarySheets = useCallback(
    async (month?: number | "", year?: number | "") => {
      setLoading(true);
      try {
        const params: any = {};
        if (month !== "" && month !== undefined) params.month = month;
        if (year !== "" && year !== undefined) params.year = year;
        if ("employeeId" in params) delete params.employeeId;
        const res = await salarySheetsAPI.getAll(params);
        setSalarySheets(res);
      } catch (err: any) {
        // error handled in page
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  return {
    salarySheets,
    setSalarySheets,
    loading,
    setLoading,
    employees,
    empLoading,
    empError,
    fetchEmployees,
    fetchSalarySheets,
  };
}
