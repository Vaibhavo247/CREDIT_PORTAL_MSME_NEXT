"use client";

import React from "react";
import Button from "@/components/ui/Button";
import { ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { logoutAction } from "@/app/actions";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 text-center">
      <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6 shadow-sm border border-red-200 animate-pulse">
        <ShieldAlert className="w-12 h-12 text-red-600" />
      </div>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">
        Access Denied
      </h1>
      
      <p className="text-base text-gray-600 max-w-md mb-8 leading-relaxed">
        Your current role does not have permission to view this page. If you believe this is an error, please contact your system administrator.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <Button 
          variant="outline" 
          className="w-full sm:w-auto border-gray-300 hover:bg-gray-100"
          onClick={async () => {
            await logoutAction();
            window.location.href = "/";
          }}
        >
          Sign Out & Return to Login
        </Button>
      </div>
    </div>
  );
}
