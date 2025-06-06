import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color: 'success' | 'primary' | 'accent' | 'red';
}

export default function MetricCard({ title, value, change, icon: Icon, color }: MetricCardProps) {
  const isPositive = change.startsWith('+');
  const isNegative = change.startsWith('-');

  const colorClasses = {
    success: 'from-success-500 to-success-600',
    primary: 'from-primary-500 to-primary-600',
    accent: 'from-accent-500 to-accent-600',
    red: 'from-red-500 to-red-600'
  };

  const changeColorClasses = {
    success: isPositive ? 'text-success-600 dark:text-success-400' : isNegative ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400',
    primary: isPositive ? 'text-success-600 dark:text-success-400' : isNegative ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400',
    accent: isPositive ? 'text-success-600 dark:text-success-400' : isNegative ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400',
    red: isNegative ? 'text-success-600 dark:text-success-400' : isPositive ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200/50 dark:border-gray-700/50 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={clsx(
          'p-3 rounded-xl bg-gradient-to-r text-white',
          colorClasses[color]
        )}>
          <Icon size={20} />
        </div>
        <span className={clsx(
          'text-sm font-medium',
          changeColorClasses[color]
        )}>
          {change}
        </span>
      </div>
      
      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{value}</div>
      <div className="text-sm text-gray-600 dark:text-gray-400">{title}</div>
    </div>
  );
}