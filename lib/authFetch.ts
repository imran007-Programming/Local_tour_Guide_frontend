import { BASE_URL } from "./config";

export async function authFetch(url: string, options: RequestInit = {}) {
    let res = await fetch(url, {
        ...options,
        credentials: "include",
    });

    if (res.status === 401) {
        const refreshRes = await fetch(`${BASE_URL}/auth/refreshToken`, {
            method: "POST",
            credentials: "include",
        });

        if (!refreshRes.ok) {
            if (typeof window !== "undefined") {
                window.location.href = "/";
            }
            return null;
        }

        res = await fetch(url, {
            ...options,
            credentials: "include",
        });
    }

    return res;
}