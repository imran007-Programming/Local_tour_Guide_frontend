import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { getNewAccessToken } from "./app/actions/newAccessToken";

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const hasAccessTokenSearchParams = request.nextUrl.searchParams.has('tokenRefreshed')

    if (hasAccessTokenSearchParams) {
        const url = request.nextUrl.clone();
        url.searchParams.delete('tokenRefreshed');
        return NextResponse.redirect(url)
    }

    const tokenRefreshResult = await getNewAccessToken();

    if (tokenRefreshResult.tokenRefreshed && tokenRefreshResult.accessToken) {
        const url = request.nextUrl.clone();
        const response = NextResponse.redirect(url);
        // Same settings as loginAction; a short maxAge here forced a refresh
        // and redirect on almost every dashboard navigation.
        response.cookies.set("accessToken", tokenRefreshResult.accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 15 * 60,
            path: "/",
        });
        return response;
    }

    const token = tokenRefreshResult.accessToken;

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