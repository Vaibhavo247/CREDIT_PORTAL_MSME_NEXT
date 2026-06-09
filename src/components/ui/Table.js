import React, { useState, useEffect } from "react";
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
    <div className="w-full bg-white rounded-2xl shadow-sm border border-bank-border overflow-hidden">
      {/* Table Container with scroll support */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-max">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-xs font-semibold uppercase tracking-wider">
              {columns.map((col, idx) => (
                <th
                  key={col.key || col.dataIndex || idx}
                  className={`py-4 px-6 text-sm font-medium ${col.fixed === "left" ? "sticky left-0 bg-gray-100 z-10" : ""} ${col.fixed === "right" ? "sticky right-0 bg-gray-100 z-10" : ""}`}
                  style={{ width: col.width ? `${col.width}px` : "auto" }}
                >
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-bank-border text-sm text-gray-700">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center">
                  <div className="flex justify-center items-center gap-2">
                    <Spinner size="medium" />
                    <span>Loading details...</span>
                  </div>
                </td>
              </tr>
            ) : currentData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-12 text-center text-gray-400 font-medium"
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              currentData.map((record, rIdx) => {
                const key = typeof rowKey === "function" ? rowKey(record) : record[rowKey];
                return (
                  <tr
                    key={key || rIdx}
                    className="transition-colors duration-150 group hover:bg-orange-50/40"
                  >
                    {columns.map((col, cIdx) => {
                      const value = col.dataIndex ? record[col.dataIndex] : undefined;
                      const rendered = col.render ? col.render(value, record, rIdx) : value;

                      return (
                        <td
                          key={col.key || col.dataIndex || cIdx}
                          className={`py-3 px-6 whitespace-nowrap align-middle border-b border-gray-100 ${col.fixed === "left" ? "sticky left-0 bg-white z-10 shadow-[2px_0_5px_rgba(0,0,0,0.02)]" : ""} ${col.fixed === "right" ? "sticky right-0 bg-white z-10 shadow-[-2px_0_5px_rgba(0,0,0,0.02)]" : ""}`}
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

      {/* Pagination Controls */}
      {!loading && dataSource.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-gray-50 border-t border-bank-border text-sm select-none gap-4">
          <span className="text-gray-500 font-medium whitespace-nowrap">
            Showing <span className="text-gray-900">{startIndex + 1}</span> to{" "}
            <span className="text-gray-900">
              {Math.min(endIndex, dataSource.length)}
            </span>{" "}
            of <span className="text-gray-900">{dataSource.length}</span> records
          </span>
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-2 sm:px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium cursor-pointer"
            >
              Previous
            </button>
            {getVisiblePages(currentPage, totalPages).map((page, index) => (
              <button
                key={index}
                onClick={() => page !== "..." && handlePageChange(page)}
                disabled={page === "..."}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-medium ${
                  page === "..."
                    ? "cursor-default text-gray-400"
                    : "cursor-pointer"
                } ${
                  currentPage === page
                    ? "bg-brand-orange text-white"
                    : page !== "..."
                    ? "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                    : ""
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-2 sm:px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
