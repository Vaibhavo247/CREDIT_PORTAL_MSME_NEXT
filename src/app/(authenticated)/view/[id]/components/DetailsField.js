export default function DetailsField({ label, value, className = "col-span-1" }) {
  // Safely handle 0 as a valid value
  const displayValue = (value !== undefined && value !== null && value !== "") ? value : "N/A";

  return (
    <div className={`${className} flex flex-col gap-1.5`}>
      <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
        {label}
      </span>
      <div className="px-4 py-2.5 bg-gray-50 border border-gray-200/60 rounded-xl text-sm font-medium text-gray-700 wrap-break-word shadow-inner">
        {typeof displayValue === 'object' ? JSON.stringify(displayValue) : displayValue}
      </div>
    </div>
  );
}
