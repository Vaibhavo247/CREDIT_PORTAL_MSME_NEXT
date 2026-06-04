import React from "react";

const variants = {
  primary: "bg-brand-blue hover:bg-brand-blue-hover text-white shadow-sm",
  success: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm",
  warning: "bg-amber-500 hover:bg-amber-600 text-white shadow-sm",
  danger: "bg-red-500 hover:bg-red-600 text-white shadow-sm",
  outline: "border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-700",
  ghost: "bg-transparent hover:bg-gray-100 text-gray-700",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-base",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  ...props
}) {
  const baseClasses =
    "inline-flex items-center justify-center font-semibold rounded-lg transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const disabledClasses = disabled
    ? "opacity-60 cursor-not-allowed grayscale-[0.3]"
    : "";

  return (
    <button
      disabled={disabled}
      className={`${baseClasses} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${disabledClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
