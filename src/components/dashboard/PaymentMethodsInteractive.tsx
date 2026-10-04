import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { usePaymentMethods } from "../../services/queries";
import { useSettings } from "../../context/SettingsContext";
import { formatCurrency } from "../../utils/currencyUtils";
import LoadingSpinner from "../common/LoadingSpinner";

interface PaymentMethodDetail {
  method: string;
  revenue: number;
  count: number;
  percentage: number;
}

const METHOD_COLORS: Record<string, string> = {
  CASH: "#10B981",    // Emerald Green
  CARD: "#3B82F6",    // Blue
  MOBILE: "#8B5CF6",  // Violet
  OTHER: "#F59E0B",   // Amber
};

const METHOD_LABELS: Record<string, { label: string; icon: string }> = {
  CASH: { label: "Cash", icon: "💵" },
  CARD: { label: "Card", icon: "💳" },
  MOBILE: { label: "Mobile Pay", icon: "📱" },
};

export const PaymentMethodsInteractive: React.FC = () => {
  const { settings } = useSettings();

  // Define date range: last 7 days
  const today = new Date();
  const weekAgo = new Date();
  weekAgo.setDate(today.getDate() - 7);

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const { data: response, isLoading } = usePaymentMethods({
    startDate: formatDate(weekAgo),
    endDate: formatDate(today),
  });

  const methodsData: PaymentMethodDetail[] = response?.methods || [];

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex items-center justify-center h-full min-h-[300px]">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  if (methodsData.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col items-center justify-center h-full min-h-[300px] text-slate-400">
        <span className="text-4xl mb-2">💸</span>
        <p className="text-sm font-medium">No transaction payment data</p>
      </div>
    );
  }

  const getMethodColor = (method: string) => {
    return METHOD_COLORS[method] || METHOD_COLORS.OTHER;
  };

  const getMethodInfo = (method: string) => {
    return METHOD_LABELS[method] || { label: method.charAt(0) + method.slice(1).toLowerCase(), icon: "💸" };
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-full flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-bold text-gray-900">Payment Breakdown</h3>
        <p className="mt-1 text-sm text-gray-500 font-medium">Transaction split by payment type (Last 7 days)</p>
      </div>

      <div className="my-6 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* Pie Chart */}
        <div className="relative h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={methodsData as any}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={4}
                dataKey="revenue"
                nameKey="method"
              >
                {methodsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getMethodColor(entry.method)} stroke="none" />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload as PaymentMethodDetail;
                    const info = getMethodInfo(item.method);
                    return (
                      <div className="rounded-xl border border-slate-100 bg-white p-2.5 shadow-lg">
                        <p className="text-xs font-bold text-slate-800 mb-1">
                          {info.icon} {info.label}
                        </p>
                        <p className="text-xs text-slate-500 font-medium">
                          Revenue: <span className="font-extrabold text-slate-800">{formatCurrency(item.revenue, settings)}</span>
                        </p>
                        <p className="text-xs text-slate-500 font-medium">
                          Share: <span className="font-extrabold text-slate-800">{item.percentage.toFixed(1)}%</span>
                        </p>
                        <p className="text-xs text-slate-500 font-medium">
                          Transactions: <span className="font-extrabold text-slate-800">{item.count}</span>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Top Type</span>
            <span className="text-sm font-extrabold text-slate-700 mt-0.5">
              {getMethodInfo(methodsData[0]?.method).label}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2.5">
          {methodsData.map((item, index) => {
            const info = getMethodInfo(item.method);
            return (
              <div key={index} className="flex items-center justify-between p-1 rounded-lg hover:bg-slate-50/50">
                <div className="flex items-center gap-2 truncate">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: getMethodColor(item.method) }}
                  />
                  <span className="text-xs font-semibold text-slate-700 truncate">
                    {info.icon} {info.label}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-slate-800">
                    {formatCurrency(item.revenue, settings)}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium block">
                    {item.percentage.toFixed(1)}% ({item.count} orders)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
