import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/",
    prepareHeaders: (headers) => {
      // 👇 read token from localStorage
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ["Products", "Categories", "Orders", "Users", "Cart","Reviews","Notifications"],
  endpoints: () => ({}),
});
