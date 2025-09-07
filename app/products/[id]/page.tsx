"use client";

import React, { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { useGetProductQuery } from "../../services/productsApi";
import { useAddToCartMutation } from "../../services/cartApi";
import Spinner from "../../components/Spinner";
import Container from "../../components/Container";
import Reviews from "../../components/Reviews";
import Toast from "../../components/Toast";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import Breadcrumb from "@/app/components/Breadcrum";
  import ProductPageSkeleton from "../../components/ProductPageSkeleton";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading, isError } = useGetProductQuery(id);
  const [addToCart, { isLoading: adding }] = useAddToCartMutation();

  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

const allImages = useMemo(
  () => product?.variants?.flatMap((v) => v.images || []) || [],
  [product]
);

  const colors = useMemo(
    () => product?.variants?.map((v) => v.color).filter(Boolean) || [],
    [product]
  );

const sizes = useMemo(() => {
  const all = product?.variants?.flatMap((v) => v.sizes || []) || [];
  return Array.from(new Set(all)); // unique sizes
}, [product]);


  const activeVariant =
    product?.variants?.find((v) => v.color === selectedVariant) ||
    product?.variants?.[0];



if (isLoading) return <ProductPageSkeleton />;

  if (isError || !product)
    return <div className="text-red-600">Product not found</div>;

  const finalPrice =
    product.onSale && product.discountPercentage > 0
      ? Math.round((product.price * (100 - product.discountPercentage)) / 100)
      : product.price;

  const rating = product.ratings || 0;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  const handleAddToCart = async () => {
    if (colors.length > 0 && !selectedVariant) {
      return setToast({
        message: "Please select a color before adding to cart.",
        type: "error",
      });
    }
    if (sizes.length > 0 && !selectedSize) {
      return setToast({
        message: "Please select a size before adding to cart.",
        type: "error",
      });
    }

    try {
      await addToCart({
        product: product._id,
        quantity,
        variant: selectedVariant,
        size: selectedSize,
      }).unwrap();
      setToast({ message: "Added to cart successfully!", type: "success" });
    } catch (error: any) {
      setToast({
        message: error?.data?.message || "Failed to add to cart.",
        type: "error",
      });
    }
  };

  return (
    <Container className="px-6 md:px-14 lg:px-24 py-12">
      <Breadcrumb 
              items={
                [{ label: 'Home', href: '/' }, { label: 'Products', href: '/products' }, { label: product.name, href: `/products/${product._id}` }]
              }
              />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images Section */}
        <div className="flex gap-6">
         {/* Thumbnails */}
{/* Thumbnails */}
<div className="flex flex-col-reverse lg:flex-row gap-x-2 gap-y-2">
  <div className="flex flex-col gap-3">
  {(activeVariant?.images || allImages).map((img, idx) => (
    <img
      key={idx}
      src={img}
      alt={`product-${idx}`}
      onClick={() => setSelectedImage(img)}
      className={`w-20 h-20 lg:w-36 lg:h-36 object-cover rounded-md cursor-pointer border ${
        selectedImage === img ? "border-black" : "border-gray-300"
      }`}
    />
  ))}
</div>

{/* Main Image */}
<div className="flex-1">
  <img
    src={selectedImage || activeVariant?.images?.[0] || allImages[0]}
    alt={product.name}
    className="w-full h-[500px] object-cover rounded-lg"
  />
</div>
</div>


        </div>

        {/* Info Section */}
        <div>
          <h1 className="text-[40px] font-extrabold">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-2 text-yellow-500">
            {Array.from({ length: 5 }).map((_, i) => {
              if (i < fullStars) return <FaStar key={i} />;
              if (i === fullStars && hasHalfStar)
                return <FaStarHalfAlt key={i} />;
              return <FaRegStar key={i} />;
            })}
            <span className="ml-2 text-sm text-gray-600">
              {rating.toFixed(1)}/5
            </span>
          </div>

          <p className="text-gray-600 mt-2">{product.description}</p>

          {/* Price */}
          <div className="mt-6 flex items-center gap-3">
            {product.onSale && product.discountPercentage > 0 ? (
              <>
                <span className="text-2xl font-semibold text-gray-900">
                  ${finalPrice}
                </span>
                <span className="text-lg text-gray-400 line-through">
                  ${product.price}
                </span>
                <span className="text-sm text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                  -{product.discountPercentage}%
                </span>
              </>
            ) : (
              <span className="text-2xl font-semibold text-gray-900">
                ${product.price}
              </span>
            )}
          </div>

          {/* Colors */}
          {colors.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Colors:</h3>
              <div className="flex gap-3">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      setSelectedVariant(color);
                      setSelectedImage(null);
                    }}
                    className={`w-10 h-10 rounded-full border-2 ${
                      selectedVariant === color
                        ? "border-black scale-110"
                        : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color.toLowerCase() }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {sizes.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Sizes:</h3>
              <div className="flex gap-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-full border ${
                      selectedSize === size
                        ? "border-black bg-black text-white"
                        : "border-gray-400 text-gray-700"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity + Add to Cart in one row */}
          <div className="mt-8 flex items-center gap-4">
            {/* Quantity Control */}
            <div className="flex items-center bg-gray-100 rounded-full px-2 py-1">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-1 text-black font-bold"
              >
                -
              </button>
              <span className="w-10 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-3 py-1 text-black font-bold"
              >
                +
              </button>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={adding}
              className="flex-1 px-6 py-3 rounded-full bg-black text-white hover:bg-gray-700 disabled:opacity-50"
            >
              {adding ? "Adding..." : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-16">
        <Reviews productId={product._id} />
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </Container>
  );
}
