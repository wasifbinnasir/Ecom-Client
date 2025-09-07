"use client";

import React, { useState } from "react";
import { FaArrowLeftLong, FaStar } from "react-icons/fa6";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { useGetRecentReviewsQuery } from "../services/reviewsApi";
import Spinner from "./Spinner";
import Container from "./Container";

export default function RecentReviews() {
  const { data: reviews = [], isLoading, isError } = useGetRecentReviewsQuery();
  const [currentIndex, setCurrentIndex] = useState(0);

  if (isLoading) return <Spinner />;
  if (isError)
    return <div className="text-red-600 text-center">Failed to load reviews</div>;

  const nextSlide = () => {
    if (currentIndex < reviews.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <Container className="space-y-8 mx-auto px-2 md:px-8 lg:px-24 min-h-full my-5 pb-5">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-extrabold text-center mt-10">
          Our Happy Customers
        </h1>
        <div className="flex gap-x-3.5">
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className={`text-black p-3 rounded-full shadow hover:bg-gray-200 ${
              currentIndex === 0 ? "opacity-40 cursor-not-allowed" : ""
            }`}
          >
            <FaArrowLeftLong size={18} />
          </button>
          <button
            onClick={nextSlide}
            disabled={currentIndex === reviews.length - 1}
            className={`text-black p-3 rounded-full shadow hover:bg-gray-200 ${
              currentIndex === reviews.length - 1
                ? "opacity-40 cursor-not-allowed"
                : ""
            }`}
          >
            <FaArrowLeftLong size={18} className="transform rotate-180" />
          </button>
        </div>
      </div>

      <div className="overflow-hidden relative mt-6">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {reviews.map((r) => (
            <div
              key={r._id}
              className="min-w-full sm:min-w-[50%] lg:min-w-[33.3333%] px-3"
            >
              <div className="bg-white shadow rounded-2xl p-5 h-full flex flex-col justify-between relative">
                {/* Left/Right preview shadow */}
                <div className="absolute top-0 left-0 h-full w-8 bg-gradient-to-r from-white/70 to-transparent pointer-events-none rounded-l-2xl" />
                <div className="absolute top-0 right-0 h-full w-8 bg-gradient-to-l from-white/70 to-transparent pointer-events-none rounded-r-2xl" />

                {/* Stars */}
                <div className="flex gap-1 text-yellow-500">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>

                {/* User */}
                <span className="font-bold text-[20px] text-black mt-1 flex items-center gap-1">
                  {r.user?.name || "Anonymous"}{" "}
                  <RiVerifiedBadgeFill className="text-[#01AB31]" />
                </span>

                {/* Comment */}
                <p className="mt-3 text-gray-800">{r.comment}</p>

                {/* Meta */}
                <div className="mt-4 text-sm text-gray-500">
                  <p>On {r.product?.name || "Product"}</p>
                  <p>{new Date(r.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
