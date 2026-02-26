"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function setAuthCookies(
    accessToken: string,
    // refreshToken: string
) {
    const cookieStore = await cookies();

    cookieStore.set("accessToken", accessToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 15 * 60
    });

    // cookieStore.set("refreshToken", refreshToken, {
    //     httpOnly: false,
    //     secure: process.env.NODE_ENV === "production",
    //     sameSite: "lax",
    //     path: "/",
    //     maxAge: 7 * 24 * 60 * 60
    // });

    redirect("/dashboard");
}
