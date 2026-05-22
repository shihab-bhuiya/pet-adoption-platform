"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/auth-client';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Please fill in all security parameter blocks.");

    try {
      setLoading(true);
      const res = await signIn.email({
        email,
        password,
        callbackURL: "/"
      });
      
      toast.success("Authentication session established successfully!");
      router.push("/");
    } catch (err) {
      toast.error(err.message || "Invalid authentication credentials matched on record.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/"
      });
    } catch (err) {
      toast.error("Social authentication handshake failed.");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-white px-4">
      <Toaster />
      <div className="bg-white border rounded-2xl max-w-sm w-full p-6 shadow-sm text-xs">
        <div className="text-center mb-6">
          <div className="h-10 w-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 mx-auto mb-2 border border-amber-100">
            <LogIn className="h-5 w-5" />
          </div>
          <h1 className="text-lg font-extrabold text-gray-900">Welcome Back</h1>
          <p className="text-gray-400 mt-1">Provide your entry credentials to unlock private profile layers.</p>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label className="block font-bold text-gray-500 uppercase mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="developer@example.com" 
                className="w-full bg-white pl-10 pr-4 py-2.5 border rounded-xl focus:outline-none" 
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-500 uppercase mb-1">Account Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input 
                type="password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••" 
                className="w-full bg-white pl-10 pr-4 py-2.5 border rounded-xl focus:outline-none" 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition-colors text-xs disabled:opacity-50"
          >
            {loading ? "Verifying Credentials..." : "Sign In to ForeverHome"}
          </button>
        </form>

        <div className="relative my-5 text-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
          <span className="relative bg-white px-3 text-[10px] uppercase font-bold text-gray-400 tracking-wider">Or Framework Bridges</span>
        </div>

        {/* Mandatory Google Login Element */}
        <button 
          onClick={handleGoogleLogin} 
          className="w-full border hover:bg-gray-50 text-gray-700 font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google logo asset" className="h-4 w-4" />
          Continue with Google Engine
        </button>

        <p className="text-center text-gray-400 mt-6 font-medium">
          New to the platform? <Link href="/register" className="text-amber-600 font-bold hover:underline">Register Account Here</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;