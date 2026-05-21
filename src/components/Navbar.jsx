"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from '@/lib/auth-client'; // Real authentication hooks
import { Menu, X, PawPrint, LogOut, User } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  
  // Destructure the real user session from Better Auth
  const { data: session, isPending } = useSession();
  const user = session?.user;

  // Handles signing out securely via Better Auth
  const handleLogout = async () => {
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Logged out safely. See you soon!");
            setIsOpen(false);
            router.push('/');
            router.refresh();
          }
        }
      });
    } catch (error) {
      console.error("Sign out error execution failure:", error);
      toast.error("Failed to terminate active session.");
    }
  };

  const getLinkStyle = (path) => {
    const baseStyle = "text-sm font-medium transition-colors duration-200 pb-1 ";
    return pathname === path 
      ? baseStyle + "text-amber-500 font-semibold border-b-2 border-amber-500" 
      : baseStyle + "text-gray-600 hover:text-amber-500";
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50 w-full">
      <Toaster position="top-center" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Logo & Brand Platform Identity Section */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-gray-800 hover:opacity-90 transition-opacity">
              <div className="h-9 w-9 bg-amber-500 rounded-xl flex items-center justify-center shadow-sm shadow-amber-500/20">
                <PawPrint className="h-5 w-5 text-white fill-white" />
              </div>
              <span className="tracking-tight font-extrabold text-gray-900">ForeverHome</span>
            </Link>
          </div>

          {/* Desktop Responsive Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className={getLinkStyle('/')}>Home</Link>
            <Link href="/AllPets" className={getLinkStyle('/AllPets')}>All Pets</Link>
            
            {user && (
              <>
                <Link href="/my-request" className={getLinkStyle('/my-request')}>My Requests</Link>
                {/* Optional conditional route if you choose to build a dashboard pathway */}
                <Link href="/add-pet" className={getLinkStyle('/add-pet')}>Add Pet</Link>
              </>
            )}
          </div>

          {/* Right Side: User Profile Metrics / Authentication Triggers */}
          <div className="hidden md:flex items-center gap-4">
            {isPending ? (
              <div className="h-8 w-24 bg-gray-100 animate-pulse rounded-lg"></div>
            ) : user ? (
              <div className="flex items-center gap-3">
                {/* Profile Badge Area */}
                <div className="flex items-center gap-2 bg-amber-50/70 px-3.5 py-1.5 rounded-full border border-amber-100/70">
                  {user.image ? (
                    <img src={user.image} alt={user.name} className="h-5 w-5 rounded-full object-cover" />
                  ) : (
                    <User className="h-4 w-4 text-amber-600" />
                  )}
                  <span className="text-sm font-semibold text-gray-700 max-w-[120px] truncate">{user.name}</span>
                </div>
                
                {/* Logout Action Button Trigger */}
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm bg-gray-50 border border-gray-200 hover:bg-red-50 hover:border-red-100 hover:text-red-600 text-gray-600 px-3 py-1.5 rounded-xl transition-all font-medium"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-amber-500 transition-colors">
                  Sign In
                </Link>
                <Link href="/registation" className="bg-amber-500 hover:bg-amber-600 text-white font-medium text-sm px-4 py-2 rounded-xl transition-colors shadow-sm">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Display Responsive Action Toggle Burger Icon */}
          <div className="flex items-center md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-amber-500 focus:outline-none p-2 rounded-lg hover:bg-gray-50 transition-colors">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* MOBILE RESPONSIVE SIDE DRAWER DRAWDOWNS     */}
      {/* ========================================== */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-5 space-y-2 shadow-inner animate-in fade-in slide-in-from-top-4 duration-200">
          <Link href="/" onClick={() => setIsOpen(false)} className="block text-gray-700 hover:bg-amber-50 hover:text-amber-600 px-3 py-2.5 rounded-xl font-medium transition-colors">Home</Link>
          <Link href="/AllPets" onClick={() => setIsOpen(false)} className="block text-gray-700 hover:bg-amber-50 hover:text-amber-600 px-3 py-2.5 rounded-xl font-medium transition-colors">All Pets</Link>
          
          {user ? (
            <>
              <Link href="/my-request" onClick={() => setIsOpen(false)} className="block text-gray-700 hover:bg-amber-50 hover:text-amber-600 px-3 py-2.5 rounded-xl font-medium transition-colors">My Requests</Link>
              <Link href="/add-pet" onClick={() => setIsOpen(false)} className="block text-gray-700 hover:bg-amber-50 hover:text-amber-600 px-3 py-2.5 rounded-xl font-medium transition-colors">Add Pet</Link>
              
              <div className="border-t border-gray-100 pt-3 mt-3">
                <div className="flex items-center gap-2 px-3 py-2 mb-2">
                  <User className="h-4 w-4 text-amber-500" />
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Logged in as: <span className="text-gray-700 text-sm font-bold capitalize normal-case">{user.name}</span></span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-2 text-red-600 bg-red-50/50 hover:bg-red-50 px-3 py-2.5 rounded-xl font-semibold transition-colors"
                >
                  <LogOut className="h-4 w-4" /> 
                  <span>Logout From Account</span>
                </button>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100 mt-3">
              <Link href="/login" onClick={() => setIsOpen(false)} className="block text-center border border-gray-200 text-gray-600 font-medium py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors">
                Sign In
              </Link>
              <Link href="/registation" onClick={() => setIsOpen(false)} className="block text-center bg-amber-500 text-white font-medium py-2.5 rounded-xl text-sm hover:bg-amber-600 transition-colors shadow-sm">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;