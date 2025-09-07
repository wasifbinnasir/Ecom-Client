"use client";

import React from "react";
import { useGetProductsQuery } from "../services/productsApi";
import ItemCard from "../components/ItemCard";
import Link from "next/link";
import Container from "../components/Container";
import ProductCardSkeleton from "./ProductCardSekeleton";

export default function NewArrivals() {
  const { data, isLoading, isError } = useGetProductsQuery({ page: 1, limit: 50 });

  if (isLoading) return <ProductCardSkeleton/>;
  if (isError) return <div className="text-red-600 text-center">Failed to load products</div>;

  const items = data?.items ?? [];

  const recentItems = [...items]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  return (
    <Container className="space-y-10 mx-auto px-6 md:px-14 lg:px-24">
      {/* Heading */}
      <h1 className="text-5xl font-extrabold text-center mt-5 md:mt-16">New Arrivals</h1>

      {/* Products Grid */}
      {recentItems.length === 0 ? (
        <p className="text-center text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {recentItems.map((p) => (
            <Link key={p._id} href={`/products/${p._id}`} className="block">
              <ItemCard product={p} />
            </Link>
          ))}
        </div>
      )}
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
