'use client';

import React, { useState } from 'react';
import {
  useGetProductReviewsQuery,
  useCreateReviewMutation,
} from '../services/reviewsApi';
import { FaStar } from 'react-icons/fa';
import { RiVerifiedBadgeFill } from 'react-icons/ri';
import Toast from './Toast';
import ReviewsSkeleton from "./ReviewSkelton";





export default function Reviews({ productId }: { productId: string }) {
  const { data: reviews = [], refetch, isLoading } = useGetProductReviewsQuery(productId);
  const [createReview] = useCreateReviewMutation();



  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showForm, setShowForm] = useState(false);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) return setToast({ message: 'Please select a rating.', type: 'error' });
    if (!comment.trim()) return setToast({ message: 'Comment cannot be empty.', type: 'error' });

    try {
      await createReview({ product: productId, rating, comment }).unwrap();
      setRating(0);
      setComment('');
      setShowForm(false);
      await refetch();
      setToast({ message: 'Review added successfully!', type: 'success' });
    } catch (err: any) {
      setToast({ message: err?.data?.message || 'Failed to submit review.', type: 'error' });
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

      if (isLoading) return <ReviewsSkeleton />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold mb-6">
          All Reviews <span className="text-gray-600 text-lg">({reviews.length})</span>
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="mb-6 px-6 py-2 rounded-full bg-black text-white hover:bg-gray-800"
        >
          {showForm ? 'Cancel' : 'Write a Review'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 space-y-3 border p-4 rounded-lg shadow-sm"
        >
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <FaStar
                key={i}
                className={`cursor-pointer ${i < rating ? 'text-yellow-500' : 'text-gray-300'}`}
                onClick={() => setRating(i + 1)}
              />
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review..."
            className="w-full border rounded-lg p-3"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 rounded-full bg-gray-900 text-white hover:bg-gray-700 disabled:opacity-50"
          >
            {isLoading ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.length === 0 ? (
          <p className="text-gray-500 col-span-full">No reviews yet.</p>
        ) : (
          reviews.map((r) => (
            <div key={r._id} className="border border-gray-200 rounded-[20px] p-4 shadow-sm">
              <div className="flex flex-col mb-2">
                <div className="flex gap-1 text-yellow-500">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
                <span className="font-bold text-[20px] text-black mt-1 flex items-center gap-1">
                  {r.user?.name || 'Anonymous'} <RiVerifiedBadgeFill className="text-[#01AB31]" />
                </span>
              </div>
              <p className="text-gray-800">{r.comment}</p>
              <span className="text-xs text-gray-500">
                {r.createdAt ? formatDate(r.createdAt) : ''}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Toast */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
