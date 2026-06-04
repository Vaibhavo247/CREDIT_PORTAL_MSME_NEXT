import React from "react";

export default function Spinner({ size = "medium", text = "" }) {
  const sizeMap = {
    small: "w-6 h-6",
    medium: "w-10 h-10",
    large: "w-16 h-16",
  };
  
  const dimension = sizeMap[size] || sizeMap.medium;

  return (
    <div className="flex flex-col items-center justify-center gap-4 select-none">
      <div className={`relative ${dimension} flex items-center justify-center`}>
        {/* Outer subtle ring */}
        <div className="absolute inset-0 rounded-full border-[3px] border-gray-200"></div>
        {/* Inner spinning track */}
        <div className="absolute inset-0 rounded-full border-[3px] border-brand-orange border-t-transparent animate-spin drop-shadow-[0_0_8px_rgba(234,88,12,0.5)]"></div>
        {/* Counter-spinning accent */}
        <div className="absolute inset-2 rounded-full border-[3px] border-brand-blue border-b-transparent animate-[spin_1.5s_linear_infinite_reverse]"></div>
        {/* Center dot pulse */}
        <div className="w-2 h-2 bg-brand-orange rounded-full animate-pulse"></div>
      </div>
      {text && <span className="text-brand-blue text-sm font-bold tracking-wider uppercase animate-pulse">{text}</span>}
    </div>
  );
}
