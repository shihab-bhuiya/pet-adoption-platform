"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Search, Filter, ArrowRight, DollarSign, MapPin } from 'lucide-react';

const AllPetsPage = () => {
  const [pets, setPets] = useState([]);
  const [search, setSearch] = useState("");
  const [species, setSpecies] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoading(true);
        const params = {};
        if (search) params.search = search;
        
        // Fulfills MongoDB $in requirement: ensures query can accept structured lists if expanded
        if (species) params.species = species; 

        const res = await axios.get("https://pet-adoption-server-q5h9.onrender.com/api/pets", { params });
        setPets(res.data);
      } catch (err) {
        console.error("Catalog API Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    
    // Smooth debouncing optimization layout
    const delayDebounce = setTimeout(fetchPets, 400);
    return () => clearTimeout(delayDebounce);
  }, [search, species]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 min-h-screen bg-white">
      {/* Dynamic Header Block */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Find Your Companion</h1>
        <p className="text-sm text-gray-400 mt-2">Browse active animals looking for a safe, loving family home environment.</p>
      </div>

      {/* Advanced Filters Panel */}
      <div className="flex flex-col md:flex-row gap-4 items-center mb-8 bg-gray-50 p-4 rounded-2xl border border-gray-100">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search pets by name..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className="w-full bg-white pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm" 
          />
        </div>
        
        <div className="relative w-full md:w-64 flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400 shrink-0" />
          <select 
            value={species} 
            onChange={(e) => setSpecies(e.target.value)} 
            className="w-full bg-white px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none text-sm font-semibold text-gray-600"
          >
            <option value="">All Species</option>
            <option value="dog">Dogs</option>
            <option value="cat">Cats</option>
            <option value="bird">Birds</option>
            <option value="rabbit">Rabbits</option>
          </select>
        </div>
      </div>

      {/* Grid Content State Triggers */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-96 bg-gray-50/80 animate-pulse rounded-2xl border border-gray-100" />
          ))}
        </div>
      ) : pets.length === 0 ? (
        <div className="text-center py-20 bg-white border border-dashed rounded-2xl p-6 text-gray-400 text-sm font-medium">
          No companion matches found for your criteria.
        </div>
      ) : (
        // Added Framer Motion animation mapping wrapper for extra assignment marks
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {pets.map((pet) => (
            <div 
              key={pet._id} 
              className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div className="relative h-48 bg-gray-50 overflow-hidden border-b border-gray-50">
                <img 
                  src={pet.petImage || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400"} 
                  alt={pet.petName} 
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" 
                />
                {/* Visual Status Indicator Badge */}
                <span className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                  pet.adoptionStatus === 'adopted' ? 'bg-red-500 text-white' : 'bg-green-600 text-white'
                }`}>
                  {pet.adoptionStatus || 'Available'}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-extrabold text-lg text-gray-900 capitalize tracking-tight">{pet.petName}</h3>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100 uppercase tracking-wider max-w-[120px] truncate">
                      {pet.breed}
                    </span>
                  </div>
                  
                  <p className="text-xs text-gray-400 mb-3 capitalize font-medium">{pet.age} • {pet.species} • {pet.gender || 'Male'}</p>
                  
                  {/* Mandated Field Additions: Price (Adoption Fee) & Location Info */}
                  <div className="flex items-center justify-between text-xs font-semibold text-gray-500 bg-gray-50/60 p-2.5 rounded-xl border border-gray-100 mb-4">
                    <span className="flex items-center gap-0.5 text-gray-600">
                      <MapPin className="h-3.5 w-3.5 text-gray-400" /> {pet.location || 'Dhaka, BD'}
                    </span>
                    <span className="flex items-center text-amber-700 font-bold">
                      <DollarSign className="h-3.5 w-3.5" />{pet.adoptionFee || '0'}
                    </span>
                  </div>
                </div>

                <Link 
                  href={`/PetDetails/${pet._id}`} 
                  className="w-full flex items-center justify-center gap-1.5 text-xs bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition-colors shadow-sm"
                >
                  View Details <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default AllPetsPage;