import { BASE_URL } from "./config";

async function refreshAccessToken() {
    const refreshToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('refreshToken='))
        ?.split('=')[1];

    if (!refreshToken) return null;

    try {
        const response = await fetch(`${BASE_URL}/auth/refreshToken`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
            credentials: "include"
        });

        if (response.ok) {
            const data = await response.json();
            const newAccessToken = data?.data;
            
            if (newAccessToken) {
                document.cookie = `accessToken=${newAccessToken}; path=/; max-age=10; SameSite=Lax${process.env.NODE_ENV === "production" ? "; Secure" : ""}`;
                return newAccessToken;
            }
        }
    } catch (error) {
        console.error("Token refresh failed:", error);
    }
    
    return null;
}

export async function clientAuthFetch(url: string, options: RequestInit = {}) {
    let accessToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('accessToken='))
        ?.split('=')[1];

    if (!accessToken) {
        accessToken = await refreshAccessToken();
    }

    const headers: Record<string, string> = {
        ...(options.headers as Record<string, string>),
    };

    if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
    }

    return fetch(url, {
        ...options,
        credentials: "include",
        headers,
    });
}
