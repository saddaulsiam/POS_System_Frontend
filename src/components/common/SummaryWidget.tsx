import React from 'react';

export type CardVariant = 'default' | 'green' | 'red' | 'blue' | 'purple' | 'amber';

export interface TrendBadgeProps {
  current: number;
  previous: number;
  fmt?: (val: number) => string;
}

export const TrendBadge: React.FC<TrendBadgeProps> = ({ current, previous }) => {
  if (previous === 0 && current === 0) return <span className="text-xs text-gray-400">No prior data</span>;
  if (previous === 0) return <span className="inline-flex items-center text-xs font-semibold text-green-600">● New</span>;

  const change = ((current - previous) / previous) * 100;
  const isPositive = change >= 0;

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold ${isPositive ? 'text-emerald-600 bg-emerald-100/50 px-1.5 py-0.5 rounded' : 'text-rose-600 bg-rose-100/50 px-1.5 py-0.5 rounded'}`}>
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ transform: isPositive ? 'none' : 'rotate(180deg)' }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
      </svg>
      {Math.abs(change).toFixed(1)}% vs prior
    </span>
  );
};

export interface SummaryWidgetProps {
  title: string;
  value: string | number;
  subtitle?: string;
  variant?: CardVariant;
  icon?: string;
  trend?: TrendBadgeProps;
}

export const SummaryWidget: React.FC<SummaryWidgetProps> = ({ title, value, subtitle, variant = 'default', icon, trend }) => {
  const variantStyles: Record<CardVariant, string> = {
    default: 'bg-white border-gray-200',
    green: 'bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200',
    red: 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200',
    blue: 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200',
    purple: 'bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200',
    amber: 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200',
  };
  const titleColors: Record<CardVariant, string> = {
    default: 'text-gray-500',
    green: 'text-emerald-700',
    red: 'text-red-600',
    blue: 'text-blue-700',
    purple: 'text-purple-700',
    amber: 'text-amber-700',
  };
  const valueColors: Record<CardVariant, string> = {
    default: 'text-gray-900',
    green: 'text-emerald-900',
    red: 'text-red-700',
    blue: 'text-blue-900',
    purple: 'text-purple-900',
    amber: 'text-amber-900',
  };

  return (
    <div className={`p-5 rounded-xl shadow-sm border transition-all hover:shadow-md print:border-gray-300 print:shadow-none ${variantStyles[variant]}`}>
      <div className="flex items-start justify-between">
        <p className={`text-xs font-bold uppercase tracking-wider ${titleColors[variant]}`}>{title}</p>
        {icon && <span className="text-lg">{icon}</span>}
      </div>
      <p className={`text-2xl font-extrabold mt-2 ${valueColors[variant]}`}>{value}</p>
      <div className="flex items-center justify-between mt-1.5 min-h-[20px]">
        {subtitle ? <p className="text-xs text-gray-500">{subtitle}</p> : <div />}
        {trend && <TrendBadge current={trend.current} previous={trend.previous} fmt={trend.fmt} />}
      </div>
    </div>
  );
};
