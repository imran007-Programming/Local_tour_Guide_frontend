import { cookies } from "next/headers";
import { BASE_URL } from "@/lib/config";

export async function getCurrentUser() {
    const cookieStore = await cookies();

    const cookieHeader = cookieStore
        .getAll()
        .map((cookie) => `${cookie.name}=${cookie.value}`)
        .join("; ");



    const res = await fetch(`${BASE_URL}/auth/me`, {
        method: "GET",
        headers: {
            cookie: cookieHeader,
        },
        credentials: "include",
        cache: "no-store",
    });

    if (!res.ok) return null;

    return res.json();
}