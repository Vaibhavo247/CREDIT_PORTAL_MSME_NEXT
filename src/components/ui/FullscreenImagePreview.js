import React, { useState, useEffect } from "react";
import { ZoomIn, ZoomOut, RotateCcw, RotateCw, X } from "lucide-react";

export default function FullscreenImagePreview({ src, alt, isOpen, onClose }) {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setRotation(0);
      
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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

  const handleClose = (e) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fade-in"
      onClick={handleClose}
    >
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        <img
          src={formattedSrc}
          alt={alt}
          style={{
            transform: `scale(${scale}) rotate(${rotation}deg)`,
            transition: "transform 0.2s ease-in-out"
          }}
          className="max-w-full max-h-full object-contain shadow-2xl border border-white/10"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 z-[110]" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => setScale((s) => Math.min(s + 0.25, 4))} className="text-white hover:text-brand-orange transition-colors p-2" title="Zoom In">
          <ZoomIn className="w-6 h-6" />
        </button>
        <button onClick={() => setScale((s) => Math.max(s - 0.25, 0.5))} className="text-white hover:text-brand-orange transition-colors p-2" title="Zoom Out">
          <ZoomOut className="w-6 h-6" />
        </button>
        <div className="w-px h-6 bg-white/20 mx-2" />
        <button onClick={() => setRotation((r) => r - 90)} className="text-white hover:text-brand-orange transition-colors p-2" title="Rotate Left">
          <RotateCcw className="w-6 h-6" />
        </button>
        <button onClick={() => setRotation((r) => r + 90)} className="text-white hover:text-brand-orange transition-colors p-2" title="Rotate Right">
          <RotateCw className="w-6 h-6" />
        </button>
      </div>

      <button 
        className="absolute top-6 right-6 text-white hover:text-red-400 p-3 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-all z-[110]"
        onClick={handleClose}
      >
        <X className="w-6 h-6" />
      </button>
    </div>
  );
}
