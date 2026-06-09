"use client";

import React from "react";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center animate-fade-in">
        
        {/* Bank Logo */}
        <div className="mb-8">
          <img
            src="/image.png"
            className="h-12 w-auto object-contain mx-auto"
            alt="Suryoday Bank Logo"
          />
        </div>

        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
        
        <p className="text-gray-500 text-sm mb-8 leading-relaxed px-4">
          The requested resource could not be located on this server. It may have been moved, deleted, or you may have followed an invalid link.
        </p>
        
        <div className="w-full border-t border-gray-100 pt-6">
          <Button
            onClick={() => router.push("/")}
            variant="primary"
            className="w-full flex items-center justify-center gap-2 py-3 shadow-none hover:shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Login Portal
          </Button>
        </div>
        
        <div className="mt-8 text-xs text-gray-400 font-medium">
          Error Code: 404 | Suryoday Bank Security
        </div>
      </div>
    </div>
  );
}
