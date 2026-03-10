"use server";

import { cookies } from "next/headers";

export async function loginAction(accessToken: string, refreshToken: string) {
    const cookieStore = await cookies();

    cookieStore.set("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 60 * 15,
        path: "/",
    });

    cookieStore.set("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
    });
}
