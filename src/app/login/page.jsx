"use client";

import React, { useState } from 'react';
import { signIn } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, PawPrint, ArrowRight } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Execute the live email and password credentials verification via Better Auth
      const response = await signIn.email({
        email: email,
        password: password,
        callbackURL: '/' // Re-route back to homepage instantly upon authenticating
      });

      toast.success("Welcome back! Loading profile session...");
      router.push('/');
    } catch (error) {
      console.error("Login verification error:", error);
      toast.error(error.message || "Invalid credentials provided. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50/50 px-4 py-12">
      <Toaster />
      <div className="max-w-md w-full bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
        
        {/* Brand Header Display Box */}
        <div className="text-center mb-8">
          <div className="h-12 w-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mx-auto mb-3">
            <PawPrint className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-sm text-gray-400 mt-1">Sign in to manage your active pet adoption applications.</p>
        </div>

        {/* Credentials Form Submission */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
              Email Address
            </label>
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
                className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Password
              </label>
              <a href="#" className="text-xs text-amber-500 hover:underline">Forgot?</a>
            </div>
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
                className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition-colors shadow-sm text-sm disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Redirect Pathway Component */}
        <p className="text-center text-sm text-gray-500 mt-6">
          New to the platform?{' '}
          <Link href="/registation" className="text-amber-500 hover:underline font-medium">
            Create an account
          </Link>
        </p>

      </div>
    </div>
  );
};

export default LoginPage;