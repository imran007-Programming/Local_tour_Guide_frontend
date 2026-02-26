"use server";

import { cookies } from "next/headers";

export async function setAuthCookies(
    accessToken: string,

) {
    const cookieStore = await cookies();

    cookieStore.set("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: 15 * 60 * 1000
    });



}
