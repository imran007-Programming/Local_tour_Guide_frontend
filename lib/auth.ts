import { cache } from "react";
import { cookies } from "next/headers";
import { BASE_URL } from "@/lib/config";

// Wrapped in cache() so the layout and page share a single /auth/me request
// per render instead of each calling the backend.
export const getCurrentUser = cache(async () => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
        return null;
    }

    // CloudFront strips the Authorization header before it reaches the backend,
    // so the token is also sent as the cookie the backend reads first.
    const headers: Record<string, string> = {
        Authorization: `Bearer ${accessToken}`,
        Cookie: `accessToken=${accessToken}`,
        "Content-Type": "application/json",
    };

    try {
        const res = await fetch(`${BASE_URL}/auth/me`, {
            method: "GET",
            headers,
            cache: "no-store",
        });

        if (!res.ok) return null;

        return res.json();
    } catch {
        return null;
    }
});
