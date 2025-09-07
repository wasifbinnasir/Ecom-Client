"use client";

import React from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from "../services/productsApi";
import Link from "next/link";
import { AiOutlineClose } from "react-icons/ai";

type ProductType = "money" | "points" | "hybrid";

type VariantForm = {
  color: string;
  images: string[];
  sizes: string[];
  stock: number;
};

export type ProductFormValues = {
  name: string;
  description: string;
  ratings?: number;
  variants?: VariantForm[];
  onSale?: boolean;
  discountPercentage?: number;
  price: number;
  stock?: number;
  type: ProductType;
  category: string;
  loyaltyPoints?: number;
};

// Cloudinary config
const CLOUDINARY_CLOUD_NAME = "drygxmmvj";
const CLOUDINARY_UPLOAD_PRESET = "tea_store";
async function uploadToCloudinary(file: File): Promise<string> {
  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  const res = await fetch(url, { method: "POST", body: formData });
  if (!res.ok) throw new Error("Failed to upload image");
  const data = await res.json();
  return data.secure_url as string;
}

export default function ProductForm({
  defaultValues,
  productId,
}: {
  defaultValues?: Partial<ProductFormValues>;
  productId?: string;
}) {
  const [createProduct, { isLoading: creating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: updating }] = useUpdateProductMutation();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<ProductFormValues>({
    defaultValues: {
      name: "",
      description: "",
      ratings: 0,
      variants: [],
      onSale: false,
      discountPercentage: 0,
      price: 0,
      stock: 0,
      type: "money",
      category: "",
      loyaltyPoints: 0,
      ...defaultValues,
    },
    mode: "onBlur",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  const onSubmit = async (values: ProductFormValues) => {
    if (values.onSale && (values.discountPercentage ?? 0) <= 0) {
      alert("Discount percentage must be > 0 when On Sale is checked.");
      return;
    }
    if ((values.variants ?? []).some((v) => !v.images || v.images.length === 0)) {
      alert("Every variant must have at least one image.");
      return;
    }

    try {
      if (productId) {
        await updateProduct({ id: productId, product: values }).unwrap();
      } else {
        await createProduct(values).unwrap();
        alert("Product created");
      }
      window.location.href = "/dashboard/products";
    } catch (e: any) {
      alert(e?.data?.message || e?.error || "Something went wrong");
    }
  };

  const handleImageSelect = async (files: FileList | null, idx: number) => {
    if (!files || files.length === 0) return;
    const uploading = Array.from(files);
    try {
      const urls = await Promise.all(uploading.map(uploadToCloudinary));
      const current = watch(`variants.${idx}.images`) || [];
      setValue(`variants.${idx}.images`, [...current, ...urls], { shouldValidate: true });
    } catch {
      alert("Image upload failed");
    }
  };

  const busy = isSubmitting || creating || updating;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white p-8 rounded-2xl shadow-lg w-full mx-auto">
      {/* Product Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-semibold mb-2">Name</label>
          <input
            {...register("name", { required: "Name is required" })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black"
            placeholder="Product name"
          />
          {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block font-semibold mb-2">Category</label>
          <input
            {...register("category", { required: "Category is required" })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black"
            placeholder="e.g. Electronics"
          />
          {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category.message}</p>}
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-2">Description</label>
        <textarea
          {...register("description", { required: "Description is required" })}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black"
          rows={4}
          placeholder="Product description"
        />
        {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>}
      </div>

      {/* Price & Stock */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block font-semibold mb-2">Price (USD)</label>
          <input
            type="number"
            step="0.01"
            {...register("price", { required: "Price required", valueAsNumber: true })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black"
          />
        </div>
        <div>
          <label className="block font-semibold mb-2">Stock</label>
          <input
            type="number"
            {...register("stock", { valueAsNumber: true })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black"
          />
        </div>
        <div>
          <label className="block font-semibold mb-2">Ratings</label>
          <input
            type="number"
            step="0.1"
            {...register("ratings", { valueAsNumber: true, min: 0, max: 5 })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black"
          />
        </div>
      </div>

      {/* Type, Sale, Discount */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div>
          <label className="block font-semibold mb-2">Type</label>
          <select {...register("type")} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black">
            <option value="money">Money</option>
            <option value="points">Points</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" {...register("onSale")} className="h-4 w-4" id="onSale" />
          <label htmlFor="onSale" className="font-semibold">On Sale</label>
        </div>
        <div>
          <label className="block font-semibold mb-2">Discount %</label>
          <input
            type="number"
            {...register("discountPercentage", { valueAsNumber: true, min: 0, max: 100 })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black"
          />
        </div>
      </div>

      {/* Loyalty Points */}
      <div>
        <label className="block font-semibold mb-2">Loyalty Points</label>
        <input
          type="number"
          {...register("loyaltyPoints", { valueAsNumber: true, min: 0 })}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black"
        />
      </div>

      {/* Variants */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">Variants</h2>
          <button
            type="button"
            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
            onClick={() => append({ color: "", images: [], sizes: [], stock: 0 })}
          >
            Add Variant
          </button>
        </div>

        {fields.map((field, idx) => (
          <div key={field.id} className="flex bg-gray-50 rounded-lg p-4 gap-4 relative">
            <button
              type="button"
              className="absolute top-2 right-2 text-red-600 hover:text-red-800"
              onClick={() => remove(idx)}
            >
              <AiOutlineClose size={20} />
            </button>

            {/* Left: Variant Info */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="font-medium">Color</label>
                <input
                  {...register(`variants.${idx}.color` as const, { required: true })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Red"
                />
              </div>
              <div>
                <label className="font-medium">Stock</label>
                <input
                  type="number"
                  {...register(`variants.${idx}.stock` as const, { valueAsNumber: true })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="font-medium">Sizes (comma separated)</label>
                <Controller
                  control={control}
                  name={`variants.${idx}.sizes`}
                  render={({ field: f }) => (
                    <input
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="S, M, L"
                      value={(f.value ?? []).join(", ")}
                      onChange={(e) => f.onChange(e.target.value.split(",").map((s) => s.trim()))}
                      onBlur={(e) =>
                        f.onChange(e.target.value.split(",").map((s) => s.trim()).filter(Boolean))
                      }
                    />
                  )}
                />
              </div>
            </div>

            {/* Right: Images */}
            <div className="flex-1 flex flex-col gap-2">
              <label className="font-medium">Images</label>
              <input
                type="file"
                accept="image/*"
                multiple
                className="block"
                onChange={(e) => handleImageSelect(e.target.files, idx)}
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {(watch(`variants.${idx}.images`) ?? []).map((url, i) => (
                  <img key={i} src={url} className="h-24 w-24 object-cover rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4 mt-6">
        <button
          type="submit"
          disabled={busy}
          className="bg-black text-white px-6 py-2 rounded-full hover:opacity-90 disabled:opacity-50"
        >
          {productId ? "Update Product" : "Create Product"}
        </button>
        <Link href="/dashboard/products" className="text-gray-600 hover:underline self-center">
          Cancel
        </Link>
      </div>
    </form>
  );
}
