import React from "react";

export default function Input({ label, className = "", wrapperClassName = "", ...props }) {
  return (
    <div className={`w-full ${wrapperClassName}`}>
      {label && (
        <label className="form-label mb-1.5 ml-1">
          {label}
        </label>
      )}
      <input
        className={`form-input w-full ${className}`}
        {...props}
      />
    </div>
  );
}
