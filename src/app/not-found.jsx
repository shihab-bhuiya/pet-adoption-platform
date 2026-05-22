"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertCircle, Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-sm">
        <div className="h-14 w-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mx-auto mb-4 border border-red-100">
          <AlertCircle className="h-7 w-7" />
        </div>
        <h1 className="text-xl font-black text-gray-900">404 - Page Route Missing</h1>
        <p className="text-xs text-gray-400 mt-2 leading-relaxed">
          The structural path you requested does not map to any verified database indexing sheet configuration. Let's return to the safety panel.
        </p>
        <div className="mt-6">
          <Link href="/" className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-md transition-all">
            <Home className="h-3.5 w-3.5" /> Back to Home Panel
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;