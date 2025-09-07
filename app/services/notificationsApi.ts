import { baseApi } from '../../app/api/baseApi';

export type Notification = {
  _id: string;
  type: 'ORDER_CREATED';
  title: string;
  message: string;
  orderId?: string | null;
  read: boolean;
  createdAt: string;
  readAt?: string | null;
};

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  pages: number;
  limit: number;
};

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<
      Paginated<Notification>,
      { page?: number; limit?: number; read?: boolean } | void
    >({
      query: (params) => {
        const search = new URLSearchParams();
        if (params?.page) search.set('page', String(params.page));
        if (params?.limit) search.set('limit', String(params.limit));
        if (typeof params?.read === 'boolean') search.set('read', String(params.read));
        const qs = search.toString();
        return `/notifications${qs ? `?${qs}` : ''}`;
      },
      providesTags: ['Notifications'],
    }),
    getUnreadCount: builder.query<{ count: number }, void>({
      query: () => '/notifications/unread-count',
      providesTags: ['Notifications'],
    }),
    markAllRead: builder.mutation<{ success: true }, void>({
      query: () => ({
        url: '/notifications/mark-all-read',
        method: 'PATCH',
      }),
      invalidatesTags: ['Notifications'],
    }),
    markRead: builder.mutation<Notification, string>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Notifications'],
    }),
    deleteNotification: builder.mutation<{ success: true }, string>({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Notifications'],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAllReadMutation,
  useMarkReadMutation,
  useDeleteNotificationMutation,
} = notificationsApi;