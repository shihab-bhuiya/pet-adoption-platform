import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "https://pet-adoption-server-q5h9.onrender.com",
  // CRITICAL CONFIGURATION: Forces the client request mapping to pass secure cookie payloads
  fetchOptions: {
    credentials: "include"
  }
});

export const { useSession, signIn, signUp, signOut, SessionProvider } = authClient;