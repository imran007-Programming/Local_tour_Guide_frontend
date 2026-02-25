import {
    LayoutDashboard,
    Calendar,
    Map,
    Users,
    DollarSign,
    Heart,
    Star,
    UserPen,

    Bell,
    Wallet,
} from "lucide-react";

export const getSectionsByRole = (role: string) => {
    const commonAccount = [
        { href: "/dashboard/profile", icon: UserPen, label: "My Profile" },
        { href: "/dashboard/settings", icon: Users, label: "Settings" },
    ];

    if (role === "GUIDE") {
        return [
            {
                title: "Main",
                items: [
                    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
                    { href: "/dashboard/requests", icon: Bell, label: "Pending Requests" },
                    { href: "/dashboard/bookings", icon: Calendar, label: "Upcoming Bookings" },
                    { href: "/dashboard/listings", icon: Map, label: "My Listings" },
                    { href: "/dashboard/reviews", icon: Star, label: "Reviews" },
                ],
            },
            {
                title: "Finance",
                items: [
                    { href: "/dashboard/earnings", icon: DollarSign, label: "Earnings" },
                ],
            },
            {
                title: "Account",
                items: commonAccount,
            },
        ];
    }

    if (role === "TOURIST") {
        return [
            {
                title: "Main",
                items: [
                    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
                    { href: "/dashboard/bookings", icon: Calendar, label: "My Bookings" },
                    { href: "/dashboard/wishlist", icon: Heart, label: "Wishlist" },
                    { href: "/dashboard/reviews", icon: Star, label: "My Reviews" },
                ],
            },
            {
                title: "Account",
                items: commonAccount,
            },
        ];
    }

    if (role === "ADMIN") {
        return [
            {
                title: "Main",
                items: [
                    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
                    { href: "/dashboard/users", icon: Users, label: "User Management" },
                    { href: "/dashboard/listings", icon: Map, label: "Listing Management" },
                    { href: "/dashboard/bookings", icon: Calendar, label: "Booking Management" },
                ],
            },
            {
                title: "Account",
                items: commonAccount,
            },
        ];
    }

    return [];
};
