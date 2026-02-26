"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function setAuthCookies(
    accessToken: string,
    refreshToken: string
) {
    const cookieStore = await cookies();

    cookieStore.set("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: 60 * 1000
    });

    cookieStore.set("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: 90 * 24 * 60 * 60 * 1000,

    });
    redirect("/dashboard");
}
