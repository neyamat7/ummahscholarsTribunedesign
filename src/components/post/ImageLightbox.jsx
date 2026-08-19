"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, ZoomOut, Download } from "lucide-react";

export default function ImageLightbox({ src, alt, isOpen, onClose }) {
  const [scale, setScale] = React.useState(1);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !src) return null;

  const handleZoomIn = (e) => {
    e.stopPropagation();
    setScale((prev) => Math.min(prev + 0.3, 2.5));
  };

  const handleZoomOut = (e) => {
    e.stopPropagation();
    setScale((prev) => Math.max(prev - 0.3, 0.8));
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
        onClick={onClose}
      >
        {/* Top Control Bar */}
        <div
          className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-3 z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleZoomIn}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn size={18} />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut size={18} />
          </button>
          <a
            href={src}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Open original"
          >
            <Download size={18} />
          </a>
          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/15 hover:bg-white/30 text-white transition-colors cursor-pointer"
            title="Close (Esc)"
          >
            <X size={20} />
          </button>
        </div>

        {/* Image Container */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale, opacity: 1 }}
          exit={{ scale: 0.92, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative max-w-[92vw] max-h-[88vh] w-auto h-auto flex flex-col items-center"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={src}
            alt={alt || "Scholarly image preview"}
            className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl transition-transform duration-200"
          />
          {alt && (
            <p className="text-white/80 text-xs sm:text-sm text-center mt-3 max-w-xl font-sans">
              {alt}
            </p>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
