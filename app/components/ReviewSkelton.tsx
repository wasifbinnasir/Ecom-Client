"use client";

import React from "react";

export default function ReviewsSkeleton() {
  return (
    <div className="animate-pulse mt-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="h-6 w-40 bg-gray-200 rounded" />
        <div className="h-10 w-32 bg-gray-200 rounded-full" />
      </div>

      {/* Review Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="border border-gray-200 rounded-[20px] p-4 shadow-sm space-y-3"
          >
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-6 w-32 bg-gray-200 rounded" />
            <div className="h-16 w-full bg-gray-200 rounded" />
            <div className="h-3 w-20 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
