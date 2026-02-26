import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function proxy(request: NextRequest) {
    const token = request.cookies.get("accessToken")?.value;
    const pathname = request.nextUrl.pathname;
    console.log("token", token)
    // Redirect to home if no token and trying to access dashboard
    if (!token && pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    // If token exists, verify and check role-based access
    if (token && pathname.startsWith("/dashboard")) {
        try {
            const secret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET || "your-secret-key");
            const { payload } = await jwtVerify(token, secret);
            const role = payload.role as string;

            // Role-based route protection
            if (pathname.startsWith("/dashboard/listings") && role !== "GUIDE" && role !== "ADMIN") {
                return NextResponse.redirect(new URL("/dashboard", request.url));
            }

            if (pathname.startsWith("/dashboard/earnings") && role !== "GUIDE") {
                return NextResponse.redirect(new URL("/dashboard", request.url));
            }

            if (pathname.startsWith("/dashboard/wishlist") && role !== "TOURIST") {
                return NextResponse.redirect(new URL("/dashboard", request.url));
            }

            if (pathname.startsWith("/dashboard/users") && role !== "ADMIN") {
                return NextResponse.redirect(new URL("/dashboard", request.url));
            }
        } catch (error) {
            // Invalid token, redirect to home
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"],
};