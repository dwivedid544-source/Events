import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export const DataTable = ({
  columns = [],
  data = [],
  searchPlaceholder = 'Search records...',
  filterField = null,
  filterOptions = [],
  actionButton = null,
  onRowClick = null
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter & Search Logic
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Status Filter
      if (filterField && selectedFilter !== 'ALL') {
        const itemVal = String(item[filterField] || '').toUpperCase();
        if (itemVal !== selectedFilter.toUpperCase()) return false;
      }

      // Search Query Filter
      if (!searchTerm) return true;
      const query = searchTerm.toLowerCase();
      return Object.values(item).some(
        (val) => val && String(val).toLowerCase().includes(query)
      );
    });
  }, [data, searchTerm, filterField, selectedFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  const renderBadge = (status) => {
    if (!status) return null;
    const s = String(status).toUpperCase();

    let colorClass = 'bg-gray-100 text-gray-800 border-gray-300';
    let dotClass = 'bg-gray-400';

    if (['ACTIVE', 'CONFIRMED', 'CHECKED IN', 'APPROVED', 'PUBLISHED', 'PAID', 'DELIVERED'].includes(s)) {
      colorClass = 'bg-emerald-100/80 text-emerald-900 border-emerald-300';
      dotClass = 'bg-emerald-500';
    } else if (['PENDING', 'PROCESSING', 'UNDER REVIEW', 'SHIPPED', 'NOT ARRIVED'].includes(s)) {
      colorClass = 'bg-amber-100/80 text-amber-900 border-amber-300';
      dotClass = 'bg-amber-500';
    } else if (['EXPIRED', 'CANCELLED', 'REJECTED', 'UNPAID'].includes(s)) {
      colorClass = 'bg-red-100/80 text-red-900 border-red-300';
      dotClass = 'bg-red-500';
    } else if (['REGISTRATION OPEN', 'UPCOMING'].includes(s)) {
      colorClass = 'bg-tan-100 text-tan-950 border-tan-400';
      dotClass = 'bg-tan-600';
    }

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-black border ${colorClass}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`}></span>
        <span>{status}</span>
      </span>
    );
  };

  return (
    <div className="bg-surface-lowest rounded-2xl border border-surface-border shadow-ambient overflow-hidden flex flex-col">
      {/* Table Header Toolbar */}
      <div className="p-4 border-b border-surface-border flex flex-col sm:flex-row items-center justify-between gap-3 bg-surface-lowest">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-light" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-3.5 py-2 text-xs bg-surface-low border border-surface-border rounded-xl focus:outline-none focus:border-forest-800 font-medium transition-colors"
          />
        </div>

        {/* Filter Pills & Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          {filterField && filterOptions.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              <span className="text-[10px] uppercase font-black text-charcoal-light mr-1 flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5" /> Filter:
              </span>
              <button
                onClick={() => { setSelectedFilter('ALL'); setCurrentPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedFilter === 'ALL'
                    ? 'bg-forest-800 text-white font-extrabold shadow-xs'
                    : 'bg-surface-low text-charcoal hover:bg-surface-container'
                }`}
              >
                All
              </button>
              {filterOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => { setSelectedFilter(opt); setCurrentPage(1); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    selectedFilter.toUpperCase() === opt.toUpperCase()
                      ? 'bg-forest-800 text-white font-extrabold shadow-xs'
                      : 'bg-surface-low text-charcoal hover:bg-surface-container'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {actionButton}
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-surface-low/80 text-charcoal-muted uppercase text-[10px] font-black tracking-wider border-b border-surface-border">
              {columns.map((col, idx) => (
                <th key={idx} className="py-3.5 px-4">
                  <div className="flex items-center gap-1">
                    <span>{col.header}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rIdx) => (
                <tr
                  key={row.id || rIdx}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`hover:bg-tan-50/40 transition-colors ${
                    onRowClick ? 'cursor-pointer' : ''
                  }`}
                >
                  {columns.map((col, cIdx) => (
                    <td key={cIdx} className="py-3.5 px-4 text-charcoal font-medium">
                      {col.render ? (
                        col.render(row)
                      ) : col.isStatus ? (
                        renderBadge(row[col.accessor])
                      ) : (
                        row[col.accessor] || '—'
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-charcoal-light">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <span className="text-base font-extrabold text-forest-800">No records found</span>
                    <span className="text-xs text-charcoal-light">Try modifying your search query or filter selection.</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Table Pagination Footer */}
      <div className="p-3.5 border-t border-surface-border bg-surface-low/40 flex items-center justify-between text-xs text-charcoal-muted">
        <div className="font-semibold">
          Showing {filteredData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
          {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} records
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-surface-border bg-surface-lowest text-charcoal hover:bg-surface-low disabled:opacity-40 shadow-xs"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-extrabold text-forest-800 px-1">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-surface-border bg-surface-lowest text-charcoal hover:bg-surface-low disabled:opacity-40 shadow-xs"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
