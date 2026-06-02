
import { getAccessToken } from "@/app/actions/getAccessToken";
import { BASE_URL, CLIENT_BASE_URL } from "./config";

export async function clientAuthFetch(url: string, options: RequestInit = {}) {
    const accessToken = await getAccessToken();

    const headers: Record<string, string> = {
        ...(options.headers as Record<string, string>),
    };

    if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
    }

    const resolvedUrl = url.replace(BASE_URL, CLIENT_BASE_URL);

    return fetch(resolvedUrl, {
        ...options,
        credentials: "include",
        headers,
    });
}
