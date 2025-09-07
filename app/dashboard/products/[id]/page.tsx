'use client';

import React, { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useGetProductQuery } from '../../../services/productsApi';
import ProductForm from '../../../components/ProductForm';

export default function EditProductPage() {
  const params = useParams();
  const id = params?.id as string;
  const { data: product, isLoading, isError } = useGetProductQuery(id, { skip: !id });
  const defaults = useMemo(
  () => ({
    name: product?.name,
    description: product?.description,
    ratings: product?.ratings,
    variants: product?.variants,
    onSale: product?.onSale,
    discountPercentage: product?.discountPercentage,
    price: product?.price,
    stock: product?.stock,
    type: product?.type,
    category: product?.category,
    loyaltyPoints: product?.loyaltyPoints,
  }),
  [product]
);

if (!id) return <div>Invalid product ID</div>;
if (isLoading) return <div>Loading...</div>;
if (isError || !product) return <div>Not found</div>;



return (
  <div className="max-w-3xl">
    <h1 className="text-2xl font-semibold mb-4">Edit Product</h1>
    <ProductForm productId={product._id} defaultValues={defaults} />
  </div>
);
}
