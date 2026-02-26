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
        const accessToken = cookieStore.get("accessToken")?.value;

        if (accessToken) {
            headers.Authorization = `Bearer ${accessToken}`;
        }

        const cookieHeader = cookieStore
            .getAll()
            .map((cookie) => `${cookie.name}=${cookie.value}`)
            .join("; ");

        if (cookieHeader) {
            headers.cookie = cookieHeader;
        }
    } else {
        // Client-side: get token from cookie
        const accessToken = document.cookie
            .split('; ')
            .find(row => row.startsWith('accessToken='))
            ?.split('=')[1];

        if (accessToken) {
            headers.Authorization = `Bearer ${accessToken}`;
        }
    }

    return fetch(url, {
        ...options,
        credentials: "include",
        headers,
    });
}