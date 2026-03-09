/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"
import { authFetch } from "@/lib/authFetch"
import { verifyAccessToken } from "@/lib/jwtHandler"
import { cookies } from "next/headers"


export async function getNewAccessToken() {
    try {
        const accessToken = (await cookies()).get("accessToken")?.value
        const refreshToken = (await cookies()).get("refreshToken")?.value
        console.log(refreshToken)

        console.log("[Token Check] accessToken:", accessToken ? "exists" : "missing")
        console.log("[Token Check] refreshToken:", refreshToken ? "exists" : "missing")

        if (!accessToken && !refreshToken) {
            console.log("[Token Check] No tokens found")
            return {
                tokenRefreshed: false
            }
        }

        if (accessToken) {
            const verifyToken = await verifyAccessToken(accessToken);
            console.log("[Token Check] Verification result:", verifyToken.success ? "valid" : "invalid")
            if (verifyToken.success) {
                return {
                    tokenRefreshed: false,
                    accessToken: accessToken
                }
            }
        }

        if (!refreshToken) return { tokenRefreshed: false }

        console.log("[Token Refresh] Calling refresh API...")
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
        console.log(data)

        if (!response.ok) {
            return { tokenRefreshed: false }
        }



        console.log("accessToken refreshsed")
        const newAccessToken = data?.data

        if (!newAccessToken) {
            console.log("[Token Refresh] No accessToken in response")
            return { tokenRefreshed: false }
        }

        console.log("[Token Refresh] New token received, setting cookie...")

        const cookieStore = await cookies()
        // cookieStore.delete("accessToken")
        cookieStore.set("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 10
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