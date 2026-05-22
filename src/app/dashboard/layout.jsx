"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { FolderHeart, PlusCircle, History } from 'lucide-react';

const DashboardLayout = ({ children }) => {
  const pathname = usePathname();

  const getLinkStyle = (path) => {
    const base = "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ";
    return pathname === path ? base + "bg-amber-500 text-white shadow-sm" : base + "text-gray-600 hover:bg-gray-50 hover:text-amber-500";
  };

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 py-10 min-h-screen flex flex-col md:flex-row gap-8">
        {/* Navigation Sidebar Panel */}
        <aside className="w-full md:w-64 shrink-0 flex flex-col gap-2">
          <div className="bg-gray-50 border border-gray-100 p-3 rounded-2xl flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-4 mb-1 block">Account Shell Panels</span>
            <Link href="/my-request" className={getLinkStyle('/my-request')}><History className="h-4 w-4" /> My Requests</Link>
            <Link href="/add-pet" className={getLinkStyle('/add-pet')}><PlusCircle className="h-4 w-4" /> Add Pet Form</Link>
            <Link href="/my-listings" className={getLinkStyle('/my-listings')}><FolderHeart className="h-4 w-4" /> My Listings</Link>
          </div>
        </aside>

        {/* Dynamic Route Context Section */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardLayout;