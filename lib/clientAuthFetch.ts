import { BASE_URL, CLIENT_BASE_URL } from "./config";

// Browser requests go through the /api/backend rewrite, which forwards the
// httpOnly auth cookies to the backend, so no token lookup is needed here.
export async function clientAuthFetch(url: string, options: RequestInit = {}) {
    const resolvedUrl = url.replace(BASE_URL, CLIENT_BASE_URL);

    return fetch(resolvedUrl, {
        ...options,
        credentials: "include",
    });
}
