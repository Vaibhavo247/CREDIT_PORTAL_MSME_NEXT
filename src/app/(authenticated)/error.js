"use client";

import React, { useEffect } from "react";
import Button from "@/components/ui/Button";
import { AlertCircle } from "lucide-react";

export default function AuthenticatedError({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Dashboard Authenticated Area Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-white rounded-2xl border border-red-100 shadow-sm animate-fade-in">
      <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
        <AlertCircle className="w-8 h-8 text-red-500" />
      </div>
      
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        Something went wrong
      </h2>
      
      <p className="text-sm text-gray-500 max-w-md mb-8">
        An error occurred while loading this section of the dashboard. Your navigation and sidebar are still active.
      </p>

      <div className="flex gap-4">
        <Button variant="outline" onClick={() => window.location.href = "/dashboard"}>
          Go to Dashboard
        </Button>
        <Button variant="primary" onClick={() => reset()}>
          Try Again
        </Button>
      </div>
    </div>
  );
}
