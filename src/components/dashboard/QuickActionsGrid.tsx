import React from "react";
import { Link } from "react-router-dom";

interface QuickAction {
  name: string;
  href: string;
  icon: string;
  color: string;
  description: string;
  gradient?: string;
}

interface QuickActionsGridProps {
  actions: QuickAction[];
}

export const QuickActionsGrid: React.FC<QuickActionsGridProps> = ({ actions }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span>⚡</span> Quick Actions
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action) => (
          <Link
            key={action.name}
            to={action.href}
            className={`group relative overflow-hidden flex flex-col items-center rounded-xl p-5 transition-all hover:shadow-md border border-gray-100 ${
              action.gradient ? `bg-gradient-to-br ${action.gradient} text-white` : 'bg-gray-50 hover:bg-white'
            }`}
          >
            {action.gradient && (
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
            )}
            <div className={`mb-3 text-3xl transition-transform group-hover:scale-110 group-hover:-translate-y-1`}>
              {action.icon}
            </div>
            <div className={`text-center font-bold ${action.gradient ? 'text-white' : 'text-gray-900'}`}>
              {action.name}
            </div>
            <div className={`mt-1 text-center text-xs font-medium ${action.gradient ? 'text-white/80' : 'text-gray-500'}`}>
              {action.description}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
