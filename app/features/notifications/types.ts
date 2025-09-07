export type OrderCreatedEvent = {
  orderId: string;
  userName?: string;
  totalAmount: number;
  createdAt: string;
};

export type NotificationItem = {
  id: string; // e.g., orderId or generated uuid
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
};