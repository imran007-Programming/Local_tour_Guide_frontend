import { getNewAccessToken } from "@/app/actions/newAccessToken";
import { BASE_URL } from "./config";

export async function authFetch(
    url: string,
    options: RequestInit = {}
) {
    const isServer = typeof window === "undefined";
    const headers: Record<string, string> = {
        ...(options.headers as Record<string, string>),
    };

    if (isServer) {
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        let accessToken = cookieStore.get("accessToken")?.value;

        // Refresh token if needed before making request
        if (url !== `${BASE_URL}/auth/refreshToken`) {
            const tokenResult = await getNewAccessToken();
            if (tokenResult.tokenRefreshed && tokenResult.accessToken) {
                accessToken = tokenResult.accessToken;
            }
        }

        if (accessToken) {
            headers.Authorization = `Bearer ${accessToken}`;
        }

        // Forward all cookies to backend
        const cookieHeader = cookieStore
            .getAll()
            .map((cookie) => `${cookie.name}=${cookie.value}`)
            .join("; ");

        if (cookieHeader) {
            headers.cookie = cookieHeader;
        }
    }

    return fetch(url, {
        ...options,
        credentials: "include",
        headers,
    });
}
