"use client";

import React, { useState } from 'react';
import { signUp } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Mail, Lock, PawPrint } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const RegisterPage = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Execute Better Auth signup transaction
      const response = await signUp.email({
        email: email,
        password: password,
        name: name,
        callbackURL: '/' // Redirect home upon flawless account creation
      });

      toast.success("Account created successfully! Welcome to the pack.");
      router.push('/login');
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50/50 px-4 py-12">
      <Toaster />
      <div className="max-w-md w-full bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="h-12 w-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mx-auto mb-3">
            <PawPrint className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Create an Account</h2>
          <p className="text-sm text-gray-400 mt-1">Join our community and meet your new best friend.</p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Full Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center定位 left-3 text-gray-400">
                <User className="h-4 w-4" />
              </span>
              <input 
                type="text" 
                required
                placeholder="Shihab Bhuiya"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center left-3 text-gray-400">
                <Mail className="h-4 w-4" />
              </span>
              <input 
                type="email" 
                required
                placeholder="shihab@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center left-3 text-gray-400">
                <Lock className="h-4 w-4" />
              </span>
              <input 
                type="password" 
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition-colors shadow-sm text-sm disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-amber-500 hover:underline font-medium">
            Sign In
          </Link>
        </p>

      </div>
    </div>
  );
};

export default RegisterPage;