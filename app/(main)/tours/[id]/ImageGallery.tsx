"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

export default function ImageGallery({ images }: { images: string[] }) {
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  return (
    <>
      <div>
        <h2 className="text-2xl font-bold mb-3">Gallery</h2>
        <div className="grid grid-cols-3 gap-4">
          {images.map((img: string, i: number) => (
            <div
              key={i}
              className="relative h-48 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setExpandedImage(img)}
            >
              <Image
                src={img}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Expanded Image Modal */}
      {expandedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-in fade-in duration-500"
          onClick={() => setExpandedImage(null)}
        >
          <div
            className="relative w-full max-w-4xl max-h-[90vh] animate-in zoom-in duration-500"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={expandedImage}
              alt="Expanded"
              width={1200}
              height={800}
              className="w-full h-full object-contain rounded-lg"
            />
            <button
              onClick={() => setExpandedImage(null)}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 rounded-full p-2 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
