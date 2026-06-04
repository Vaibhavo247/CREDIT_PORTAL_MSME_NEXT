import React from "react";

export default function Input({ className = "", ...props }) {
  return (
    <input
      className={`px-4 py-2 border border-bank-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange bg-white transition-colors ${className}`}
      {...props}
    />
  );
}
