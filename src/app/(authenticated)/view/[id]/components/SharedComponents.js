import React, { useState } from "react";
import FullscreenImagePreview from "@/components/ui/FullscreenImagePreview";

export function ZoomableImage({ src, alt, className, style }) {
  const [isOpen, setIsOpen] = useState(false);

  let formattedSrc = src;
  if (src && typeof src === "string") {
    let cleanSrc = src.replace(/^["']|["']$/g, '').trim().replace(/\s/g, '');
    const isRelativePath = cleanSrc.startsWith("/") && cleanSrc.length < 500;
    if (!cleanSrc.startsWith("http") && !cleanSrc.startsWith("data:") && !isRelativePath) {
      formattedSrc = `data:image/jpeg;base64,${cleanSrc}`;
    } else {
      formattedSrc = cleanSrc;
    }
  }

  return (
    <>
      <img
        src={formattedSrc}
        alt={alt}
        className={`${className} cursor-zoom-in hover:brightness-95 transition`}
        style={style}
        onClick={() => setIsOpen(true)}
      />
      <FullscreenImagePreview
        src={formattedSrc}
        alt={alt}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}

export function SimpleCarousel({ images }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const next = () => setActiveIndex((prev) => (prev + 1) % images.length);
  const prev = () => setActiveIndex((prev) => (prev - 1 + images.length) % images.length);

  if (!images || images.length === 0) return null;

  return (
    <div className="relative w-full max-w-sm mx-auto group">
      <div className="relative h-80 overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 flex items-center justify-center">
        <ZoomableImage
          src={`data:image/jpeg;base64,${images[activeIndex].src}`}
          alt={`business-${images[activeIndex].index}`}
          className="max-h-full max-w-full object-contain"
        />
      </div>
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 w-8 h-8 rounded-full shadow-md z-10 flex items-center justify-center font-bold cursor-pointer hover:scale-105 active:scale-95 transition-all"
          >
            &larr;
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 w-8 h-8 rounded-full shadow-md z-10 flex items-center justify-center font-bold cursor-pointer hover:scale-105 active:scale-95 transition-all"
          >
            &rarr;
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  activeIndex === idx ? "bg-brand-orange w-4" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function DetailsField({ label, value, className = "col-span-1" }) {
  // Safely handle 0 as a valid value
  const displayValue = (value !== undefined && value !== null && value !== "") ? value : "N/A";

  return (
    <div className={`${className} flex flex-col gap-1.5`}>
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        {label}
      </span>
      <div className="px-4 py-2.5 text-[13px] font-medium text-gray-900 bg-white border border-gray-200 rounded-xl shadow-sm wrap-break-word">
        {typeof displayValue === 'object' ? JSON.stringify(displayValue) : displayValue}
      </div>
    </div>
  );
}
