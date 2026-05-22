"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from '@/lib/auth-client';
import { Menu, X, PawPrint, LogOut, User } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const handleLogout = async () => {
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Logged out successfully!");
            setIsOpen(false);
            router.push('/');
            router.refresh();
          }
        }
      });
    } catch (error) {
      toast.error("Logout failed.");
    }
  };

  const getLinkStyle = (path) => {
    const baseStyle = "text-sm font-medium transition-colors pb-1 ";
    return pathname === path ? baseStyle + "text-amber-500 font-semibold border-b-2 border-amber-500" : baseStyle + "text-gray-600 hover:text-amber-500";
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50 w-full">
      <Toaster position="top-center" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-gray-800">
              <div className="h-9 w-9 bg-amber-500 rounded-xl flex items-center justify-center">
                <PawPrint className="h-5 w-5 text-white fill-white" />
              </div>
              <span className="font-extrabold text-gray-900">ForeverHome</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className={getLinkStyle('/')}>Home</Link>
            <Link href="/AllPets" className={getLinkStyle('/AllPets')}>All Pets</Link>
            {user && (
              <>
                <Link href="/my-request" className={getLinkStyle('/my-request')}>My Requests</Link>
                <Link href="/add-pet" className={getLinkStyle('/add-pet')}>Add Pet</Link>
              </>
            )}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {isPending ? (
              <div className="h-8 w-24 bg-gray-100 animate-pulse rounded-lg"></div>
            ) : user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">
                  <User className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-semibold text-gray-700">{user.name}</span>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm bg-gray-50 border border-gray-200 text-gray-600 px-3 py-1.5 rounded-xl hover:text-red-600 hover:bg-red-50 transition-colors">
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-amber-500">Sign In</Link>
                <Link href="/register" className="bg-amber-500 hover:bg-amber-600 text-white font-medium text-sm px-4 py-2 rounded-xl transition-colors">Register</Link>
              </div>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 p-2 rounded-lg hover:bg-gray-50">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-5 space-y-2 shadow-inner">
          <Link href="/" onClick={() => setIsOpen(false)} className="block text-gray-700 hover:bg-amber-50 px-3 py-2 rounded-xl font-medium">Home</Link>
          <Link href="/AllPets" onClick={() => setIsOpen(false)} className="block text-gray-700 hover:bg-amber-50 px-3 py-2 rounded-xl font-medium">All Pets</Link>
          {user ? (
            <>
              <Link href="/my-request" onClick={() => setIsOpen(false)} className="block text-gray-700 hover:bg-amber-50 px-3 py-2 rounded-xl font-medium">My Requests</Link>
              <Link href="/add-pet" onClick={() => setIsOpen(false)} className="block text-gray-700 hover:bg-amber-50 px-3 py-2 rounded-xl font-medium">Add Pet</Link>
              <button onClick={handleLogout} className="w-full text-left flex items-center gap-2 text-red-600 bg-red-50 px-3 py-2.5 rounded-xl font-semibold mt-2">
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-3 pt-3 border-t">
              <Link href="/login" onClick={() => setIsOpen(false)} className="text-center border py-2 rounded-xl text-sm font-medium">Sign In</Link>
              <Link href="/register" onClick={() => setIsOpen(false)} className="text-center bg-amber-500 text-white py-2 rounded-xl text-sm font-medium">Register</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;