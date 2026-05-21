"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { useSession } from '@/lib/auth-client'; // Live Better Auth Import
import { MapPin, DollarSign, Calendar, Heart, ShieldAlert, X } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const PetDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Hooking up Better Auth Live Session State
  const { data: session } = useSession();
  const currentUser = session?.user; 

  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');

  // Centralized Environment Variable Target Selector
  const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // Fetch single pet data by ID from backend cluster
  useEffect(() => {
    const fetchPetDetails = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/pets/${id}`);
        setPet(response.data);
      } catch (error) {
        console.error("Error fetching pet details:", error);
        toast.error("Could not load pet details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPetDetails();
  }, [id, baseURL]);

  const handleSubmitAdoption = async (e) => {
    e.preventDefault();

    // Guard route verification to ensure logged-out traffic cannot forge applications
    if (!currentUser) {
      toast.error("Please sign in to register an adoption application profile.");
      router.push('/login');
      return;
    }

    const adoptionRequest = {
      petId: pet._id,
      petName: pet.petName,
      petImage: pet.imageUrl,
      userName: currentUser.name,
      userEmail: currentUser.email,
      userPhone: phoneNumber,
      userAddress: address,
      status: 'pending'
    };

    try {
      // POST execution targeting environment variables configurations
      const response = await axios.post(`${baseURL}/api/adoption-requests`, adoptionRequest);
      
      if (response.status === 201 || response.status === 200) {
        toast.success(`Application for ${pet.petName} submitted successfully!`);
        setIsModalOpen(false);
        // Clear inputs
        setPhoneNumber('');
        setAddress('');
      }
    } catch (error) {
      console.error("Error submitting adoption request:", error);
      toast.error(error.response?.data?.message || "Failed to submit request.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-700">Pet profile not found!</h2>
        <button onClick={() => router.push('/AllPets')} className="mt-4 text-amber-500 hover:underline">
          Return to browse board
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Toaster />
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
        
        {/* Left Side: Image Gallery Element */}
        <div className="w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden bg-gray-100">
          <img 
            src={pet.imageUrl} 
            alt={pet.petName} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Side: Descriptive Profile Metrics */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="bg-amber-100 text-amber-800 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wide">
                  {pet.species}
                </span>
                <h1 className="text-4xl font-extrabold text-gray-900 mt-2">{pet.petName}</h1>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-400 block font-medium">Adoption Fee</span>
                <span className="text-3xl font-black text-emerald-600">${pet.adoptionFee}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl mb-6 text-sm">
              <p className="text-gray-600"><strong>Breed:</strong> {pet.breed}</p>
              <p className="text-gray-600"><strong>Age:</strong> {pet.age}</p>
              <p className="text-gray-600"><strong>Gender:</strong> {pet.gender}</p>
              <div className="flex items-center gap-1 text-gray-600">
                <MapPin className="h-4 w-4 text-amber-500" />
                <span>{pet.location}</span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">About {pet.petName}</h3>
              <p className="text-gray-600 leading-relaxed text-sm">{pet.description}</p>
            </div>
          </div>

          {/* Action Call Button */}
          <button 
            onClick={() => {
              if (!currentUser) {
                toast.error("Please log in to submit an application!");
                router.push('/login');
                return;
              }
              setIsModalOpen(true);
            }}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-xl transition-all duration-200 shadow-sm flex items-center justify-center gap-2 text-md"
          >
            <Heart className="h-5 w-5 fill-white" />
            <span>Adopt {pet.petName}</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. ADOPTION APPLICATION MODAL OVERLAY */}
      {/* ======================================================== */}
      {isModalOpen && currentUser && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative animate-scale-up">
            
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">Adoption Application</h2>
            <p className="text-xs text-gray-500 mb-6">You are applying to bring home <strong>{pet.petName}</strong>.</p>

            <form onSubmit={handleSubmitAdoption} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Your Name</label>
                <input type="text" disabled value={currentUser.name || ""} className="w-full mt-1 bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 cursor-not-allowed outline-none" />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Your Email</label>
                <input type="email" disabled value={currentUser.email || ""} className="w-full mt-1 bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 cursor-not-allowed outline-none" />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone Number</label>
                <input 
                  type="tel" 
                  required 
                  placeholder="e.g. +1 234-567-890" 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500" 
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Physical Living Address</label>
                <textarea 
                  required 
                  rows="3"
                  placeholder="Enter your complete street address..." 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none" 
                />
              </div>

              <div className="pt-2">
                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-colors shadow-sm text-sm">
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default PetDetailsPage;