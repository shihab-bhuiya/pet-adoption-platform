"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    // If the session check is complete and no valid user is found, redirect to login
    if (!isPending && !session?.user) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  // Mandatory Reload State Check: Displays a clean animated spinner during a hard refresh
  if (isPending) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-3">
        <div className="h-8 w-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-gray-400 tracking-wide uppercase animate-pulse">
          Hydrating User Session...
        </p>
      </div>
    );
  }

  // Render the dashboard/private children routes if the user is securely logged in
  return session?.user ? <>{children}</> : null;
};

export default ProtectedRoute;