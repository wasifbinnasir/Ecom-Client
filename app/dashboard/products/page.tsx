'use client';

import React from 'react';
import { useGetProductsQuery } from '../../services/productsApi';
import ProductCard from '../../components/ProductCard';
import Link from 'next/link';
import Spinner from '@/app/components/Spinner';
import Breadcrumb from '@/app/components/Breadcrum';

export default function ProductsPage() {
  const { data, isLoading, isError, refetch } = useGetProductsQuery({ page: 1, limit: 20 });

  if (isLoading) return <div><Spinner/></div>;
  if (isError) return <div className="text-red-600">Failed to load products</div>;

  const items = data?.items ?? [];
  const total = data?.total ?? 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">All Products</h1>
        <Breadcrumb items={[
          { label: 'Dashboard', href: '/dashboard/dashboard' },
          { label: 'Products', href: '/dashboard/products' },
        ]} />
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/addproduct" className="inline-flex items-center rounded-4xl bg-black px-4 py-2 text-white text-sm hover:opacity-90">
            Add Product
          </Link>
        </div>
      </div>
      {items.length === 0 ? (
        <p className="text-muted">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
      <p className="text-xs text-muted">Total: {total}</p>
    </div>
  );
}