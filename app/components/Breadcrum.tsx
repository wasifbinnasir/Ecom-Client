'use client';

import React from 'react';
import { FiChevronRight } from 'react-icons/fi';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center text-base py-2 text-gray-500" aria-label="breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={index} className="flex items-center">
            {item.href && !isLast ? (
              <a
                href={item.href}
                className="hover:text-gray-900 font-medium transition-colors"
              >
                {item.label}
              </a>
            ) : (
              <span className={`font-medium ${isLast ? 'text-gray-900' : ''}`}>
                {item.label}
              </span>
            )}

            {!isLast && <FiChevronRight className="mx-2 w-4 h-4 text-gray-400" />}
          </div>
        );
      })}
    </nav>
  );
}
