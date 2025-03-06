import React from 'react';
import clsx from 'clsx';

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  animation?: 'pulse' | 'wave' | 'none';
}

/**
 * ローディング状態を表現するスケルトンコンポーネント
 * 
 * @example
 * // テキストスケルトン
 * <Skeleton variant="text" width="200px" />
 * 
 * // 円形スケルトン（アバターなど）
 * <Skeleton variant="circular" width="40px" height="40px" />
 * 
 * // 長方形スケルトン（カードなど）
 * <Skeleton variant="rectangular" width="100%" height="120px" />
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  width = '100%',
  height = '1rem',
  variant = 'rectangular',
  animation = 'pulse'
}) => {
  return (
    <div
      className={clsx(
        'bg-gray-200 dark:bg-gray-700',
        {
          'rounded-full': variant === 'circular',
          'rounded': variant === 'rectangular',
          'rounded h-4': variant === 'text',
          'animate-pulse': animation === 'pulse',
          'animate-shimmer': animation === 'wave',
        },
        className
      )}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
};

/**
 * テーブル行のスケルトンコンポーネント
 */
export const TableRowSkeleton: React.FC<{ columns: number; className?: string }> = ({ 
  columns, 
  className 
}) => {
  return (
    <div className={clsx('flex items-center space-x-4 py-3', className)}>
      {Array.from({ length: columns }).map((_, index) => (
        <Skeleton 
          key={index} 
          width={`${Math.floor(Math.random() * 40) + 60}px`} 
          height="20px" 
        />
      ))}
    </div>
  );
};

/**
 * カードスケルトンコンポーネント
 */
export const CardSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={clsx('bg-white dark:bg-gray-800 rounded-lg shadow p-4', className)}>
      <Skeleton variant="rectangular" height="120px" className="mb-4" />
      <Skeleton variant="text" width="60%" className="mb-2" />
      <Skeleton variant="text" width="40%" className="mb-4" />
      <div className="flex justify-between">
        <Skeleton variant="text" width="30%" />
        <Skeleton variant="text" width="15%" />
      </div>
    </div>
  );
};

/**
 * フォームスケルトンコンポーネント
 */
export const FormSkeleton: React.FC<{ fields: number; className?: string }> = ({ 
  fields, 
  className 
}) => {
  return (
    <div className={clsx('space-y-4', className)}>
      {Array.from({ length: fields }).map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton variant="text" width="120px" height="16px" />
          <Skeleton variant="rectangular" height="40px" />
        </div>
      ))}
      <Skeleton variant="rectangular" width="120px" height="40px" className="mt-6" />
    </div>
  );
}; 