"use client";

import React, { useState } from "react";
import {
  useGetCartQuery,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
} from "../services/cartApi";
import { useCreateOrderMutation } from "../services/ordersApi";
import { useGetCurrentUserQuery } from "../services/userApi";
import Container from "../components/Container";
import Spinner from "../components/Spinner";
import Toast from "../components/Toast";
import Link from "next/link";
import { AiOutlineDelete, AiOutlineArrowRight } from "react-icons/ai";
import { CiShoppingTag } from "react-icons/ci";

export default function CartPage() {
  const { data: cart, isLoading } = useGetCartQuery();
  const [updateItem] = useUpdateCartItemMutation();
  const [removeItem] = useRemoveFromCartMutation();
  const [clearCart] = useClearCartMutation();
  const [createOrder, { isLoading: isPlacingOrder }] = useCreateOrderMutation();
  const { data: user, refetch: refetchUser } = useGetCurrentUserQuery(
    undefined,
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  );

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  }>({
    message: "",
    type: "success",
  });

  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [discountError, setDiscountError] = useState("");

  const SHIPPING_FEE = 15;

  if (isLoading) return <Spinner />;

  const subtotal =
    cart?.items?.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    ) || 0;
  const discountAmount = (subtotal * appliedDiscount) / 100;
  const total = subtotal - discountAmount + SHIPPING_FEE;

  const userLoyaltyPoints = user?.loyaltyPoints || 0;

  const allPointsCheckout =
    cart?.items?.every(
      (item) => item.product.type === "points" || item.product.type === "hybrid"
    ) || false;

  const totalPointsRequired =
    cart?.items?.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    ) || 0;

  const handleQuantityChange = (
    productId: string,
    variant: string | undefined,
    size: string | undefined,
    qty: number
  ) => {
    if (qty < 1) {
      handleRemove(productId, variant, size);
      return;
    }
    updateItem({ product: productId, variant, size, quantity: qty });
  };

  const handleRemove = (productId: string, variant?: string, size?: string) => {
    removeItem({ product: productId, variant, size });
  };

  const handleApplyDiscount = () => {
    setDiscountError("");
    const validDiscounts: Record<string, number> = {
      SAVE10: 10,
      SAVE20: 20,
      WELCOME15: 15,
      STUDENT: 25,
    };

    if (validDiscounts[discountCode.toUpperCase()]) {
      setAppliedDiscount(validDiscounts[discountCode.toUpperCase()]);
      setDiscountCode("");
    } else {
      setDiscountError("Invalid discount code");
    }
  };

  // ✅ Money checkout
  const handlePlaceOrder = async () => {
    if (!cart?.items?.length) return;

    try {
      const orderData = {
        items: cart.items.map((item) => ({
          product: item.product._id,
          variant: item.variant,
          size: item.size,
          quantity: item.quantity,
          price: item.product.price,
        })),
        subtotal,
        discount: discountAmount,
        shipping: SHIPPING_FEE,
        total,
        discountCode: appliedDiscount > 0 ? "Applied" : "",
        status: "pending",
        createdAt: new Date().toISOString(),
        checkoutType: "money",
      };

      await createOrder(orderData).unwrap();
      await clearCart().unwrap();
      await refetchUser().unwrap(); // 🔥 refresh loyalty points

      setToast({ message: "Order placed successfully!", type: "success" });
    } catch (error) {
      console.log("Failed to place order:", error);
      setToast({
        message: "Failed to place order. Please try again.",
        type: "error",
      });
    }
  };

  // ✅ Points checkout
  const handlePointsCheckout = async () => {
    if (!cart?.items?.length) return;

    if (userLoyaltyPoints < totalPointsRequired) {
      setToast({ message: "Not enough loyalty points", type: "error" });
      return;
    }

    try {
      const orderData = {
        items: cart.items.map((item) => ({
          product: item.product._id,
          variant: item.variant,
          size: item.size,
          quantity: item.quantity,
          price: item.product.price,
        })),
        subtotal,
        discount: 0,
        shipping: 0,
        total: totalPointsRequired,
        status: "pending",
        createdAt: new Date().toISOString(),
        checkoutType: "points",
      };

      await createOrder(orderData).unwrap();
      await clearCart().unwrap();
      await refetchUser(); // 🔥 refresh loyalty points

      setToast({
        message: "Order placed with loyalty points!",
        type: "success",
      });
    } catch (error) {
      console.log("Failed to checkout with points:", error);
      setToast({
        message: "Checkout with points failed. Please try again.",
        type: "error",
      });
    }
  };

  if (!cart?.items?.length) {
    return (
      <Container className="px-6 md:px-14 lg:px-24 py-12">
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-500 mb-8">Add some items to get started!</p>
          <Link
            href="/products"
            className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </Container>
    );
  }

  console.log("User:", user);
  return (
    <Container className="px-6 md:px-14 lg:px-24 py-12">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-2 md:p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                Cart Items ({cart.items.length})
              </h2>
              <button
                onClick={() => clearCart()}
                className="text-sm text-red-500 hover:text-red-700 font-medium transition"
              >
                Clear All
              </button>
            </div>

            <div className="space-y-6">
              {cart.items.map((item) => {
                const activeVariant = item.variant
                  ? item.product.variants?.find((v) => v.color === item.variant)
                  : item.product.variants?.[0];

                return (
                  <div
                    key={item._id}
                    className="flex items-center md:gap-4 md:p-4 border-b border-gray-200 rounded-xl hover:shadow-md transition"
                  >
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={activeVariant?.images?.[0] || "/placeholder.png"}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-lg border"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-grow">
                      <h3 className="font-semibold text-lg text-gray-900">
                        {item.product.name}
                      </h3>
                      <div className="text-sm text-gray-600 mt-1">
                        {item.variant && <span>Color: {item.variant}</span>}
                        {item.size && (
                          <span className="ml-2">• Size: {item.size}</span>
                        )}
                      </div>
                      <p className="text-lg font-bold text-gray-900 mt-2">
                        ${item.product.price.toFixed(2)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center md:gap-3">
                      <div className="flex items-center border border-gray-200 rounded-lg">
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              item.product._id,
                              item.variant,
                              item.size,
                              item.quantity - 1
                            )
                          }
                          className="px-1 md:px-3 py-2 hover:bg-gray-100 rounded-l-lg transition"
                        >
                          -
                        </button>
                        <span className="px-1 md:px-4 py-2 font-semibold min-w-[50px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              item.product._id,
                              item.variant,
                              item.size,
                              item.quantity + 1
                            )
                          }
                          className="px-1 md:px-3 py-2 hover:bg-gray-100 rounded-r-lg transition"
                        >
                          +
                        </button>
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={() =>
                          handleRemove(
                            item.product._id,
                            item.variant,
                            item.size
                          )
                        }
                        className="text-red-500 hover:text-red-700 p-2 transition"
                      >
                        <AiOutlineDelete size={20} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-6 space-y-6">
            <h2 className="text-xl font-semibold">Order Summary</h2>

            {/* Loyalty Points */}
            <div className="flex justify-between text-blue-600 font-medium">
              <span>Your Loyalty Points</span>
              <span>{userLoyaltyPoints}</span>
            </div>

            {/* Price Summary */}
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              {appliedDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({appliedDiscount}%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>${SHIPPING_FEE.toFixed(2)}</span>
              </div>

              <hr className="my-4" />

              <div className="flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Discount Code */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Code
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <CiShoppingTag size={20} />
                  </span>
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => {
                      setDiscountCode(e.target.value);
                      setDiscountError("");
                    }}
                    placeholder="Enter code"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <button
                  onClick={handleApplyDiscount}
                  disabled={!discountCode.trim()}
                  className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Apply
                </button>
              </div>
              {discountError && (
                <p className="text-red-500 text-sm mt-1">{discountError}</p>
              )}
            </div>

            {/* Checkout Buttons */}
            <div className="space-y-3">
              {/* Always show Money Checkout */}
              <button
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder || !cart?.items?.length}
                className="w-full py-2 px-8 bg-black text-white rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-lg"
              >
                Checkout with Money <AiOutlineArrowRight size={22} />
              </button>

              {/* Show Points Checkout only if all products are points/hybrid */}
              {allPointsCheckout && (
                <button
                  onClick={handlePointsCheckout}
                  disabled={isPlacingOrder || !cart?.items?.length}
                  className="w-full py-2 px-8 bg-indigo-600 text-white rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-lg"
                >
                  Checkout with Points ({totalPointsRequired})
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: "", type: "success" })}
        />
      )}
    </Container>
  );
}
