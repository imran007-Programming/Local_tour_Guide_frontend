export type NotificationType = "BOOKING" | "PAYMENT" | "CANCELLATION" | "REVIEW" | "GENERAL";

export type Notification = {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  metadata?: {
    bookingId?: string;
    tourId?: string;
    amount?: number;
  };
};
