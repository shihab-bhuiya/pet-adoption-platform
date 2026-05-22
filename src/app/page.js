"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Heart, Sparkles, Smile } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Banner/Hero Section */}
      <section className="relative bg-gradient-to-b from-amber-50/60 to-white py-20 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-amber-600 font-bold tracking-wider uppercase text-xs bg-amber-100/60 px-3 py-1 rounded-full">Save a Life Today</span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-4 leading-tight">
              Unconditional Love <br />Is Waiting For You
            </h1>
            <p className="text-gray-500 text-base mt-4 leading-relaxed max-w-md">
              Every companion pet listed in our database comes from active local non-profit shelters seeking real family safe havens. Give them a beautiful home.
            </p>
            <div className="mt-8">
              <Link href="/AllPets" className="inline-flex items-center gap-2 text-sm bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3.5 rounded-xl transition-all shadow-md shadow-amber-500/10">
                Adopt Now <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="relative h-96 rounded-3xl overflow-hidden shadow-lg border">
            <img src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=1000" alt="Happy dog banner asset" className="w-full h-full object-cover" />
          </motion.div>
        </div>
      </section>

      {/* Static Section 1: Why Adopt */}
      <section className="py-16 max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900">Why Adopt Instead of Shop?</h2>
          <p className="text-sm text-gray-400 mt-1">Understanding the true lifetime social impact of adopting local animals.</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="p-6 border border-gray-100 rounded-2xl bg-gray-50/50">
            <div className="h-10 w-10 bg-amber-500 rounded-xl flex items-center justify-center text-white mb-4"><Heart className="h-5 w-5" /></div>
            <h3 className="font-bold text-gray-800 text-base mb-2">Save a Vital Life</h3>
            <p className="text-xs text-gray-500 leading-relaxed">Shelter spaces are highly restricted. Adopting opens up a pipeline spot for another stray in urgent need.</p>
          </div>
          <div className="p-6 border border-gray-100 rounded-2xl bg-gray-50/50">
            <div className="h-10 w-10 bg-amber-500 rounded-xl flex items-center justify-center text-white mb-4"><ShieldCheck className="h-5 w-5" /></div>
            <h3 className="font-bold text-gray-800 text-base mb-2">Fully Vaccinated</h3>
            <p className="text-xs text-gray-500 leading-relaxed">Our companion animals go through intense baseline physical checkups and behavioral verification charts before listing.</p>
          </div>
          <div className="p-6 border border-gray-100 rounded-2xl bg-gray-50/50">
            <div className="h-10 w-10 bg-amber-500 rounded-xl flex items-center justify-center text-white mb-4"><Sparkles className="h-5 w-5" /></div>
            <h3 className="font-bold text-gray-800 text-base mb-2">Fight Commercial Mills</h3>
            <p className="text-xs text-gray-500 leading-relaxed">Adoption directly reduces commercial funding paths going towards inhumane backyard breeding networks.</p>
          </div>
        </div>
      </section>

      {/* Static Section 2: Success Stories */}
      <section className="py-16 bg-gray-50 border-y border-gray-100 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Success Adoption Stories</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              "We found Max on ForeverHome last year. The processing timeline request was highly structured and fluid. His playful spirit has transformed our entire home environment. We match his daily life logs to the shelter guidelines perfectly!"
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="h-10 w-10 rounded-full bg-amber-500 flex items-center justify-center font-bold text-white"><Smile /></div>
              <div>
                <h4 className="text-sm font-bold text-gray-800">The Bhuiya Family</h4>
                <p className="text-xs text-gray-400">Adopted Max (Golden Retriever Mix)</p>
              </div>
            </div>
          </div>
          <div className="h-72 rounded-2xl overflow-hidden border">
            <img src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=1000" alt="Happy family adopt story asset" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;