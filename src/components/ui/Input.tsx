import { forwardRef } from 'react';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={clsx(
            'block w-full rounded-lg px-4 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset',
            'placeholder:text-gray-400 sm:text-sm sm:leading-6',
            'focus:ring-2 focus:ring-inset focus:ring-indigo-600',
            error
              ? 'ring-red-300 focus:ring-red-500'
              : 'ring-gray-300',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }
); 