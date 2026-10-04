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
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 className="mb-4 text-lg font-bold text-gray-900 flex items-center gap-2">
        <span>🔔</span> Alerts & Notifications
      </h3>
      <div className="space-y-3">
        {lowStockCount > 0 && (
          <div className="flex items-center rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-amber-100/50 p-4 transition-all hover:shadow-sm">
            <div className="mr-3 text-amber-600 text-xl">⚠️</div>
            <div>
              <p className="font-bold text-amber-900">Low Stock Alert</p>
              <p className="text-sm font-medium text-amber-700 mt-0.5">
                {lowStockCount} products are running low on stock
              </p>
            </div>
            <Link
              to="/inventory"
              className="ml-auto text-amber-700 bg-white/60 hover:bg-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm transition-colors"
            >
              View →
            </Link>
          </div>
        )}

        {outOfStockCount > 0 && (
          <div className="flex items-center rounded-xl border border-rose-200 bg-gradient-to-r from-rose-50 to-rose-100/50 p-4 transition-all hover:shadow-sm">
            <div className="mr-3 text-rose-600 text-xl">🚫</div>
            <div>
              <p className="font-bold text-rose-900">Out of Stock</p>
              <p className="text-sm font-medium text-rose-700 mt-0.5">
                {outOfStockCount} products are currently out of stock
              </p>
            </div>
            <Link
              to="/inventory"
              className="ml-auto text-rose-700 bg-white/60 hover:bg-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm transition-colors"
            >
              Restock →
            </Link>
          </div>
        )}

        <div className="flex items-center rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-emerald-100/50 p-4">
          <div className="mr-3 text-emerald-600 text-xl">✅</div>
          <div>
            <p className="font-bold text-emerald-900">System Status</p>
            <p className="text-sm font-medium text-emerald-700 mt-0.5">All systems operational</p>
          </div>
        </div>
      </div>
    </div>
  );
};
