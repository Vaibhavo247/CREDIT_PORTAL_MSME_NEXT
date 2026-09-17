import React, { useState, useEffect } from "react";
import { Inbox } from "lucide-react";
import Spinner from "./Spinner";

export default function Table({
  columns = [],
  dataSource = [],
  rowKey = "id",
  loading = false,
  emptyText = "No data available",
  pageSize = 10,
  className = "",
}) {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to first page when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [dataSource]);

  const getVisiblePages = (current, total) => {
    const delta = 1;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  const totalPages = Math.ceil(dataSource.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = dataSource.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className={`w-full bg-white rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)] flex-1 flex flex-col ${className}`}>
      {/* Table Container with scroll support */}
      <div className={`w-full overflow-x-auto ${currentData.length > 0 ? 'flex-1' : ''}`}>
        <table className="w-full text-left border-collapse min-w-max">
          <thead>
            <tr className="bg-[#f5f5f5]">
              {columns.map((col, idx) => (
                <th
                  key={col.key || col.dataIndex || idx}
                  className="p-3 text-sm font-semibold text-gray-800 text-left capitalize whitespace-nowrap"
                  style={{ width: col.width ? `${col.width}px` : "auto" }}
                  title={typeof col.title === "string" ? col.title : undefined}
                >
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!loading && currentData.length > 0 && (
              currentData.map((record, rIdx) => {
                const key = typeof rowKey === "function" ? rowKey(record) : record[rowKey];
                return (
                  <tr
                    key={key || rIdx}
                    className="hover:bg-gray-50 transition-colors duration-150 group bg-white"
                  >
                    {columns.map((col, cIdx) => {
                      const value = col.dataIndex ? record[col.dataIndex] : undefined;
                      const rendered = col.render ? col.render(value, record, rIdx) : value;

                      return (
                        <td
                          key={col.key || col.dataIndex || cIdx}
                          className="p-3 text-sm font-medium text-gray-800 whitespace-nowrap border-b border-[#eee]"
                          style={{ width: col.width ? `${col.width}px` : "auto" }}
                          title={typeof rendered === "string" || typeof rendered === "number" ? rendered : undefined}
                        >
                          {rendered !== undefined && rendered !== null ? rendered : "-"}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Loading State (Centered Outside Scroll Area) */}
      {loading && (
        <div className="w-full py-12 flex justify-center items-center gap-2 bg-white/50 border-b border-bank-border">
          <Spinner size="medium" />
          <span className="text-sm font-medium text-gray-600">Loading details...</span>
        </div>
      )}

      {/* Empty State (Centered Outside Scroll Area) */}
      {!loading && currentData.length === 0 && (
        <div className="w-full flex-1 flex flex-col items-center justify-center text-gray-400 gap-2 bg-white/50 border-b border-bank-border min-h-[40vh]">
          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center shadow-sm border border-gray-100">
            <Inbox className="w-6 h-6 text-gray-300" strokeWidth={1.5} />
          </div>
          <span className="text-sm font-medium mt-1">{emptyText}</span>
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && dataSource.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between py-4 px-6 bg-white/60 backdrop-blur-md border-t border-gray-100 text-sm select-none gap-4">
          <span className="text-gray-500 font-medium whitespace-nowrap">
            Showing <span className="text-brand-blue font-bold">{startIndex + 1}</span> to{" "}
            <span className="text-brand-blue font-bold">
              {Math.min(endIndex, dataSource.length)}
            </span>{" "}
            of <span className="text-brand-blue font-bold">{dataSource.length}</span> records
          </span>
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-brand-blue hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium cursor-pointer shadow-sm"
            >
              Previous
            </button>
            {getVisiblePages(currentPage, totalPages).map((page, index) => (
              <button
                key={index}
                onClick={() => page !== "..." && handlePageChange(page)}
                disabled={page === "..."}
                className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold transition-all shadow-sm ${
                  page === currentPage
                    ? "bg-brand-blue text-white ring-2 ring-brand-blue/20"
                    : page === "..."
                    ? "bg-transparent text-gray-400 border-none shadow-none cursor-default"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-brand-blue hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium cursor-pointer shadow-sm"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
