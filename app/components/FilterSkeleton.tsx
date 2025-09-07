'use client';

import React from 'react';

export default function FilterSkeleton() {
  return (
    <div className="animate-pulse py-5 px-6 flex flex-col gap-6 border border-[#0000001A] max-w-[295px] w-full rounded-[20px] bg-white shadow-sm">
      {/* Header */}
      <div className="h-6 w-24 bg-gray-200 rounded" />
      <div className="h-6 w-full bg-gray-200 rounded" />
      <div className="h-6 w-32 bg-gray-200 rounded" />

      {/* Category */}
      <div className="space-y-3">
        <div className="h-5 w-28 bg-gray-200 rounded" />
        <div className="h-10 w-full bg-gray-200 rounded" />
      </div>

      {/* Price */}
      <div className="space-y-3">
        <div className="h-5 w-20 bg-gray-200 rounded" />
        <div className="h-2 w-full bg-gray-200 rounded" />
      </div>

      {/* Sizes */}
      <div className="space-y-3">
        <div className="h-5 w-16 bg-gray-200 rounded" />
        <div className="flex gap-2 flex-wrap">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-8 w-12 bg-gray-200 rounded-full" />
          ))}
        </div>
      </div>

      {/* Colors */}
      <div className="space-y-3">
        <div className="h-5 w-20 bg-gray-200 rounded" />
        <div className="flex gap-3 flex-wrap">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-9 w-9 bg-gray-200 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
