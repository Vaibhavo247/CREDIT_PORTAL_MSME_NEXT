import React, { useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({
  isOpen = false,
  onClose,
  title = "",
  children,
  footer,
  okText = "Confirm",
  cancelText = "Cancel",
  onOk,
  okLoading = false,
  width = "max-w-md", // Tailwind max-w classes: max-w-sm, max-w-md, max-w-lg, max-w-xl, max-w-2xl
}) {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Glassmorphic Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Content Box */}
      <div
        className={`relative w-full ${width} bg-white rounded-2xl shadow-xl border border-bank-border z-10 transform scale-100 transition-all duration-300 overflow-hidden flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-bank-border bg-gray-50">
          <h3 className="text-lg font-semibold text-brand-blue">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 overflow-y-auto max-h-[70vh] text-sm text-gray-600 leading-relaxed">
          {children}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-bank-border bg-gray-50 flex items-center justify-end gap-3">
          {footer !== undefined ? (
            footer
          ) : (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-200 bg-white text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors duration-150 text-sm cursor-pointer"
              >
                {cancelText}
              </button>
              {onOk && (
                <button
                  onClick={onOk}
                  disabled={okLoading}
                  className={`flex items-center justify-center gap-2 px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white font-medium rounded-xl transition-colors duration-150 text-sm shadow-sm ${
                    okLoading ? "opacity-75 cursor-wait" : "cursor-pointer"
                  }`}
                >
                  {okLoading && (
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {okText}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
