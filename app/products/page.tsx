'use client';

import React, { useState } from 'react';
import { useFilterProductsQuery } from '../services/productsApi';
import ItemCard from '../components/ItemCard';
import Container from '../components/Container';
import ProductFilter from '../components/FilterSection';
import Link from 'next/link';
import Breadcrumb from '../components/Breadcrum';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import { FiSliders, FiX } from 'react-icons/fi';
import ProductCardSkeleton from '../components/ProductCardSekeleton';
import FilterSkeleton from '../components/FilterSkeleton';

export default function ProductsPage() {
  const [filters, setFilters] = useState<{ category?: string; size?: string; color?: string }>({});
  const [page, setPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const limit = 9;

  const { data, isLoading, isError } = useFilterProductsQuery({ ...filters, page, limit });

  if (isLoading) {
  return (
    <Container className="space-y-10 mx-auto px-4 flex gap-x-3 relative">
      {/* Sidebar Skeleton */}
      <div className="hidden md:block w-64 shrink-0">
        <FilterSkeleton />
      </div>

      {/* Products Grid Skeleton */}
      <div className="flex-1">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </Container>
  );
}

  if (isError) return <div className="text-red-600 text-center">Failed to load products</div>;

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / limit);

  return (
    <Container className="space-y-10 mx-auto px-4 flex gap-x-3 relative">
      {/* Sidebar Filter (Desktop) */}
      <div className="hidden md:block w-64 shrink-0">
        <ProductFilter
          onFilterChange={(newFilters) => {
            setFilters(newFilters);
            setPage(1);
          }}
        />
      </div>

      {/* Mobile Filter Toggle */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsFilterOpen(true)}
          className="p-3 rounded-full bg-black text-white shadow-lg flex items-center gap-2"
        >
          <FiSliders className="w-5 h-5" />
          Filters
        </button>
      </div>

      {/* Mobile Filter Drawer */}
      {isFilterOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setIsFilterOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          ></div>

          {/* Drawer */}
          <div className="fixed inset-y-0 left-0 w-72 bg-white shadow-lg z-50 p-5 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <FiX className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <ProductFilter
              onFilterChange={(newFilters) => {
                setFilters(newFilters);
                setPage(1);
              }}
            />
          </div>
        </>
      )}

      {/* Products Section */}
      <div className="flex-1">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Products', href: '/products' },
          ]}
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.length === 0 ? (
            <p className="text-center text-gray-500 col-span-full">No products found.</p>
          ) : (
            items.map((p) => (
              <Link key={p._id} href={`/products/${p._id}`} className="block">
                <ItemCard product={p} />
              </Link>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-6">
            {/* Previous Button */}
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              className="px-3 py-2 border rounded-lg disabled:opacity-50 flex items-center gap-1"
            >
              <AiOutlineLeft />
              Prev
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
                <button
                  key={pNum}
                  onClick={() => setPage(pNum)}
                  className={`px-3 py-2 rounded-lg border ${
                    pNum === page ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
                  }`}
                >
                  {pNum}
                </button>
              ))}
            </div>

            {/* Next Button */}
            <button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              className="px-3 py-2 border rounded-lg disabled:opacity-50 flex items-center gap-1"
            >
              Next
              <AiOutlineRight />
            </button>
          </div>
        )}
      </div>
    </Container>
  );
}
