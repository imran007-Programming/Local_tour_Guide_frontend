import { headers } from "next/headers";
import { BASE_URL } from "@/lib/config";

export async function getCurrentUser() {
    const headersList = await headers();
    const cookie = headersList.get("cookie") || "";

    // 1️⃣ Try get user
    let res = await fetch(`${BASE_URL}/auth/me`, {
        method: "GET",
        headers: { cookie },
        cache: "no-store",
    });

    // If expired → create a new refreshToken
    if (res.status === 401) {
        const refreshRes = await fetch(`${BASE_URL}/auth/refreshToken`, {
            method: "POST",
            headers: { cookie },
            cache: "no-store",
        });

        // If refresh failed → logout
        if (!refreshRes.ok) return null;

        // IMPORTANT:
        // Extract new Set-Cookie from refresh response
        const setCookie = refreshRes.headers.get("set-cookie");

        if (!setCookie) return null;

        // Retry /me with new cookie
        res = await fetch(`${BASE_URL}/auth/me`, {
            method: "GET",
            headers: {
                cookie: setCookie,
            },
            cache: "no-store",
        });
    }

    if (!res.ok) return null;

    return res.json();
}
