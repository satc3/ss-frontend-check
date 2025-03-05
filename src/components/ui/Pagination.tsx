import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  // ページ番号の配列を生成
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // 全ページ数が表示上限以下の場合は全て表示
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // 現在のページを中心に表示
      let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
      let endPage = startPage + maxPagesToShow - 1;
      
      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // 最初と最後のページへのジャンプを追加
      if (startPage > 1) {
        pageNumbers.unshift(-1); // -1は省略記号を表示するための特別な値
        pageNumbers.unshift(1);
      }
      
      if (endPage < totalPages) {
        pageNumbers.push(-2); // -2は省略記号を表示するための特別な値
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  if (totalPages <= 1) return null;

  return (
    <nav className="flex items-center justify-center">
      <ul className="flex space-x-1">
        {/* 前のページボタン */}
        <li>
          <button
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex items-center justify-center w-10 h-10 rounded-md ${
              currentPage === 1
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
            aria-label="前のページ"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
        </li>

        {/* ページ番号 */}
        {getPageNumbers().map((pageNumber, index) => (
          <li key={index}>
            {pageNumber === -1 || pageNumber === -2 ? (
              <span className="flex items-center justify-center w-10 h-10 text-gray-500">...</span>
            ) : (
              <button
                onClick={() => onPageChange(pageNumber)}
                className={`flex items-center justify-center w-10 h-10 rounded-md ${
                  currentPage === pageNumber
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
                aria-label={`${pageNumber}ページ目`}
                aria-current={currentPage === pageNumber ? 'page' : undefined}
              >
                {pageNumber}
              </button>
            )}
          </li>
        ))}

        {/* 次のページボタン */}
        <li>
          <button
            onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex items-center justify-center w-10 h-10 rounded-md ${
              currentPage === totalPages
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
            aria-label="次のページ"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination; 