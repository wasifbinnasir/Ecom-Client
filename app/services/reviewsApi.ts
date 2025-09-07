import { baseApi } from "../api/baseApi";
import {
  ProductReview,
  ApiResponse,
  CreateProductReviewDto,
  UpdateProductReviewDto,
} from "../types";

export const reviewsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all reviews for a product
    getProductReviews: builder.query<ProductReview[], string>({
      query: (productId) => `/reviews/product/${productId}`,
      providesTags: (result, error, productId) =>
        result
          ? [
              ...result.map(({ _id }) => ({
                type: "Reviews" as const,
                id: _id,
              })),
              { type: "Reviews", id: productId },
            ]
          : [{ type: "Reviews", id: productId }],
    }),

    // Get a single review
    getReview: builder.query<ProductReview, string>({
      query: (reviewId) => `/reviews/${reviewId}`,
      providesTags: (_result, _error, id) => [{ type: "Reviews", id }],
    }),

    // Create a review
    createReview: builder.mutation<
      ApiResponse<ProductReview>,
      CreateProductReviewDto
    >({
      query: (review) => ({
        url: "/reviews",
        method: "POST",
        body: review,
      }),
      invalidatesTags: (result, _error, { product }) => [
        { type: "Reviews", id: product },
        { type: "Products", id: product },
      ],
    }),

    // Update a review
    updateReview: builder.mutation<
      ApiResponse<ProductReview>,
      { id: string; review: UpdateProductReviewDto }
    >({
      query: ({ id, review }) => ({
        url: `/reviews/${id}`,
        method: "PATCH",
        body: review,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Reviews", id }],
    }),

    // Delete a review
    deleteReview: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/reviews/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [{ type: "Reviews", id }],
    }),

    // Get user's review for a product
    getUserProductReview: builder.query<ProductReview | null, string>({
      query: (productId) => `/reviews/user/product/${productId}`,
      providesTags: (_result, _error, productId) => [
        { type: "Reviews", id: `user-${productId}` },
      ],
    }),
    // reviewsApi.ts
    getRecentReviews: builder.query<ProductReview[], void>({
      query: () => "/reviews/recent",
      providesTags: [{ type: "Reviews", id: "RECENT" }],
    }),
  }),
});

export const {
  useGetProductReviewsQuery,
  useGetReviewQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useGetUserProductReviewQuery,
  useGetRecentReviewsQuery,
} = reviewsApi;
