'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Range } from 'react-range';
import { FiChevronRight, FiSliders } from 'react-icons/fi';
import { useGetProductsQuery, useFilterProductsQuery } from '../services/productsApi';
import { Product } from '../types';
import stc from "string-to-color";


interface FilterProps {
  onFilterChange: (filters: {
    category?: string;
    size?: string;
    color?: string;
    minPrice?: number;
    maxPrice?: number;
  }) => void;
}

export default function ProductFilter({ onFilterChange }: FilterProps) {
  const { data: allProductsData } = useGetProductsQuery({});
  const [category, setCategory] = useState('');
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [priceRange, setPriceRange] = useState([0, 500]);

  const { data: filteredProducts } = useFilterProductsQuery({
    category: category || undefined,
    size: size || undefined,
    color: color || undefined,
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
  });

  // Unique categories, sizes, colors
  const availableCategories = useMemo(() => {
    const categories = allProductsData?.items?.map((p) => p.category) || [];
    return Array.from(new Set(categories));
  }, [allProductsData]);

  const availableSizes = useMemo(() => {
    const sizes =
      allProductsData?.items
        ?.flatMap((p) => p.variants?.flatMap((v) => v.sizes || []))
        .filter(Boolean) || [];
    return Array.from(new Set(sizes));
  }, [allProductsData]);

  const availableColors = useMemo(() => {
    const colors =
      allProductsData?.items
        ?.flatMap((p) => p.variants?.flatMap((v) => v.color || []))
        .filter(Boolean) || [];
    return Array.from(new Set(colors));
  }, [allProductsData]);

  useEffect(() => {
    onFilterChange({
      category,
      size,
      color,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
    });
  }, [category, size, color, priceRange]);

  return (
    <div className="sidebar py-5 px-6 flex flex-col gap-6 border border-[#0000001A] max-w-[295px] w-full rounded-[20px] bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <h3 className="text-black font-extrabold text-xl">Filters</h3>
        <FiSliders className="text-gray-600 text-xl" />
      </div>

      <div className="w-full border border-[#0000001A]"></div>

      {/* Category */}
      <div className="flex flex-col gap-5">
        <div className="flex justify-between">
          <h3 className="text-black font-bold text-xl">Category</h3>
          <FiChevronRight className="text-gray-700" />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          <option value="">All</option>
          {availableCategories.map((c) => (
            <option key={c} value={c}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full border border-[#0000001A]"></div>

      {/* Price Filter */}
      <div className="flex flex-col gap-5">
        <div className="flex justify-between">
          <h3 className="text-black font-bold text-xl">Price</h3>
          <FiChevronRight className="text-gray-700" />
        </div>
        <div className="flex flex-col items-center space-y-4 p-2">
          <Range
            step={10}
            min={0}
            max={500}
            values={priceRange}
            onChange={(values) => setPriceRange(values)}
            renderTrack={({ props, children }) => (
              <div
                {...props}
                className="h-2 w-full bg-gray-200 rounded-full relative"
              >
                <div
                  className="absolute h-2 bg-black rounded-full"
                  style={{
                    left: `${(priceRange[0] / 500) * 100}%`,
                    width: `${((priceRange[1] - priceRange[0]) / 500) * 100}%`,
                  }}
                />
                {children}
              </div>
            )}
            renderThumb={({ props }) => {
              const { key, ...rest } = props;
              return (
                <div
                  key={key}
                  {...rest}
                  className="h-6 w-6 bg-black rounded-full cursor-pointer shadow"
                />
              );
            }}
          />
          <div className="flex justify-between w-64 text-sm font-medium">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>

      <div className="w-full border border-[#0000001A]"></div>

      {/* Sizes */}
      <div className="flex flex-col gap-5">
        <div className="flex justify-between">
          <h3 className="text-black font-bold text-xl">Size</h3>
          <FiChevronRight className="text-gray-700" />
        </div>
        <div className="w-full flex flex-wrap gap-2">
          {availableSizes.map((s) => (
            <div
              key={s}
              onClick={() => setSize(size === s ? '' : s)}
              className={`cursor-pointer text-sm rounded-[62px] py-[10px] px-5 flex items-center justify-center ${
                size === s
                  ? 'bg-black text-white'
                  : 'bg-[#F0F0F0] text-[#00000099]'
              }`}
            >
              {s}
            </div>
          ))}
        </div>
      </div>

      <div className="w-full border border-[#0000001A]"></div>

      {/* Colors */}
      <div className="flex flex-col gap-5">
  <div className="flex justify-between">
    <h3 className="text-black font-bold text-xl">Colors</h3>
    <FiChevronRight className="text-gray-700" />
  </div>
  <div className="flex gap-3.5 flex-wrap w-full">
    {availableColors.map((c) => {
      const bgColor = stc(c); // ✅ convert string → hex color
      return (
        <div
          key={c}
          onClick={() => setColor(color === c ? "" : c)}
          style={{ backgroundColor: bgColor }}
          className={`h-[37px] w-[37px] rounded-full border-[2px] cursor-pointer ${
            color === c ? "border-black" : "border-[#00000033]"
          }`}
          title={c} // tooltip shows actual color name
        />
      );
    })}
  </div>
</div>

    </div>
  );
}
