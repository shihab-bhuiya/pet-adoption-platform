"use client";

import React, { useEffect, useState, use } from 'react';
import { useSession } from '@/lib/auth-client';
import axios from 'axios';
import { Phone, MapPin, Heart, AlertCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const PetDetailsPage = ({ params }) => {
  const resolvedParams = use(params);
  const petId = resolvedParams.id;

  const { data: session } = useSession();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Modal & Application Form States
  const [showModal, setShowModal] = useState(false);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get(`https://pet-adoption-server-q5h9.onrender.com/api/pets/${petId}`);
        setPet(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (petId) fetchDetails();
  }, [petId]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!phone || !address) return toast.error("Please fill out all required fields.");
    
    try {
      setSubmitting(true);
      const payload = { petId: pet._id, petName: pet.petName, petImage: pet.petImage, userPhone: phone, userAddress: address };
      
      await axios.post("https://pet-adoption-server-q5h9.onrender.com/api/adoption-requests", payload, { withCredentials: true });
      toast.success("Application submitted successfully!");
      setShowModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit request.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>;
  if (!pet) return <div className="min-h-screen flex items-center justify-center text-gray-500">Pet profile not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 min-h-screen">
      <Toaster />
      <div className="bg-white border rounded-3xl overflow-hidden shadow-sm grid md:grid-cols-2 gap-8 p-6">
        <div className="h-96 rounded-2xl overflow-hidden bg-gray-50">
          <img src={pet.petImage} alt={pet.petName} className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 capitalize">{pet.petName}</h1>
            <p className="text-sm font-semibold text-amber-600 uppercase tracking-wide mt-1">{pet.breed} • {pet.species}</p>
            <p className="text-gray-400 text-sm mt-0.5">Age: {pet.age}</p>
            <div className="border-t border-gray-100 my-4 pt-4">
              <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider mb-2">About Companion</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{pet.description || "No description provided."}</p>
            </div>
          </div>

          {session?.user ? (
            <button onClick={() => setShowModal(true)} className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
              <Heart className="h-5 w-5 fill-white" /> Adopt {pet.petName}
            </button>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-2.5">
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800 font-medium leading-relaxed">You must be logged into an active account to submit adoption applications for this companion animal.</p>
            </div>
          )}
        </div>
      </div>

      {/* Adoption Form Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border rounded-2xl w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Adoption Application</h2>
            <p className="text-xs text-gray-400 mb-5">Applying for: <span className="text-amber-600 font-semibold capitalize">{pet.petName}</span></p>
            
            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Contact Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g., +88017xxxxxxxx" className="w-full bg-white pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Physical Home Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input type="text" required value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street name, City, Zip" className="w-full bg-white pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="border py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={submitting} className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50">
                  {submitting ? "Submitting..." : "Submit Request"}
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