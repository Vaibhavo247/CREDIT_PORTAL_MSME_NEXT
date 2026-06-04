"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global UI Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-3">Something went wrong!</h1>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          {error?.message || "An unexpected error occurred while loading this page. Our team has been notified."}
        </p>
        <button
          onClick={() => reset()}
          className="flex items-center gap-2 px-6 py-3 bg-brand-orange hover:bg-brand-orange-hover active:scale-95 text-white font-semibold rounded-2xl shadow-lg shadow-brand-orange/20 transition-all duration-200"
        >
          <RefreshCcw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    </div>
  );
}
