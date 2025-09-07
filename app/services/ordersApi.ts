import { baseApi } from "../../app/api/baseApi";
import { Order } from "../types";

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<Order[], void>({
      query: () => "/orders",
      providesTags: ["Orders"],
    }),
    getOrder: builder.query<Order, string>({
      query: (id) => `/orders/${id}`,
      providesTags: ["Orders"],
    }),
    createOrder: builder.mutation<
      Order,
      Partial<Order> & { checkoutType?: "money" | "points" }
    >({
      query: (order) => ({
        url: "/orders",
        method: "POST",
        body: order,
      }),
      invalidatesTags: (result, error, arg) => [
        "Orders",
        { type: "Users", id: "me" },
      ],
    }),

    updateOrder: builder.mutation<Order, { id: string; order: Partial<Order> }>(
      {
        query: ({ id, order }) => ({
          url: `/orders/${id}`,
          method: "PUT",
          body: order,
        }),
        invalidatesTags: ["Orders"],
      }
    ),
    deleteOrder: builder.mutation<void, string>({
      query: (id) => ({
        url: `/orders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Orders"],
    }),
    getRecentOrders: builder.query<Order[], void>({
      query: () => "/orders?limit=5",
      providesTags: ["Orders"],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useGetRecentOrdersQuery,
} = ordersApi;
