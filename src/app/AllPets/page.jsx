"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PetCard from '@/components/PetCards';
import { Search, Filter, RefreshCw } from 'lucide-react';

const AllPetsPage = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState('');

  // Fetch data dynamically from our live Express API
  const fetchPets = async () => {
    setLoading(true);
    try {
      // Build our dynamic query url based on user inputs
      let url = 'http://localhost:5000/api/pets';
      const params = [];
      
      if (searchQuery) params.push(`search=${searchQuery}`);
      if (selectedSpecies) params.push(`species=${selectedSpecies}`);
      
      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }

      const response = await axios.get(url);
      setPets(response.data);
    } catch (error) {
      console.error("Error pulling pets from database API:", error);
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch on initial page load and when filter options change
//   useEffect(() => {
//     fetchPets();
//   }, [selectedSpecies]);

//   // Handle manual submit for the search bar form
//   const handleSearchSubmit = (e) => {
//     e.preventDefault();
//     fetchPets();
//   };

  // Clear all configurations back to base default state
  const handleReset = () => {
    setSearchQuery('');
    setSelectedSpecies('');
    // Direct string values won't clear state instantly before execution, 
    // so we call a clean URL fetch or let useEffect track changes
    axios.get('http://localhost:5000/api/pets')
      .then(res => setPets(res.data))
      .finally(() => setLoading(false));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
          Meet Our Available Animals
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
          Browse through all healthy, loving pets ready to move to a permanent household.
        </p>
      </div>

      {/* Advanced Search & Filtering Control Panel Panel */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* A. SearchInput Control ($regex) */}
          <div className="relative w-full md:flex-grow">
            <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            <input 
              type="text"
              placeholder="Search pets by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-700"
            />
          </div>

          {/* B. Filter Dropdown ($in) */}
          <div className="relative w-full md:w-64">
            <Filter className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
            <select
              value={selectedSpecies}
              onChange={(e) => setSelectedSpecies(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-700 bg-white appearance-none cursor-pointer"
            >
              <option value="">All Species</option>
              <option value="Dog">Dogs</option>
              <option value="Cat">Cats</option>
              <option value="Bird">Birds</option>
              <option value="Rabbit">Rabbits</option>
            </select>
          </div>

          {/* C. Action Control Trigger Elements */}
          <div className="flex gap-2 w-full md:w-auto">
            <button 
              type="submit"
              className="w-full md:w-auto bg-amber-500 hover:bg-amber-600 text-white font-medium px-6 py-2.5 rounded-lg transition-colors shadow-sm"
            >
              Search
            </button>
            <button 
              type="button"
              onClick={handleReset}
              className="p-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors"
              title="Reset Filters"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>

        </form>
      </div>

      {/* Main Grid View Management Layout Frame */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      ) : pets.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-200">
          <p className="text-xl text-gray-500">No available pets match your criteria at this moment.</p>
          <button onClick={handleReset} className="mt-4 text-amber-500 font-semibold hover:underline">
            Clear filters and look again
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