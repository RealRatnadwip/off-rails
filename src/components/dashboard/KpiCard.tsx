import React from 'react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  trend?: string;
  isPositive?: boolean;
  statusColor?: 'red' | 'amber' | 'emerald' | 'blue' | 'purple';
  icon: React.ReactNode;
  subtitle?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subValue,
  trend,
  isPositive,
  statusColor = 'blue',
  icon,
  subtitle,
}) => {
  const borderTopMap = {
    red: 'border-t-4 border-t-red-600',
    amber: 'border-t-4 border-t-amber-600',
    emerald: 'border-t-4 border-t-emerald-600',
    blue: 'border-t-4 border-t-[#0B3B60]',
    purple: 'border-t-4 border-t-purple-700',
  };

  const badgeColorMap = {
    red: 'bg-red-50 text-red-800 border-red-200',
    amber: 'bg-amber-50 text-amber-800 border-amber-200',
    emerald: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    blue: 'bg-blue-50 text-[#0B3B60] border-blue-200',
    purple: 'bg-purple-50 text-purple-800 border-purple-200',
  };

  return (
    <div
      className={`bg-white border border-slate-300 rounded shadow-sm p-3 transition-all hover:shadow-md ${borderTopMap[statusColor]}`}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] font-mono uppercase font-bold text-slate-600 tracking-wider">
          {title}
        </span>
        <div className={`p-1 rounded border ${badgeColorMap[statusColor]}`}>
          {icon}
        </div>
      </div>

      <div className="flex items-baseline space-x-1.5">
        <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900 tracking-tight">
          {typeof value === 'number' && value < 10 && value >= 0 ? `0${value}` : value}
        </span>
        {subValue && (
          <span className="text-xs font-mono text-slate-500 font-bold">{subValue}</span>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-200">
        <span className="text-slate-500 truncate font-medium">{subtitle || 'Control Desk Metric'}</span>
        {trend && (
          <span
            className={`font-mono text-[10px] font-bold ${
              isPositive ? 'text-emerald-700' : 'text-amber-800'
            }`}
          >
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};
