import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    // If your backend server runs on a different URL in production, 
    // Better Auth will look at this base path to manage cookies/sessions.
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
});

// Export the specific hooks your UI components are calling
export const { useSession, signIn, signOut, signUp } = authClient;