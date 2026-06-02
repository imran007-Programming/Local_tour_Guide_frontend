import { cookies } from "next/headers";
import { BASE_URL } from "@/lib/config";

export async function getCurrentUser() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
        return null;
    }

    const headers: Record<string, string> = {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
    };

    try {
        const res = await fetch(`${BASE_URL}/auth/me`, {
            method: "GET",
            headers,
            cache: "no-store",
        });

        if (!res.ok) return null;

        return res.json();
    } catch (error) {
        return null;
    }
}