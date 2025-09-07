'use client';

import React from 'react';
import { Product } from '../types';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

export default function ItemCard({ product }: { product: Product }) {
  const cover =
    product.variants?.[0]?.images?.[0] ??
    'https://via.placeholder.com/600x400.png?text=No+Image';

  const finalPrice =
    product.onSale && product.discountPercentage > 0
      ? Math.round((product.price * (100 - product.discountPercentage)) / 100)
      : product.price;

  const rating = product.ratings || 0; // can be decimal like 3.5
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <article className="rounded-2xl hover:shadow-sm overflow-hidden flex flex-col p-2 gap-x-2.5">
      {/* Image */}
      <img
        src={cover}
        alt={`${product.name} image`}
        className="md:w-[295px] md:h-[295px] object-cover rounded-xl border border-gray-200"
      />

      {/* Info */}
      <div className="mt-3 flex flex-col gap-2">
        {/* Product Name */}
        <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>

        {/* Rating */}
        <div className="flex items-center gap-1 text-yellow-500 text-sm">
          {Array.from({ length: 5 }).map((_, i) => {
            if (i < fullStars) return <FaStar key={i} />;
            if (i === fullStars && hasHalfStar) return <FaStarHalfAlt key={i} />;
            return <FaRegStar key={i} />;
          })}
          <span className="text-gray-500 text-xs ml-1">
            {rating.toFixed(1)}/5
          </span>
        </div>

        {/* Price & Discount */}
        <div className="flex items-center gap-2">
          {product.onSale && product.discountPercentage > 0 ? (
            <>
              <span className="text-lg font-semibold text-gray-900">
                ${finalPrice}
              </span>
              <span className="text-sm text-gray-400 line-through">
                ${product.price}
              </span>
              <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                -{product.discountPercentage}%
              </span>
            </>
          ) : (
            <span className="text-lg font-semibold text-gray-900">
              ${product.price}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
