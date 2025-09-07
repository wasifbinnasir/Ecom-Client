'use client';

import React from 'react';

export default function ProductCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl overflow-hidden flex flex-col p-2 gap-2">
      {/* Image */}
      <div className="w-full md:w-[295px] md:h-[295px] h-60 bg-gray-200 rounded-xl" />

      {/* Text */}
      <div className="mt-3 flex flex-col gap-3">
        <div className="h-5 w-3/4 bg-gray-200 rounded" />
        <div className="h-4 w-1/2 bg-gray-200 rounded" />
        <div className="h-5 w-1/3 bg-gray-200 rounded" />
      </div>
    </div>
  );
}
