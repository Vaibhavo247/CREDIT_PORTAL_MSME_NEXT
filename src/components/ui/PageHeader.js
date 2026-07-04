import React from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PageHeader({ title, children, showBack = false }) {
  const router = useRouter();

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full bg-white py-4 mb-2 border-b border-gray-200 z-10">
      <div className="flex items-center gap-3">
        {showBack && (
          <button 
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-brand-orange transition-colors"
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-brand-orange uppercase">
          {title}
        </h1>
      </div>
      
      {children && (
        <div className="flex flex-wrap items-center gap-3 self-end md:self-auto">
          {children}
        </div>
      )}
    </header>
  );
}
