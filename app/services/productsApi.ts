import { baseApi } from "../api/baseApi";
import { Product, ApiResponse, ProductQuery } from "../types";

interface ProductsResponse {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsResponse, ProductQuery | void>({
      query: (params) => ({
        url: "/products",
        params: params || undefined,
      }),
      transformResponse: (response: { data: Product[]; total: number }) => ({
        items: response.data,
        total: response.total,
        page: 1,
        limit: response.data.length,
        totalPages: 1,
      }),
      providesTags: (result) =>
        result?.items
          ? [
              ...result.items.map(({ _id }) => ({
                type: "Products" as const,
                id: _id,
              })),
              { type: "Products", id: "LIST" },
            ]
          : [{ type: "Products", id: "LIST" }],
    }),
    filterProducts: builder.query<
      ProductsResponse,
      ProductQuery & { color?: string; size?: string; category?: string }
    >({
      query: (params) => ({
        url: "/products/filter",
        params,
      }),
      transformResponse: (response: { data: Product[]; total: number }) => ({
        items: response.data,
        total: response.total,
        page: 1,
        limit: response.data.length,
        totalPages: 1,
      }),
      providesTags: (result) =>
        result?.items
          ? [
              ...result.items.map(({ _id }) => ({
                type: "Products" as const,
                id: _id,
              })),
              { type: "Products", id: "LIST" },
            ]
          : [{ type: "Products", id: "LIST" }],
    }),

    getProduct: builder.query<Product, string>({
      query: (id) => `/products/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Products", id }],
    }),

    createProduct: builder.mutation<ApiResponse<Product>, Partial<Product>>({
      query: (product) => ({
        url: "/products",
        method: "POST",
        body: product,
      }),
      invalidatesTags: [{ type: "Products", id: "LIST" }],
    }),
    updateProduct: builder.mutation<
      ApiResponse<Product>,
      { id: string; product: Partial<Product> }
    >({
      query: ({ id, product }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: product,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Products", id },
        { type: "Products", id: "LIST" },
      ],
    }),
    deleteProduct: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Products", id },
        { type: "Products", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useFilterProductsQuery,
} = productsApi;
