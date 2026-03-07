import React from 'react';
import { cn } from '../ui/utils';

export type StatusType = 'active' | 'pending' | 'completed' | 'failed' | 'signing';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const styles = {
    active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    completed: 'bg-blue-50 text-blue-700 border-blue-200',
    failed: 'bg-red-50 text-red-700 border-red-200',
    signing: 'bg-slate-50 text-slate-700 border-slate-200 animate-pulse',
  };

  return (
    <span className={cn(
      "px-2 py-1 text-xs font-medium border rounded-full capitalize",
      styles[status] || styles.pending,
      className
    )}>
      {status}
    </span>
  );
};
