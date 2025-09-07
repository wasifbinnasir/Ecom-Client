import { baseApi } from "../../app/api/baseApi";
import { Cart, AddToCartDto, ApiResponse, UpdateCartItemDto } from "../types";

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get user's cart
    getCart: builder.query<Cart, void>({
      query: () => "/cart",
      providesTags: ["Cart"],
    }),

    // Add item to cart
    addToCart: builder.mutation<ApiResponse<Cart>, AddToCartDto>({
      query: (dto) => ({
        url: "/cart",
        method: "POST",
        body: dto,
      }),
      invalidatesTags: ["Cart"],
    }),

    // Update cart item quantity
    updateCartItem: builder.mutation<ApiResponse<Cart>, UpdateCartItemDto>({
      query: (dto) => ({
        url: "/cart", // ✅ matches controller
        method: "PUT",
        body: dto, // { product, variant, size, quantity }
      }),
      invalidatesTags: ["Cart"],
    }),

    // Remove cart item
    removeFromCart: builder.mutation<
      ApiResponse<Cart>,
      { product: string; variant?: string; size?: string }
    >({
      query: ({ product, variant, size }) => ({
        url: `/cart/${product}?variant=${variant ?? ""}&size=${size ?? ""}`, // ✅
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    // Clear entire cart
    clearCart: builder.mutation<ApiResponse<void>, void>({
      query: () => ({
        url: "/cart",
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
} = cartApi;
