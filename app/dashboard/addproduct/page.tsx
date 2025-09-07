'use client';

import React from 'react';
import ProductForm from '../../components/ProductForm';
import Breadcrumb from '@/app/components/Breadcrum';

export default function NewProductPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold mb-4">Create Product</h1>
      <Breadcrumb items={[{label:"Dashboard", href:"/dashboard"},{label:"Products", href:"/dashboard/products"},{label:"Product Form", href:"/dashboard/addproduct"},]}/>
      <ProductForm />
    </div>
  );
}