import { ReactNode } from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';

interface AlertProps {
  children?: ReactNode;
  message?: string;
  type?: 'success' | 'error';
  className?: string;
}

export const Alert = ({ children, message, type = 'success', className }: AlertProps) => {
  const Icon = type === 'success' ? CheckCircleIcon : XCircleIcon;
  const colorClasses = type === 'success'
    ? 'bg-green-50 text-green-800'
    : 'bg-red-50 text-red-800';
  const iconColorClass = type === 'success' ? 'text-green-400' : 'text-red-400';

  const content = message || children;

  return (
    <div className={clsx(`rounded-md p-4 ${colorClasses}`, className)}>
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${iconColorClass}`} aria-hidden="true" />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium">{content}</p>
        </div>
      </div>
    </div>
  );
}; 