'use client';

import React from 'react';
import Link from 'next/link';
import { useGetProductsQuery } from '../services/productsApi';
import ItemCard from './ItemCard';
import Spinner from './Spinner';
import Container from './Container';
import ProductCardSkeleton from './ProductCardSekeleton';

type ProductSectionProps = {
  title: string;
  sliceStart?: number;
  sliceEnd?: number;
};

export default function BestSelling({ title, sliceStart = 0, sliceEnd = 8 }: ProductSectionProps) {
  const { data, isLoading, isError } = useGetProductsQuery({ page: 1, limit: 20 });

  if (isLoading) return <ProductCardSkeleton/>;
  if (isError) return <div className="text-red-600">Failed to load products</div>;

  const items = data?.items ?? [];
  const slicedItems = items.slice(sliceStart, sliceEnd);

  return (
    <Container className="space-y-8 mx-auto px-6 md:px-14 lg:px-24">
      {/* Heading */}
      <h1 className="text-5xl font-extrabold text-center mt-5 md:mt-16">{title}</h1>

      {/* Products Grid */}
      {slicedItems.length === 0 ? (
        <p className="text-center text-muted">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {slicedItems.map((p) => (
            <Link key={p._id} href={`/products/${p._id}`} className="block">
              <ItemCard product={p} />
            </Link>
          ))}
        </div>
      )}

      {/* View All Button */}
      <div className="flex justify-center">
        <Link
          href="/products"
          className="inline-block rounded-full border border-black px-14 py-2 text-black text-sm font-medium hover:bg-gray-800 hover:text-white transition"
        >
          View All
        </Link>
      </div>
    </Container>
  );
}
