"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PetCard from '@/components/PetCards';
import { Search, Filter, RefreshCw } from 'lucide-react';

const AllPetsPage = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true); // Default to true for the initial landing load

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState('');

  // Dynamically resolve backend url configuration base pointers
  const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // 1. Core Fetch Function (Using Environment URL Variables)
  const fetchPetsData = async (currentSearch, currentSpecies) => {
    setLoading(true);
    try {
      const params = [];
      if (currentSearch) params.push(`search=${encodeURIComponent(currentSearch)}`);
      if (currentSpecies) params.push(`species=${encodeURIComponent(currentSpecies)}`);
      
      const queryString = params.length > 0 ? `?${params.join('&')}` : '';
      
      // Fixed: Targets live cloud systems or local fallbacks dynamically
      const response = await axios.get(`${baseURL}/api/pets${queryString}`);
      setPets(response.data);
    } catch (error) {
      console.error("Error pulling pets from database API:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Automatically load data when the user first opens the page
  useEffect(() => {
    fetchPetsData('', '');
  }, []);

  // 3. Handle Search Form Submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPetsData(searchQuery, selectedSpecies);
  };

  // 4. Handle Species Filter Dropdown Change (Triggers fetch immediately)
  const handleSpeciesChange = (e) => {
    const nextSpecies = e.target.value;
    setSelectedSpecies(nextSpecies);
    
    // Pass the fresh value directly to bypass state asynchronous latency gaps
    fetchPetsData(searchQuery, nextSpecies);
  };

  // 5. Reset Panel
  const handleReset = () => {
    setSearchQuery('');
    setSelectedSpecies('');
    fetchPetsData('', ''); 
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl tracking-tight">
          Meet Our Available Animals
        </h1>
        <p className="text-gray-500 mt-2">Find your perfect companion matching your household parameters.</p>
      </div>

      {/* Control Filter Bar */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Search Input Box */}
          <div className="relative w-full md:flex-grow">
            <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            <input 
              type="text"
              placeholder="Search pets by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-gray-50/30 transition-all"
            />
          </div>

          {/* Species Dropdown Selector */}
          <div className="relative w-full md:w-64">
            <Filter className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
            <select
              value={selectedSpecies}
              onChange={handleSpeciesChange}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white cursor-pointer transition-all"
            >
              <option value="">All Species</option>
              <option value="Dog">Dogs</option>
              <option value="Cat">Cats</option>
              <option value="Bird">Birds</option>
              <option value="Rabbit">Rabbits</option>
            </select>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex gap-2 w-full md:w-auto">
            <button type="submit" className="w-full md:w-auto bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold px-6 py-2.5 rounded-lg shadow-sm transition-colors">
              Search
            </button>
            <button type="button" onClick={handleReset} className="p-2.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>

        </form>
      </div>

      {/* Main Grid View Processing Panel */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      ) : pets.length === 0 ? (
        <div className="text-center py-20 bg-white border border-gray-100 rounded-xl max-w-xl mx-auto p-6 shadow-sm">
          <p className="text-lg text-gray-500 font-medium">No pets match your search criteria right now.</p>
          <button onClick={handleReset} className="mt-3 text-sm text-amber-500 font-semibold hover:underline">
            Clear Active Filtering Conditions
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {pets.map((singlePet) => (
            <PetCard key={singlePet._id} pet={singlePet} />
          ))}
        </div>
      )}

    </div>
  );
};

export default AllPetsPage;