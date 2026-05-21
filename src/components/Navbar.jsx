"use client"; // Required for useState and interactive menus in Next.js

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, PawPrint, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  
  // Temporary mock authentication state for testing
  const user = { email: "recruiter@example.com", displayName: "Alex" }; 

  const getLinkStyle = (path) => {
    const baseStyle = "text-sm font-medium transition-colors duration-200 ";
    return pathname === path 
      ? baseStyle + "text-amber-500 font-semibold border-b-2 border-amber-500 pb-1" 
      : baseStyle + "text-gray-600 hover:text-amber-500";
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-gray-800">
              <PawPrint className="h-6 w-6 text-amber-500 fill-amber-500" />
              <span>ForeverHome</span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className={getLinkStyle('/')}>Home</Link>
            <Link href="/AllPets" className={getLinkStyle('/AllPets')}>All Pets</Link>
            
            {user && (
              <>
                <Link href="/dashboard/my-requests" className={getLinkStyle('/dashboard/my-requests')}>My Requests</Link>
                <Link href="/dashboard/add-pet" className={getLinkStyle('/dashboard/add-pet')}>Add Pet</Link>
              </>
            )}
          </div>

          {/* User Profile / Auth Actions */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
                  <User className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-medium text-gray-700">{user.displayName}</span>
                </div>
                <button className="flex items-center gap-1 text-sm bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-700 px-3 py-2 rounded-lg transition-colors duration-200 font-medium">
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login" className="bg-amber-500 hover:bg-amber-600 text-white font-medium px-5 py-2 rounded-lg transition-colors shadow-sm">
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-amber-500 focus:outline-none">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Responsive Menu Drawer */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-4 space-y-3 shadow-inner">
          <Link href="/" onClick={() => setIsOpen(false)} className="block text-gray-700 hover:bg-amber-50 hover:text-amber-600 px-3 py-2 rounded-md font-medium">Home</Link>
          <Link href="/AllPets" onClick={() => setIsOpen(false)} className="block text-gray-700 hover:bg-amber-50 hover:text-amber-600 px-3 py-2 rounded-md font-medium">All Pets</Link>
          
          {user ? (
            <>
              <Link href="/dashboard/my-requests" onClick={() => setIsOpen(false)} className="block text-gray-700 hover:bg-amber-50 hover:text-amber-600 px-3 py-2 rounded-md font-medium">My Requests</Link>
              <Link href="/dashboard/add-pet" onClick={() => setIsOpen(false)} className="block text-gray-700 hover:bg-amber-50 hover:text-amber-600 px-3 py-2 rounded-md font-medium">Add Pet</Link>
              <div className="border-t border-gray-100 pt-2 mt-2">
                <button className="w-full text-left flex items-center gap-2 text-red-600 hover:bg-red-50 px-3 py-2 rounded-md font-medium">
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </div>
            </>
          ) : (
            <Link href="/login" onClick={() => setIsOpen(false)} className="block text-center bg-amber-500 text-white font-medium py-2 rounded-md">
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;