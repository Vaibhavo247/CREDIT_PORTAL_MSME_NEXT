import React from "react";

const variants = {
  primary: "bg-brand-orange hover:bg-orange-600 text-white shadow-sm hover:shadow",
  secondary: "bg-brand-blue hover:bg-brand-blue-hover text-white shadow-sm hover:shadow",
  success: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm",
  warning: "bg-amber-500 hover:bg-amber-600 text-white shadow-sm",
  danger: "bg-red-500 hover:bg-red-600 text-white shadow-sm",
  outline: "border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-700",
  ghost: "bg-transparent hover:bg-orange-50 text-gray-500 hover:text-brand-orange",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs h-8",
  md: "px-4 py-2 text-sm h-[42px]",
  lg: "px-5 py-2.5 text-base h-12",
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
    "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const disabledClasses = disabled
    ? "opacity-50 cursor-not-allowed hover:shadow-none hover:translate-y-0"
    : "active:scale-[0.98]";

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
