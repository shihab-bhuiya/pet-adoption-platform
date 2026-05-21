"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import axios from 'axios';
import { Heart, Calendar, MapPin, Info, ArrowLeft, Send } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const PetDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();

  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Application input field states
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // Fetch individual pet data on page boot
  useEffect(() => {
    const fetchPetDetails = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/pets/${id}`);
        setPet(response.data);
      } catch (error) {
        console.error("Error retrieving pet record:", error);
        toast.error("Could not locate this animal profile.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPetDetails();
  }, [id, baseURL]);

  const handleOpenModal = () => {
    if (!session) {
      toast.error("You must be logged in to submit an adoption application!");
      router.push('/login');
      return;
    }
    setIsModalOpen(true);
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    const applicationPayload = {
      petId: pet._id,
      petName: pet.petName,
      petImage: pet.imageUrl || pet.petImage, // Safely reads either naming structure
      userEmail: session.user.email,
      userName: session.user.name,
      userPhone: phone,
      userAddress: address,
      status: 'pending',
      submittedAt: new Date()
    };

    try {
      await axios.post(`${baseURL}/api/adoption-requests`, applicationPayload);
      toast.success(`Application for ${pet.petName} submitted successfully!`);
      setIsModalOpen(false);
      router.push('/MyRequests'); // Routes user straight to their request status board
    } catch (error) {
      console.error("Submission application intercept failure:", error);
      toast.error("Failed to log adoption form. Please try again.");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg font-medium">Pet companion profile not found.</p>
        <button onClick={() => router.push('/AllPets')} className="mt-4 text-amber-500 font-bold hover:underline">
          Return to Animal Grid
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Toaster />
      
      <button onClick={() => router.push('/AllPets')} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6 font-medium text-sm">
        <ArrowLeft className="h-4 w-4" /> Back to listings
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm">
        {/* Profile Image Box */}
        <div className="relative h-[400px] w-full bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shadow-inner">
          <img 
            src={pet.imageUrl || pet.petImage} 
            alt={pet.petName} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Profile Meta Area */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{pet.petName}</h1>
              <span className="bg-amber-50 text-amber-700 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border border-amber-100">
                {pet.species}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-100 flex items-center gap-2.5">
                <Calendar className="h-4 w-4 text-amber-500" />
                <div>
                  <p className="text-xs text-gray-400 font-medium">Age Parameter</p>
                  <p className="text-sm font-bold text-gray-700">{pet.age}</p>
                </div>
              </div>
              <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-100 flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-amber-500" />
                <div>
                  <p className="text-xs text-gray-400 font-medium">Location</p>
                  <p className="text-sm font-bold text-gray-700">{pet.location || 'Shelter Headquarters'}</p>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-600 mb-4 space-y-1 bg-amber-50/30 p-3 rounded-xl border border-amber-100/50">
              <p><strong>Breed:</strong> {pet.breed || 'Unknown'}</p>
              <p><strong>Gender:</strong> {pet.gender || 'Not specified'}</p>
              <p><strong>Adoption Fee:</strong> <span className="text-emerald-600 font-bold">${pet.adoptionFee}</span></p>
            </div>

            <hr className="border-gray-100 my-4" />

            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Info className="h-4 w-4 text-gray-400" /> Description & Story
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{pet.description}</p>
            </div>
          </div>

          <button 
            onClick={handleOpenModal}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-xl transition-colors shadow-sm text-md mt-8 flex items-center justify-center gap-2"
          >
            <Heart className="h-5 w-5 fill-white" />
            <span>Adopt {pet.petName}</span>
          </button>
        </div>
      </div>

      {/* ========================================== */}
      {/* ADOPTION REQUEST MODAL DIALOG              */}
      {/* ========================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-xl border border-gray-100 relative animate-in fade-in zoom-in-95 duration-150">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Adoption Request Form</h2>
            <p className="text-xs text-gray-400 mb-5">Applying for family matching with <span className="font-semibold text-amber-500">{pet.petName}</span></p>

            <form onSubmit={handleApplicationSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Applicant Name</label>
                <input type="text" disabled value={session?.user?.name || ''} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-500 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Email Address</label>
                <input type="email" disabled value={session?.user?.email || ''} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-500 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Contact Phone Number</label>
                <input type="tel" required placeholder="017XXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Physical Living Address</label>
                <textarea required rows="3" placeholder="Enter your full physical home address" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="w-1/2 border border-gray-200 text-gray-600 font-medium py-2.5 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={submitLoading} className="w-1/2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 rounded-lg text-sm shadow-sm transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50">
                  {submitLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      <span>Submit Form</span>
                    </>
                  )}
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