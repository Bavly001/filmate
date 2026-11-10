'use client';

import React from 'react';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isFetching?: boolean;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isFetching = false,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    if (start > 2) pages.push('...');

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 1) pages.push('...');

    pages.push(totalPages);
    return pages;
  };

  const pages = getPageNumbers();

  const handlePageClick = (page: number) => {
    if (page === currentPage || page < 1 || page > totalPages) return;
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-6 border-t border-zinc-800/80"
    >
      <div className="text-xs text-zinc-400 order-2 sm:order-1">
        Page <span className="font-semibold text-white">{currentPage}</span> of{' '}
        <span className="font-semibold text-white">{totalPages}</span>
        {isFetching && (
          <span className="ml-2 text-cyan-400 inline-flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
            Updating...
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5 order-1 sm:order-2">
        {/* Previous Button */}
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage <= 1 || isFetching}
          aria-label="Previous Page"
          className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold bg-zinc-800/80 hover:bg-zinc-700/80 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors border border-white/5"
        >
          <IoChevronBack size="1.1em" />
          <span className="hidden sm:inline">Prev</span>
        </button>

        {/* Numeric page buttons */}
        <div className="flex items-center gap-1">
          {pages.map((p, idx) => {
            if (p === '...') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 py-1 text-xs text-zinc-500 font-bold tracking-widest"
                >
                  •••
                </span>
              );
            }

            const pageNum = Number(p);
            const isActive = pageNum === currentPage;

            return (
              <button
                key={pageNum}
                onClick={() => handlePageClick(pageNum)}
                disabled={isFetching}
                aria-current={isActive ? 'page' : undefined}
                className={`min-w-[36px] h-9 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500 text-zinc-950 shadow-md shadow-cyan-500/20'
                    : 'bg-zinc-800/60 hover:bg-zinc-700/70 text-zinc-300 hover:text-white border border-white/5'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage >= totalPages || isFetching}
          aria-label="Next Page"
          className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold bg-zinc-800/80 hover:bg-zinc-700/80 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors border border-white/5"
        >
          <span className="hidden sm:inline">Next</span>
          <IoChevronForward size="1.1em" />
        </button>
      </div>
    </nav>
  );
}
