import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "https://pet-adoption-server-q5h9.onrender.com/api/auth",
  fetchOptions: {
    credentials: "include",
  },
});

// ONLY export hooks like this
export const useSession = authClient.useSession;