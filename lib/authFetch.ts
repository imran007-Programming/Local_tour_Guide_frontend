import { getNewAccessToken } from "@/app/actions/newAccessToken";
import { BASE_URL, CLIENT_BASE_URL } from "./config";

export async function authFetch(
    url: string,
    options: RequestInit = {}
) {
    const isServer = typeof window === "undefined";
    const headers: Record<string, string> = {
        ...(options.headers as Record<string, string>),
    };

    // Only set Content-Type if body is not FormData
    if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
        headers["Content-Type"] = "application/json";
    }

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
            // CloudFront strips Authorization; the backend also reads this cookie
            headers.Cookie = `accessToken=${accessToken}`;
        }
    }
    // In the browser, requests go through the /api/backend rewrite, which
    // forwards the httpOnly auth cookies, so no token lookup is needed.

    const resolvedUrl = isServer ? url : url.replace(BASE_URL, CLIENT_BASE_URL);

    return fetch(resolvedUrl, {
        ...options,
        credentials: "include",
        headers,
    });
}
