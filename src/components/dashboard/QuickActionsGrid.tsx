import React from "react";
import { Link } from "react-router-dom";

interface QuickAction {
  name: string;
  href: string;
  icon: string;
  color: string;
  description: string;
}

interface QuickActionsGridProps {
  actions: QuickAction[];
}

export const QuickActionsGrid: React.FC<QuickActionsGridProps> = ({
  actions,
}) => {
  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        ⚡ Quick Actions
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Link
            key={action.name}
            to={action.href}
            className="group flex flex-col items-center rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
          >
            <div className="mb-2 text-2xl transition-transform group-hover:scale-110">
              {action.icon}
            </div>
            <div className="text-center text-sm font-medium text-gray-900">
              {action.name}
            </div>
            <div className="mt-1 text-center text-xs text-gray-500">
              {action.description}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
