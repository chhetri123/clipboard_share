// components/clipboard/PaginationControls.jsx
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const PaginationControls = ({
  currentPage,
  totalPages,
  onPageChange,
  isLoading,
}) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 mt-4 bg-white border-t-4 border-gray-200 sm:px-6">
      <div className="flex items-center">
        <p className="text-sm text-gray-700">
          Page <span className="font-medium">{currentPage}</span> of{" "}
          <span className="font-medium">{totalPages || 1}</span>
        </p>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1 || isLoading}
          className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || isLoading}
          className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
