"use client";

import React from "react";

export default function ProductPageSkeleton() {
  return (
    <div className="animate-pulse px-6 md:px-14 lg:px-24 py-12">
      {/* Breadcrumb */}
      <div className="h-5 w-48 bg-gray-200 rounded mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images Section */}
        <div className="flex gap-6">
          {/* Thumbnails */}
          <div className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="w-20 h-20 lg:w-36 lg:h-36 bg-gray-200 rounded-md" />
            ))}
          </div>

          {/* Main Image */}
          <div className="flex-1">
            <div className="w-full h-[500px] bg-gray-200 rounded-lg" />
          </div>
        </div>

        {/* Info Section */}
        <div className="space-y-4">
          <div className="h-8 w-2/3 bg-gray-200 rounded" />
          <div className="h-4 w-32 bg-gray-200 rounded" />
          <div className="h-20 w-full bg-gray-200 rounded" />

          {/* Price */}
          <div className="h-6 w-24 bg-gray-200 rounded" />

          {/* Colors */}
          <div className="flex gap-3">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="w-10 h-10 bg-gray-200 rounded-full" />
            ))}
          </div>

          {/* Sizes */}
          <div className="flex gap-3">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="w-12 h-8 bg-gray-200 rounded-full" />
            ))}
          </div>

          {/* Quantity + Add to Cart */}
          <div className="flex gap-4">
            <div className="w-32 h-10 bg-gray-200 rounded-full" />
            <div className="flex-1 h-12 bg-gray-200 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
