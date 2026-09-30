export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://di4hwknp33n4e.cloudfront.net/api";
export const DEV_BASE_URL = process.env.NEXT_PUBLIC_DEV_BASE_URL || "http://localhost:5000/api";
// Client-side requests go through this proxy to avoid CORS
export const CLIENT_BASE_URL = "/api/backend";
