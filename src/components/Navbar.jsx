"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient, useSession } from "@/lib/auth-client";
import {
  Heart,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  PlusCircle,
  FileText,
  User,
} from "lucide-react";

const Navbar = () => {
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const isUserLoggedIn = !!session?.user;

  const getLinkStyle = (path) => {
    const base = "text-sm font-medium tracking-wide transition-colors ";
    return pathname === path
      ? base + "text-amber-500 font-bold border-b-2 border-amber-500 pb-1"
      : base + "text-gray-600 hover:text-amber-500";
  };

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      setIsOpen(false);
      window.location.replace("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Left Side: Brand Identity Logo */}
        <Link href="/" className="flex items-center gap-2 text-gray-900 group">
          <div className="h-8 w-8 bg-amber-500 rounded-xl flex items-center justify-center text-white shadow-sm">
            <Heart className="h-4 w-4 fill-white" />
          </div>
          <span className="font-black text-base tracking-tight uppercase text-gray-800">
            ForeverHome
          </span>
        </Link>

        {/* Center: Flat Navigation Links (Shows Forms & Dashboard directly if logged in) */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className={getLinkStyle("/")}>Home</Link>
          <Link href="/AllPets" className={getLinkStyle("/AllPets")}>All Pets</Link>

          {isUserLoggedIn && (
            <>
              <Link href="/my-request" className={getLinkStyle("/my-request")}>
                <span className="flex items-center gap-1">
                  <FileText className="h-4 w-4" /> My Requests
                </span>
              </Link>

              <Link href="/add-pet" className={getLinkStyle("/add-pet")}>
                <span className="flex items-center gap-1">
                  <PlusCircle className="h-4 w-4" /> Add Pet
                </span>
              </Link>

              <Link href="/my-listings" className={getLinkStyle("/my-listings")}>
                <span className="flex items-center gap-1">
                  <LayoutDashboard className="h-4 w-4 text-amber-500" /> Dashboard
                </span>
              </Link>
            </>
          )}
        </div>

        {/* Right Side: Flat Auth Section (Matches your project snapshot exactly) */}
        <div className="hidden md:flex items-center gap-4">
          {isPending ? (
            <div className="h-8 w-24 bg-gray-100 animate-pulse rounded-md" />
          ) : isUserLoggedIn ? (
            <div className="flex items-center gap-4 animate-fade-in">
              {/* User Identity Frame Container */}
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full">
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    className="h-6 w-6 rounded-full object-cover border border-gray-200"
                    alt="avatar"
                  />
                ) : (
                  <User className="h-4 w-4 text-gray-500" />
                )}
                <span className="text-sm font-semibold text-gray-800 max-w-[140px] truncate">
                  {session.user.name}
                </span>
              </div>

              {/* Direct Inline Log Out Operation Trigger */}
              <button
                onClick={handleLogout}
                className="border border-gray-300 hover:border-red-500 hover:bg-red-50 text-gray-700 hover:text-red-600 text-sm font-bold px-4 py-1.5 rounded-md transition-all shadow-sm"
              >
                Log Out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold px-5 py-2 rounded-md transition-all shadow-sm"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Layout Interactive Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-gray-600 focus:outline-none">
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer Navigation Blocks */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-2 text-xs font-semibold">
          <Link href="/" onClick={() => setIsOpen(false)} className="block p-2 text-gray-600">Home</Link>
          <Link href="/AllPets" onClick={() => setIsOpen(false)} className="block p-2 text-gray-600">All Pets</Link>

          {isUserLoggedIn ? (
            <>
              <Link href="/my-request" onClick={() => setIsOpen(false)} className="block p-2 text-gray-600">
                My Requests
              </Link>
              <Link href="/add-pet" onClick={() => setIsOpen(false)} className="block p-2 text-gray-600">
                Add Pet
              </Link>
              <Link href="/my-listings" onClick={() => setIsOpen(false)} className="block p-2 text-amber-600 flex items-center gap-1">
                <LayoutDashboard className="h-3.5 w-3.5" /> Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left text-red-600 p-2 border-t mt-2 flex items-center gap-1"
              >
                <LogOut className="h-3.5 w-3.5" /> Logout
              </button>
            </>
          ) : (
            <Link href="/login" onClick={() => setIsOpen(false)} className="block bg-amber-500 text-center text-white p-2.5 rounded-xl mt-2">
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;