"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function setAuthCookies(
    accessToken: string,

) {
    const cookieStore = await cookies();

    cookieStore.set("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: 60 * 1000
    });



}
