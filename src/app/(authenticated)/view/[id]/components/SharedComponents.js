import React, { useState } from "react";

export function ZoomableImage({ src, alt, className, style }) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Clean the source if it's a raw base64 string
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
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setIsOpen(false)}
        >
          <img
            src={formattedSrc}
            alt={alt}
            className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl border border-white/10"
          />
          <button className="absolute top-6 right-6 text-white hover:text-gray-300 p-2 bg-white/10 rounded-full hover:bg-white/20 cursor-pointer z-[110]">
            Close Preview
          </button>
        </div>
      )}
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
      <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
        {label}
      </span>
      <div className="px-4 py-2.5 bg-gray-50 border border-gray-200/60 rounded-xl text-sm font-medium text-gray-700 break-words shadow-inner">
        {typeof displayValue === 'object' ? JSON.stringify(displayValue) : displayValue}
      </div>
    </div>
  );
}
