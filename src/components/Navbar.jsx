"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from '@/lib/auth-client';
import { Heart, LogOut, Menu, X, User, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const getLinkStyle = (path) => {
    const base = "text-xs font-bold tracking-wide transition-colors ";
    return pathname === path 
      ? base + "text-amber-500 font-extrabold" 
      : base + "text-gray-600 hover:text-amber-500";
  };

  const handleLogout = async () => {
    await signOut();
    window.location.href = "/";
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand Identity logo */}
        <Link href="/" className="flex items-center gap-2 text-gray-900 group">
          <div className="h-8 w-8 bg-amber-500 rounded-xl flex items-center justify-center text-white shadow-sm shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Heart className="h-4 w-4 fill-white" />
          </div>
          <span className="font-black text-sm tracking-tight uppercase">ForeverHome</span>
        </Link>

        {/* Desktop Nav Routing links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className={getLinkStyle('/')}>Home</Link>
          <Link href="/AllPets" className={getLinkStyle('/AllPets')}>All Pets</Link>
          
          {session?.user && (
            <>
              <Link href="/my-request" className={getLinkStyle('/my-request')}>My Requests</Link>
              <Link href="/add-pet" className={getLinkStyle('/add-pet')}>Add Pet</Link>
            </>
          )}
        </div>

        {/* Dynamic Context Profile Action box */}
        <div className="hidden md:flex items-center gap-4">
          {session?.user ? (
            <div className="relative">
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 border p-1.5 pr-3 rounded-full hover:bg-gray-50 bg-white transition-all focus:outline-none"
              >
                <img 
                  src={session.user.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100"} 
                  alt={session.user.name} 
                  className="h-7 w-7 rounded-full object-cover border"
                />
                <span className="text-xs font-bold text-gray-700 capitalize">{session.user.name?.split(' ')[0]}</span>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-50 text-xs">
                  <div className="px-4 py-2 border-b border-gray-50">
                    <p className="font-bold text-gray-800 truncate">{session.user.name}</p>
                    <p className="text-[10px] text-gray-400 truncate mt-0.5">{session.user.email}</p>
                  </div>
                  <Link 
                    href="/my-listings" 
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-amber-500 font-medium"
                  >
                    <LayoutDashboard className="h-3.5 w-3.5" /> Shelter Dashboard
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
            <Link 
              href="/login" 
              className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors shadow-sm"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-gray-500 focus:outline-none">
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer Panel */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3 shadow-inner text-xs">
          <Link href="/" onClick={() => setIsOpen(false)} className="block font-bold text-gray-600 p-2">Home</Link>
          <Link href="/AllPets" onClick={() => setIsOpen(false)} className="block font-bold text-gray-600 p-2">All Pets</Link>
          
          {session?.user ? (
            <>
              <Link href="/my-request" onClick={() => setIsOpen(false)} className="block font-bold text-gray-600 p-2">My Requests</Link>
              <Link href="/add-pet" onClick={() => setIsOpen(false)} className="block font-bold text-gray-600 p-2">Add Pet</Link>
              <Link href="/my-listings" onClick={() => setIsOpen(false)} className="block font-bold text-amber-600 p-2 border-t border-gray-50">Shelter Dashboard</Link>
              <button onClick={handleLogout} className="w-full text-left font-bold text-red-600 p-2 flex items-center gap-1"><LogOut className="h-3.5 w-3.5" /> Logout</button>
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