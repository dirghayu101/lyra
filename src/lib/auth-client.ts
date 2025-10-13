import { createAuthClient } from "better-auth/react"

if(!process.env.NEXT_PUBLIC_BASE_URL){
    throw new Error("NEXT_PUBLIC_BASE_URL environment variable is not set.");
}

export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: process.env.NEXT_PUBLIC_BASE_URL
})
