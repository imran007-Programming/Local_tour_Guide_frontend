# Backend API Endpoints for Notifications

You need to implement these endpoints in your backend:

## 1. Get All Notifications
```
GET /api/notifications
Headers: Authorization: Bearer <token>
Response: Notification[]
```

## 2. Mark Notification as Read
```
PATCH /api/notifications/:id/read
Headers: Authorization: Bearer <token>
Response: { success: boolean }
```

## 3. Mark All as Read
```
PATCH /api/notifications/read-all
Headers: Authorization: Bearer <token>
Response: { success: boolean }
```

## 4. Delete Notification
```
DELETE /api/notifications/:id
Headers: Authorization: Bearer <token>
Response: { success: boolean }
```

## 5. Create Notification (Backend Internal)
```
POST /api/notifications
Body: {
  userId: string,
  type: "BOOKING" | "PAYMENT" | "CANCELLATION" | "REVIEW" | "GENERAL",
  title: string,
  message: string,
  metadata?: {
    bookingId?: string,
    tourId?: string,
    amount?: number
  }
}
```

## When to Create Notifications

### For Guides:
- When a tourist books their tour → type: "BOOKING"
- When payment is received → type: "PAYMENT"
- When a booking is cancelled → type: "CANCELLATION"
- When a tourist leaves a review → type: "REVIEW"

### For Tourists:
- When booking is confirmed by guide → type: "BOOKING"
- When payment is successful → type: "PAYMENT"
- When guide cancels booking → type: "CANCELLATION"

## Example Backend Implementation (Node.js/Express)

```javascript
// After successful booking creation
await createNotification({
  userId: guideId,
  type: "BOOKING",
  title: "New Booking Request",
  message: `${touristName} has booked your tour "${tourName}"`,
  metadata: {
    bookingId: booking.id,
    tourId: tour.id
  }
});

// After successful payment
await createNotification({
  userId: guideId,
  type: "PAYMENT",
  title: "Payment Received",
  message: `Payment of $${amount} received for booking #${bookingId}`,
  metadata: {
    bookingId: booking.id,
    amount: amount
  }
});
```

## Database Schema (Prisma Example)

```prisma
model Notification {
  id        String   @id @default(uuid())
  userId    String
  type      NotificationType
  title     String
  message   String
  isRead    Boolean  @default(false)
  metadata  Json?
  createdAt DateTime @default(now())
  
  user      User     @relation(fields: [userId], references: [id])
}

enum NotificationType {
  BOOKING
  PAYMENT
  CANCELLATION
  REVIEW
  GENERAL
}
```
