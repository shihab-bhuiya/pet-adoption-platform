"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Search, Filter, ArrowRight } from 'lucide-react';

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
        if (species) params.species = species;

        const res = await axios.get("https://pet-adoption-server-q5h9.onrender.com/api/pets", { params });
        setPets(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    const delayDebounce = setTimeout(fetchPets, 400);
    return () => clearTimeout(delayDebounce);
  }, [search, species]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 min-h-screen">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Find Your Companion</h1>
        <p className="text-gray-500 mt-2">Browse animals looking for a safe, loving family home.</p>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center mb-8 bg-gray-50 p-4 rounded-2xl border border-gray-100">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
          <input type="text" placeholder="Search pets by name..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-white pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm" />
        </div>
        <div className="relative w-full md:w-64 flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400 shrink-0" />
          <select value={species} onChange={(e) => setSpecies(e.target.value)} className="w-full bg-white px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none text-sm font-medium text-gray-700">
            <option value="">All Species</option>
            <option value="dog">Dogs</option>
            <option value="cat">Cats</option>
            <option value="rabbit">Rabbits</option>
          </select>
        </div>
      </div>

      {/* Grid Layout */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => <div key={n} className="h-80 bg-gray-50 animate-pulse rounded-2xl border border-gray-100" />)}
        </div>
      ) : pets.length === 0 ? (
        <div className="text-center py-20 bg-white border rounded-2xl p-6 text-gray-400 font-medium">No companion matching those metrics found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet) => (
            <div key={pet._id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col">
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                <img src={pet.petImage || "/placeholder-pet.png"} alt={pet.petName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-lg text-gray-900 capitalize">{pet.petName}</h3>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100 uppercase tracking-wider">{pet.breed}</span>
                  </div>
                  <p className="text-sm text-gray-400 mb-4">{pet.age} • {pet.species}</p>
                </div>
                <Link href={`/PetDetails/${pet._id}`} className="w-full flex items-center justify-center gap-1 text-sm bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2.5 rounded-xl transition-colors">
                  View Details <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllPetsPage;