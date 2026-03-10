
import { getAccessToken } from "@/app/actions/getAccessToken";

export async function clientAuthFetch(url: string, options: RequestInit = {}) {
    const accessToken = await getAccessToken();

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
