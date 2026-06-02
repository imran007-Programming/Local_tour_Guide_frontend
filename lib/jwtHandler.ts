/* eslint-disable @typescript-eslint/no-explicit-any */
import { jwtVerify } from "jose"

export const verifyAccessToken = async (token: string) => {
    try {
        const secret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET!)
        const { payload } = await jwtVerify(token, secret)

        return {
            success: true,
            message: "Token is valid",
            payload
        }
    } catch (error: any) {
        return {
            success: false,
            message: error?.message || "Invalid token"
        }
    }
}
