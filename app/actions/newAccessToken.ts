/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"
import { authFetch } from "@/lib/authFetch"
import { verifyAccessToken } from "@/lib/jwtHandler"
import { cookies } from "next/headers"


export async function getNewAccessToken() {
    try {
        const accessToken = (await cookies()).get("accessToken")?.value
        const refreshToken = (await cookies()).get("refreshToken")?.value

        if (!accessToken && !refreshToken) {
            return {
                tokenRefreshed: false
            }
        }

        if (accessToken) {
            const verifyToken = await verifyAccessToken(accessToken);
            if (verifyToken.success) {
                return {
                    tokenRefreshed: false,
                    accessToken: accessToken
                }
            }
        }

        if (!refreshToken) return { tokenRefreshed: false }

        const response = await authFetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/refreshToken`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                refreshToken
            })
        })
        const data = await response.json()

        if (!response.ok) {
            return { tokenRefreshed: false }
        }



        const newAccessToken = data?.data

        if (!newAccessToken) {
            return { tokenRefreshed: false }
        }

        const cookieStore = await cookies()
        cookieStore.set("accessToken", newAccessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 15 * 60,
            path: "/"
        })

        return {
            tokenRefreshed: true,
            accessToken: newAccessToken,
            message: "token refreshed successfully"
        }


    } catch (error: unknown) {
        return {
            tokenRefreshed: false,
            success: false,
            message: error instanceof Error ? error.message : "something went wrong"
        }
    }
}