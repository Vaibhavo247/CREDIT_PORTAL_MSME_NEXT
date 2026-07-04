import React from "react";

export function Card({ children, className = "", ...props }) {
  return (
    <div 
      className={`bg-white rounded-2xl p-4 sm:p-5 ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, className = "" }) {
  return (
    <div className={`mb-4 ${className}`}>
      {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}
