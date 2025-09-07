'use client';

import React from 'react';
import { MoreHorizontal, TrendingUp } from 'lucide-react';
import { Product } from '../types';
import Link from 'next/link';

export default function ProductCard({ product }: { product: Product }) {
  const cover = product.variants?.[0]?.images?.[0];

  const finalPrice =
    product.onSale && product.discountPercentage && product.discountPercentage > 0
      ? Math.round((product.price * (100 - product.discountPercentage)) / 100)
      : product.price;

  const salesCount = product.salesCount || 0;
  const remainingProducts = product.stock;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 max-w-sm flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
            {cover ? (
              <img
                src={cover}
                alt={`${product.name} image`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 bg-gray-300 rounded"></div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg line-clamp-2">{product.name}</h3>
            <p className="text-gray-500 text-sm">{product.type}</p>
          </div>
        </div>
        <Link href={`/dashboard/products/${product._id}`} className="text-gray-400 hover:text-gray-600 p-1">
          <MoreHorizontal size={20} />
        </Link>
      </div>

      {/* Price */}
      <div className="mb-4 flex items-baseline gap-2">
        {product.onSale && product.discountPercentage ? (
          <>
            <span className="text-2xl font-bold text-gray-900">${finalPrice}</span>
            <span className="text-sm text-gray-400 line-through">${product.price}</span>
          </>
        ) : (
          <span className="text-2xl font-bold text-gray-900">${product.price}</span>
        )}
      </div>

      {/* Summary Section */}
      <div className="space-y-3 flex-1">
        <h4 className="font-semibold text-gray-900">Summary</h4>
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{product.description}</p>

        {/* Stats */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-3 mt-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">Sales</span>
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-orange-500" />
              <span className="font-semibold text-gray-900">{salesCount}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">Remaining Products</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <span className="font-semibold text-gray-900">{remainingProducts}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
