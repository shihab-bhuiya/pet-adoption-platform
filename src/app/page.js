import React from 'react';
import Link from 'next/link';
import PetCard from '@/components/PetCards';
import { Heart, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

// Since this is a home page dashboard entry, we can fetch the initial 
// featured pets directly using Next.js Server Side fetching architecture!
async function getFeaturedPets() {
  try {
    const res = await fetch('http://localhost:5000/api/pets', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch data');
    const data = await res.json();
    // Slice out a minimum of 6 pets to fulfill your assignment specification rule
    return data.slice(0, 6);
  } catch (error) {
    console.error("Error loading homepage featured profiles:", error);
    return [];
  }
}

export default async function HomePage() {
  const featuredPets = await getFeaturedPets();

  return (
    <div className="w-full">
      
      {/* 1. HERO BANNER SECTION */}
      <section className="relative bg-gradient-to-r from-amber-500 to-orange-600 text-white py-24 px-4 sm:px-6 lg:px-8 shadow-inner">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight drop-shadow-sm animate-fade-in">
            Finding Forever Homes <br className="hidden sm:inline" /> For Incredible Pets
          </h1>
          <p className="mt-6 text-lg sm:text-xl max-w-3xl mx-auto text-amber-50 opacity-90 leading-relaxed">
            Every animal deserves a life filled with security, health, and endless love. Browse our certified listings today and meet your match.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link 
              href="/AllPets" 
              className="bg-white text-orange-600 font-bold px-8 py-3.5 rounded-xl shadow-md hover:bg-amber-50 transition-all duration-200 flex items-center gap-2 transform hover:-translate-y-0.5"
            >
              <span>Adopt Now</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. DYNAMIC FEATURED PETS SECTION (Min 6 Pets Required) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-amber-600 text-sm font-bold uppercase tracking-widest block mb-2">Ready for Adoption</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">Featured Companions</h2>
          </div>
          <Link href="/AllPets" className="text-amber-500 font-semibold hover:text-amber-600 transition-colors mt-2 md:mt-0 flex items-center gap-1">
            <span>View All Available Pets</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {featuredPets.length === 0 ? (
          <p className="text-center text-gray-500 py-10">No featured companions loaded at the moment. Check your database collection link!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPets.map((pet) => (
              /* Notice how we pass down the 'pet' object prop cleanly here! */
              <PetCard key={pet._id} pet={pet} />
            ))}
          </div>
        )}
      </section>

      {/* 3. EXTRA STATIC SECTIONS (Why Adopt Pets & Pet Care Tips) */}
      <section className="bg-gray-100 border-t border-b border-gray-200/50 py-20 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Section A: Why Adopt Pets */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200/40">
            <div className="bg-amber-100 p-3 rounded-xl w-fit text-amber-600 mb-5">
              <Heart className="h-6 w-6 fill-amber-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Adopt Instead of Buy?</h3>
            <p className="text-gray-600 leading-relaxed text-sm mb-4">
              Adopting gives a second chance to animals who have lost their homes through no fault of their own. It directly counters unethical commercial breeding mills while saving an innocent life.
            </p>
            <ul className="space-y-2.5 text-sm font-medium text-gray-700">
              <li className="flex items-center gap-2 text-emerald-600">✓ Saves a vulnerable life instantly</li>
              <li className="flex items-center gap-2 text-emerald-600">✓ Pets come behaviorally assessed and vetted</li>
              <li className="flex items-center gap-2 text-emerald-600">✓ Breaks the supply chain of commercial puppy mills</li>
            </ul>
          </div>

          {/* Section B: Pet Care Tips */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200/40">
            <div className="bg-amber-100 p-3 rounded-xl w-fit text-amber-600 mb-5">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Essential New Pet Care Tips</h3>
            <p className="text-gray-600 leading-relaxed text-sm mb-4">
              Transitioning to a new household environment takes patience and a proper structure. Follow these baseline rules to ensure your new companion adapts peacefully:
            </p>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><strong>1. The 3-3-3 Rule:</strong> Expect 3 days to decompress, 3 weeks to learn routines, and 3 months to feel completely safe and secure in your home.</li>
              <li><strong>2. Consistent Scheduling:</strong> Keep feeding times, bathroom break walks, and bedtimes identical to prevent anxiety spikes.</li>
            </ul>
          </div>

        </div>
      </section>

    </div>
  );
}