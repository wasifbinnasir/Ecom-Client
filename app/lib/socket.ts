'use client';

import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getNotificationSocket() {
  if (!socket) {
    // Adjust base URL to your API server if different; supports SSR-friendly env.
    const base =
      process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

    socket = io(`${base}/notifications`, {
      withCredentials: true,
      transports: ['websocket'], // reduce polling overhead
    });
  }
  return socket;
}