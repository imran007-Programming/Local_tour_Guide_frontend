"use client";

import { useState } from "react";
import Image from "next/image";

export default function ImageGallery({ images, title }: { images: string[]; title: string }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        {images.map((image: string, index: number) => (
          <Image
            key={index}
            src={image}
            alt={`${title} ${index + 1}`}
            width={600}
            height={400}
            className="w-full h-64 object-cover rounded-lg cursor-pointer hover:opacity-90 transition"
            onClick={() => setSelectedImage(image)}
          />
        ))}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <Image
            src={selectedImage}
            alt={title}
            width={1200}
            height={800}
            className="max-w-full max-h-full object-contain animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
