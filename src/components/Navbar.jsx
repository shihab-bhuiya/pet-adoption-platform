"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from '@/lib/auth-client';
import { Heart, LogOut, Menu, X, LayoutDashboard, PlusCircle, FileText } from 'lucide-react';

const Navbar = () => {
  const pathname = usePathname();
  const { data: session, isPending, refetch } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [backupSync, setBackupSync] = useState(false);

  // Monitors hard logins to eliminate state freezing instantly
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const marker = localStorage.getItem("session_active");
      if (marker === "true") {
        setBackupSync(true);
        refetch(); // Forces better-auth to fetch the newly dropped backend session data
      }
    }
  }, [pathname, refetch]);

  const getLinkStyle = (path) => {
    const base = "text-xs font-bold tracking-wide transition-colors ";
    return pathname === path 
      ? base + "text-amber-500 font-extrabold" 
      : base + "text-gray-600 hover:text-amber-500";
  };

  const handleLogout = async () => {
    try {
      await signOut();
      if (typeof window !== 'undefined') {
        localStorage.removeItem("session_active");
      }
      setShowDropdown(false);
      setIsOpen(false);
      window.location.replace("/");
    } catch (err) {
      console.error("Logout state drop exception:", err);
    }
  };

  // True State Verification Flag
  const isUserLoggedIn = session?.user || backupSync;

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        <Link href="/" className="flex items-center gap-2 text-gray-900 group">
          <div className="h-8 w-8 bg-amber-500 rounded-xl flex items-center justify-center text-white">
            <Heart className="h-4 w-4 fill-white" />
          </div>
          <span className="font-black text-sm tracking-tight uppercase">ForeverHome</span>
        </Link>

        {/* Navigation Controls Wrapper */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className={getLinkStyle('/')}>Home</Link>
          <Link href="/AllPets" className={getLinkStyle('/AllPets')}>All Pets</Link>
          
          {isUserLoggedIn && (
            <>
              <Link href="/my-request" className={getLinkStyle('/my-request')}>
                <span className="flex items-center gap-1"><FileText className="h-3.5 w-3.5" /> My Requests</span>
              </Link>
              <Link href="/add-pet" className={getLinkStyle('/add-pet')}>
                <span className="flex items-center gap-1"><PlusCircle className="h-3.5 w-3.5" /> Add Pet</span>
              </Link>
            </>
          )}
        </div>

        {/* Profile Dynamic Interaction Container */}
        <div className="hidden md:flex items-center gap-4">
          {isPending && !backupSync ? (
            <div className="h-8 w-24 bg-gray-50 animate-pulse rounded-full border border-gray-100" />
          ) : isUserLoggedIn ? (
            <div className="relative">
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 border p-1.5 pr-3 rounded-full hover:bg-gray-50 bg-white transition-all focus:outline-none shadow-sm"
              >
                <img 
                  src={session?.user?.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100"} 
                  alt="" 
                  className="h-7 w-7 rounded-full object-cover border"
                />
                <span className="text-xs font-bold text-gray-700 capitalize max-w-[80px] truncate">
                  {session?.user?.name ? session.user.name.split(' ')[0] : "Account"}
                </span>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-50 text-xs">
                  <div className="px-4 py-2.5 border-b border-gray-50 bg-gray-50/50">
                    <p className="font-bold text-gray-800 truncate">{session?.user?.name || "Verified Profile"}</p>
                    <p className="text-[10px] text-gray-400 truncate mt-0.5">{session?.user?.email || "Connected via Engine"}</p>
                  </div>
                  
                  <Link 
                    href="/my-listings" 
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-gray-600 hover:bg-amber-50 hover:text-amber-700 font-semibold"
                  >
                    <LayoutDashboard className="h-3.5 w-3.5 text-amber-500" /> Shelter Dashboard
                  </Link>
                  
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-red-600 hover:bg-red-50 font-bold border-t border-gray-50 text-left"
                  >
                    <LogOut className="h-3.5 w-3.5" /> Logout Session
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors shadow-sm">
              Login
            </Link>
          )}
        </div>

        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-gray-500 focus:outline-none">
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Component Blocks */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-2 text-xs">
          <Link href="/" onClick={() => setIsOpen(false)} className="block font-bold text-gray-600 p-2">Home</Link>
          <Link href="/AllPets" onClick={() => setIsOpen(false)} className="block font-bold text-gray-600 p-2">All Pets</Link>
          
          {isUserLoggedIn ? (
            <>
              <Link href="/my-request" onClick={() => setIsOpen(false)} className="block font-bold text-gray-600 p-2">My Requests</Link>
              <Link href="/add-pet" onClick={() => setIsOpen(false)} className="block font-bold text-gray-600 p-2">Add Pet</Link>
              <Link href="/my-listings" onClick={() => setIsOpen(false)} className="block font-bold text-amber-600 p-2 flex items-center gap-1">
                <LayoutDashboard className="h-3.5 w-3.5" /> Dashboard
              </Link>
              <button onClick={handleLogout} className="w-full text-left font-bold text-red-600 p-2 flex items-center gap-1 border-t mt-2">
                <LogOut className="h-3.5 w-3.5" /> Logout
              </button>
            </>
          ) : (
            <Link href="/login" onClick={() => setIsOpen(false)} className="block bg-amber-500 text-center text-white font-bold p-2.5 rounded-xl">Login</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;