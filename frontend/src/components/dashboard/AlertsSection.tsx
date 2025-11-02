import React from "react";
import { Link } from "react-router-dom";

interface AlertsSectionProps {
  lowStockCount: number;
  outOfStockCount: number;
}

export const AlertsSection: React.FC<AlertsSectionProps> = ({
  lowStockCount,
  outOfStockCount,
}) => {
  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        🔔 Alerts & Notifications
      </h3>
      <div className="space-y-3">
        {lowStockCount > 0 && (
          <div className="flex items-center rounded-lg border border-yellow-200 bg-yellow-50 p-3">
            <div className="mr-3 text-yellow-600">⚠️</div>
            <div>
              <p className="font-medium text-yellow-800">Low Stock Alert</p>
              <p className="text-sm text-yellow-700">
                {lowStockCount} products are running low on stock
              </p>
            </div>
            <Link
              to="/inventory"
              className="ml-auto text-yellow-600 hover:text-yellow-800"
            >
              View →
            </Link>
          </div>
        )}

        {outOfStockCount > 0 && (
          <div className="flex items-center rounded-lg border border-red-200 bg-red-50 p-3">
            <div className="mr-3 text-red-600">🚫</div>
            <div>
              <p className="font-medium text-red-800">Out of Stock</p>
              <p className="text-sm text-red-700">
                {outOfStockCount} products are currently out of stock
              </p>
            </div>
            <Link
              to="/inventory"
              className="ml-auto text-red-600 hover:text-red-800"
            >
              Restock →
            </Link>
          </div>
        )}

        <div className="flex items-center rounded-lg border border-green-200 bg-green-50 p-3">
          <div className="mr-3 text-green-600">✅</div>
          <div>
            <p className="font-medium text-green-800">System Status</p>
            <p className="text-sm text-green-700">All systems operational</p>
          </div>
        </div>
      </div>
    </div>
  );
};
