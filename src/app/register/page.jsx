"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signUp } from '@/lib/auth-client';
import { UserPlus, User, Mail, Lock, Image } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const RegisterPage = () => {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", photoUrl: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validatePasswordStructure = (pass) => {
    if (pass.length < 6) return "Password configuration must span minimum 6 character marks.";
    if (!/[A-Z]/.test(pass)) return "Password validation requires at least one uppercase alphabetic character.";
    if (!/[a-z]/.test(pass)) return "Password validation requires at least one lowercase alphabetic character.";
    return null;
  };

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    const { name, email, photoUrl, password, confirmPassword } = form;

    if (!name || !email || !photoUrl || !password || !confirmPassword) {
      return toast.error("Please fulfill all identity data blocks.");
    }

    // Enforces requested standard password validation rules
    const passwordError = validatePasswordStructure(password);
    if (passwordError) return toast.error(passwordError);

    if (password !== confirmPassword) {
      return toast.error("Password string mismatch. Match inputs exactly.");
    }

    try {
      setLoading(true);
      await signUp.email({
        email,
        password,
        name,
        image: photoUrl,
        callbackURL: "/login"
      });

      toast.success("Identity profile compiled successfully! Redirecting onto entry checkpoint...");
      router.push("/login");
    } catch (err) {
      toast.error(err.message || "Registration runtime error encountered.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-white px-4 py-8">
      <Toaster />
      <div className="bg-white border rounded-2xl max-w-sm w-full p-6 shadow-sm text-xs">
        <div className="text-center mb-6">
          <div className="h-10 w-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 mx-auto mb-2 border border-amber-100">
            <UserPlus className="h-5 w-5" />
          </div>
          <h1 className="text-lg font-extrabold text-gray-900">Create Platform Profile</h1>
          <p className="text-gray-400 mt-1">Register your profile data maps to list or adopt animals.</p>
        </div>

        <form onSubmit={handleRegistrationSubmit} className="space-y-3.5">
          <div>
            <label className="block font-bold text-gray-500 uppercase mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input type="text" required name="name" value={form.name} onChange={handleInputChange} placeholder="Alex Bhuiya" className="w-full bg-white pl-10 pr-4 py-2.5 border rounded-xl focus:outline-none" />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-500 uppercase mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input type="email" required name="email" value={form.email} onChange={handleInputChange} placeholder="alex@domain.com" className="w-full bg-white pl-10 pr-4 py-2.5 border rounded-xl focus:outline-none" />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-500 uppercase mb-1">Avatar Profile Photo URL</label>
            <div className="relative">
              <Image className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input type="url" required name="photoUrl" value={form.photoUrl} onChange={handleInputChange} placeholder="https://imgbb.com/avatar.jpg" className="w-full bg-white pl-10 pr-4 py-2.5 border rounded-xl focus:outline-none" />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-500 uppercase mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input type="password" required name="password" value={form.password} onChange={handleInputChange} placeholder="🔒 Min 6 chars, A-Z, a-z" className="w-full bg-white pl-10 pr-4 py-2.5 border rounded-xl focus:outline-none" />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-500 uppercase mb-1">Confirm Identity Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input type="password" required name="confirmPassword" value={form.confirmPassword} onChange={handleInputChange} placeholder="••••••••" className="w-full bg-white pl-10 pr-4 py-2.5 border rounded-xl focus:outline-none" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition-colors text-xs disabled:opacity-50 mt-2">
            {loading ? "Compiling Master Records..." : "Complete System Registration"}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6 font-medium">
          Already registered on record? <Link href="/login" className="text-amber-600 font-bold hover:underline">Log In Instead</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;