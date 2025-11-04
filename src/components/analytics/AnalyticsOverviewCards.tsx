import React from "react";
import { OverviewData } from "../../types/analyticsTypes";
import { formatCurrency } from "../../utils/currencyUtils";

interface AnalyticsOverviewCardsProps {
  overviewData: OverviewData;
  settings: any;
}

export const AnalyticsOverviewCards: React.FC<AnalyticsOverviewCardsProps> = ({
  overviewData,
  settings,
}) => {
  return (
    <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Revenue */}
      <div className="rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white shadow-lg">
        <div className="mb-2 flex items-center justify-between">
          <svg
            className="h-8 w-8 opacity-80"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 4c-4.418 0-8 3.582-8 8a8 8 0 0016 0c0-4.418-3.582-8-8-8z"
            />
          </svg>
          {overviewData.growth.revenue !== 0 && (
            <div
              className={`flex items-center text-sm ${
                overviewData.growth.revenue > 0
                  ? "text-green-200"
                  : "text-red-200"
              }`}
            >
              {overviewData.growth.revenue > 0 ? (
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 13l-5-5m0 0l-5 5m5-5v12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 11l5 5m0 0l5-5m-5 5V4"
                  />
                </svg>
              )}
              <span>{Math.abs(overviewData.growth.revenue).toFixed(1)}%</span>
            </div>
          )}
        </div>
        <div className="mb-1 text-3xl font-bold">
          {formatCurrency(
            Number(overviewData.metrics.totalRevenue),
            settings,
            2,
          )}
        </div>
        <div className="text-sm text-blue-100">Total Revenue</div>
      </div>

      {/* Total Sales */}
      <div className="rounded-lg bg-gradient-to-br from-green-500 to-green-600 p-6 text-white shadow-lg">
        <div className="mb-2 flex items-center justify-between">
          <svg
            className="h-8 w-8 opacity-80"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A2 2 0 007.6 19h8.8a2 2 0 001.95-1.7L17 13M7 13V6h10v7"
            />
          </svg>
          {overviewData.growth.sales !== 0 && (
            <div
              className={`flex items-center text-sm ${
                overviewData.growth.sales > 0
                  ? "text-green-200"
                  : "text-red-200"
              }`}
            >
              {overviewData.growth.sales > 0 ? (
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 13l-5-5m0 0l-5 5m5-5v12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 11l5 5m0 0l5-5m-5 5V4"
                  />
                </svg>
              )}
              <span>{Math.abs(overviewData.growth.sales).toFixed(1)}%</span>
            </div>
          )}
        </div>
        <div className="mb-1 text-3xl font-bold">
          {Number(overviewData.metrics.totalSales).toFixed(2)}
        </div>
        <div className="text-sm text-green-100">Total Transactions</div>
      </div>

      {/* Average Order Value */}
      <div className="rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 p-6 text-white shadow-lg">
        <div className="mb-2 flex items-center justify-between">
          <svg
            className="h-8 w-8 opacity-80"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m4 4h-1v-4h-1m-4 4h-1v-4h-1"
            />
          </svg>
        </div>
        <div className="mb-1 text-3xl font-bold">
          {formatCurrency(
            Number(overviewData.metrics.averageOrderValue),
            settings,
            2,
          )}
        </div>
        <div className="text-sm text-purple-100">Average Order Value</div>
      </div>

      {/* Unique Customers */}
      <div className="rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 p-6 text-white shadow-lg">
        <div className="mb-2 flex items-center justify-between">
          <svg
            className="h-8 w-8 opacity-80"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M16 3.13a4 4 0 010 7.75M8 3.13a4 4 0 000 7.75"
            />
          </svg>
        </div>
        <div className="mb-1 text-3xl font-bold">
          {Number(overviewData.metrics.uniqueCustomers).toFixed(2)}
        </div>
        <div className="text-sm text-orange-100">Unique Customers</div>
      </div>
    </div>
  );
};
