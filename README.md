# 🗺️ Local Guide Tour Platform

A modern tour booking platform connecting tourists with local guides for authentic travel experiences.

## 📋 Project Overview

This platform enables tourists to discover and book tours with verified local guides. Guides can create listings, manage bookings, and track earnings, while tourists can explore tours, make bookings, and manage their wishlist.

## 👥 User Roles

- **Tourist** - Browse tours, book experiences, manage wishlist, leave reviews
- **Guide** - Create tour listings, manage bookings, track earnings, respond to requests
- **Admin** - Manage users, listings, and bookings

## ✨ Key Features

### For Tourists
- Browse and search tours by location, category, and price
- Add tours to wishlist
- Book tours with secure payment (Stripe)
- Leave reviews and ratings
- Manage bookings and view history

### For Guides
- Create and manage tour listings
- Accept/reject booking requests
- Track earnings and completed tours
- View pending and upcoming bookings
- Manage profile and expertise

### For Admins
- User management
- Listing management
- Booking oversight
- Platform analytics

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Date Handling**: date-fns
- **Notifications**: Sonner (Toast)
- **Image Optimization**: Next.js Image

### Backend (API Integration)
- **Authentication**: JWT with HTTP-only cookies
- **Payment**: Stripe
- **API Calls**: Fetch API with custom authFetch wrapper

### State Management
- React Hooks (useState, useEffect)
- Custom event system for global modals

### Development Tools
- **Package Manager**: npm/bun
- **Linting**: ESLint
- **Type Checking**: TypeScript

## 📁 Project Structure

```
frontend/
├── app/
│   ├── (main)/              # Public pages
│   │   ├── explore/         # Tour listing
│   │   ├── tours/[id]/      # Tour details
│   │   └── page.tsx         # Home page
│   ├── dashboard/           # Protected dashboard
│   │   ├── bookings/        # Booking management
│   │   ├── earnings/        # Guide earnings
│   │   ├── listings/        # Tour listings
│   │   ├── requests/        # Pending requests
│   │   ├── settings/        # User settings
│   │   ├── wishlist/        # Tourist wishlist
│   │   └── profile/         # User profile
│   └── layout.tsx           # Root layout
├── components/
│   ├── Auth/                # Login/Register modals
│   ├── home/                # Landing page components
│   ├── navbar/              # Navigation
│   └── ui/                  # Reusable UI components
├── lib/
│   ├── auth.ts              # Auth utilities
│   ├── authFetch.ts         # API wrapper
│   └── config.ts            # Environment config
└── types/                   # TypeScript types
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- Backend API running

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies
```bash
npm install
# or
bun install
```

3. Set up environment variables
```bash
# Create .env file
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

4. Run development server
```bash
npm run dev
# or
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## 🎨 Features Breakdown

### Authentication
- JWT-based authentication with HTTP-only cookies
- Role-based access control (Tourist, Guide, Admin)
- Protected routes and API calls
- Global modal system for login/register

### Booking System
- Real-time booking status (PENDING, CONFIRMED, COMPLETED, CANCELLED)
- Payment integration with Stripe
- Booking filters and search
- Date-based tour scheduling

### Payment Integration
- Stripe checkout for secure payments
- Payment status tracking
- Earnings dashboard for guides
- Transaction history

### Wishlist
- Add/remove tours from wishlist
- Persistent wishlist storage
- Quick access from dashboard

### Reviews & Ratings
- 5-star rating system
- Written reviews
- Guide average ratings
- Review management

### Settings
- Account settings (password change)
- Notification preferences
- Privacy controls
- Language and currency selection
- Payment settings (for guides)

## 🌙 Dark Mode

Full dark mode support across all pages using Tailwind CSS dark mode classes.

## 📱 Responsive Design

Mobile-first design with responsive layouts for all screen sizes.

## 🔒 Security Features

- HTTP-only cookies for auth tokens
- Protected API routes
- Role-based access control
- Input validation
- XSS protection

## 🤝 Contributing

Contributions by **JIN** (32 kg only) 😊

## 📄 License

This project is private and proprietary.

## 📞 Support

For support, email info@example.com or call +1 56565 56594

---

**Note**: Take care during heavy rainfall or wind! 🌧️💨
