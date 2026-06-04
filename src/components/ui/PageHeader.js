import React from "react";

export default function PageHeader({ title, children }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
      <h1 className="text-xl md:text-2xl font-bold tracking-tight text-brand-orange uppercase">
        {title}
      </h1>
      
      {children && (
        <div className="flex flex-wrap items-center gap-3 self-end md:self-auto">
          {children}
        </div>
      )}
    </div>
  );
}
