"use client";

import React, { useState } from 'react';
import axios from 'axios';
import PetCard from '@/components/PetCards';
import { Search, Filter, RefreshCw, Layers } from 'lucide-react';

const AllPetsPage = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false); // Tracks if initial data is loaded
  
  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState('');

  // 1. Core Fetch Function (Independent & Called only on direct actions)
  const fetchPetsData = async (currentSearch, currentSpecies) => {
    setLoading(true);
    setHasFetched(true);
    try {
      let url = 'http://localhost:5000/api/pets';
      const params = [];
      
      if (currentSearch) params.push(`search=${currentSearch}`);
      if (currentSpecies) params.push(`species=${currentSpecies}`);
      
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

  // 2. Handle Search Form Submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPetsData(searchQuery, selectedSpecies);
  };

  // 3. Handle Species Filter Dropdown Change (Triggers fetch immediately on click!)
  const handleSpeciesChange = (e) => {
    const nextSpecies = e.target.value;
    setSelectedSpecies(nextSpecies);
    
    // Pass the fresh value directly to avoid waiting for state asynchronous updates
    fetchPetsData(searchQuery, nextSpecies);
  };

  // 4. Reset Panel
  const handleReset = () => {
    setSearchQuery('');
    setSelectedSpecies('');
    fetchPetsData('', ''); // Fetches all available pets cleanly
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
          Meet Our Available Animals
        </h1>
      </div>

      {/* Control Panel */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Search Input */}
          <div className="relative w-full md:flex-grow">
            <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            <input 
              type="text"
              placeholder="Search pets by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none"
            />
          </div>

          {/* Filter Dropdown - Uses our new handleSpeciesChange handler */}
          <div className="relative w-full md:w-64">
            <Filter className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
            <select
              value={selectedSpecies}
              onChange={handleSpeciesChange}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none bg-white cursor-pointer"
            >
              <option value="">All Species</option>
              <option value="Dog">Dogs</option>
              <option value="Cat">Cats</option>
              <option value="Bird">Birds</option>
              <option value="Rabbit">Rabbits</option>
            </select>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <button type="submit" className="w-full md:w-auto bg-amber-500 hover:bg-amber-600 text-white font-medium px-6 py-2.5 rounded-lg">
              Search
            </button>
            <button type="button" onClick={handleReset} className="p-2.5 rounded-lg border border-gray-200 text-gray-600">
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>

        </form>
      </div>

      {/* Main Display Area */}
      {!hasFetched ? (
        // Initial state before user loads data or searches
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-200">
          <p className="text-xl text-gray-500 mb-4">Ready to find a companion?</p>
          <button 
            onClick={() => fetchPetsData('', '')} 
            className="bg-amber-500 text-white px-6 py-2.5 rounded-lg font-medium shadow-sm hover:bg-amber-600 transition-colors"
          >
            Load Available Pets List
          </button>
        </div>
      ) : loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      ) : pets.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl">
          <p className="text-xl text-gray-500">No pets match your criteria.</p>
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