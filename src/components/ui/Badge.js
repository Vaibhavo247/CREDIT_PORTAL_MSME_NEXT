import React from "react";

const variants = {
  success: "bg-emerald-100 text-emerald-800 border-emerald-200",
  warning: "bg-amber-100 text-amber-800 border-amber-200",
  danger: "bg-red-100 text-red-800 border-red-200",
  info: "bg-blue-100 text-blue-800 border-blue-200",
  default: "bg-gray-100 text-gray-800 border-gray-200",
};

export default function Badge({ children, variant = "default", className = "" }) {
  // Try to automatically map variant if not explicitly set, 
  // e.g. if children is "Red" -> danger, "Green" -> success
  let activeVariant = variant;
  if (variant === "default" && typeof children === "string") {
    const text = children.toLowerCase();
    if (text.includes("red") || text.includes("reject")) activeVariant = "danger";
    else if (text.includes("amber") || text.includes("pending")) activeVariant = "warning";
    else if (text.includes("green") || text.includes("approve") || text.includes("active")) activeVariant = "success";
  }

  return (
    <span
      className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${variants[activeVariant] || variants.default} ${className}`}
    >
      {children}
    </span>
  );
}
