export async function authFetch(
    url: string,
    options: RequestInit = {}
) {
    const isServer = typeof window === "undefined";
    console.log(isServer)

    const headers: Record<string, string> = {
        ...(options.headers as Record<string, string>),
    };


    if (isServer) {
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();

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