'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotificationItem } from './types';

type NotificationsState = {
  items: NotificationItem[];
  unreadCount: number;
  modalOpen: boolean;
};

const initialState: NotificationsState = {
  items: [],
  unreadCount: 0,
  modalOpen: false,
};

const slice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setAll(state, action: PayloadAction<NotificationItem[]>) {
      state.items = action.payload;
      state.unreadCount = state.items.filter((n) => !n.read).length;
    },
    addNotification(state, action: PayloadAction<NotificationItem>) {
      state.items.unshift(action.payload);
      if (!action.payload.read) state.unreadCount += 1;
    },
    markAllRead(state) {
      state.items = state.items.map((n) => ({ ...n, read: true }));
      state.unreadCount = 0;
    },
    setModalOpen(state, action: PayloadAction<boolean>) {
      state.modalOpen = action.payload;
    },
    clearNotifications(state) {
      state.items = [];
      state.unreadCount = 0;
    },
  },
});

export const { setAll, addNotification, markAllRead, setModalOpen, clearNotifications } =
  slice.actions;

export default slice.reducer;