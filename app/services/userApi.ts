import { baseApi } from "../../app/api/baseApi";
import { User } from "../types";

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => "/users",
      providesTags: ["Users"],
    }),
    getUser: builder.query<User, string>({
      query: (id) => `/users/${id}`,
      providesTags: ["Users"],
    }),
    getCurrentUser: builder.query<User, void>({
      query: () => "/users/me",
      providesTags: (result) =>
        result ? [{ type: "Users", id: "me" }] : [{ type: "Users", id: "me" }],
    }),

    updateUser: builder.mutation<User, { id: string; user: Partial<User> }>({
      query: ({ id, user }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body: user,
      }),
      invalidatesTags: ["Users"],
    }),
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useGetCurrentUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;
