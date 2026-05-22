"use client";

import React, { useEffect, useState, use } from 'react';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { ShieldAlert, MapPin, Calendar, MessageSquare, Heart } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const PetDetailsPage = ({ params }) => {
  const resolvedParams = use(params);
  const petId = resolvedParams.id;
  const router = useRouter();

  const { data: session } = useSession();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [pickupDate, setPickupDate] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchPetData = async () => {
      try {
        const res = await axios.get(`https://pet-adoption-server-q5h9.onrender.com/api/pets/${petId}`);
        setPet(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (petId) fetchPetData();
  }, [petId]);

  const handleOpenModal = () => {
    if (!session?.user) {
      toast.error("Please authentication log in to issue adoption parameters.");
      return router.push('/login');
    }
    if (pet.ownerEmail === session.user.email) {
      return toast.error("Adoption Rule Violation: Shelters cannot submit applications for their own listings.");
    }
    setShowModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!pickupDate || !message) return toast.error("Please fill in all requested fields.");

    try {
      setSubmitting(true);
      const payload = { petId: pet._id, pickupDate, message };
      await axios.post("https://pet-adoption-server-q5h9.onrender.com/api/adoption-requests", payload, { withCredentials: true });
      
      toast.success("Adoption transaction processing initialized successfully!");
      setShowModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error finalizing adoption applications workflow.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading profile data parameters...</div>;
  if (!pet) return <div className="min-h-screen flex items-center justify-center text-gray-500">Pet companion record entry not found.</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 min-h-screen">
      <Toaster />
      <div className="bg-white border rounded-3xl overflow-hidden shadow-sm grid md:grid-cols-2 gap-8 p-6">
        <div className="h-[450px] rounded-2xl overflow-hidden bg-gray-50 border">
          <img src={pet.petImage} alt={pet.petName} className="w-full h-full object-cover" />
        </div>
        
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-extrabold text-gray-900 capitalize">{pet.petName}</h1>
              <span className={`text-xs font-bold px-3 py-1 rounded-full tracking-wide uppercase ${pet.adoptionStatus === 'available' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>{pet.adoptionStatus}</span>
            </div>
            
            <p className="text-amber-600 font-bold text-sm mt-1 uppercase tracking-wide">{pet.breed} • {pet.species}</p>
            
            <div className="grid grid-cols-2 gap-2.5 my-4 bg-gray-50 p-4 rounded-xl border border-gray-100 text-xs text-gray-600">
              <p><strong>Age:</strong> {pet.age}</p>
              <p><strong>Gender:</strong> {pet.gender}</p>
              <p><strong>Health Status:</strong> {pet.healthStatus}</p>
              <p><strong>Vaccination:</strong> {pet.vaccinationStatus}</p>
              <p><strong>Location:</strong> {pet.location}</p>
              <p className="text-amber-700 font-bold"><strong>Adoption Fee:</strong> ${pet.adoptionFee}</p>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <h3 className="font-bold text-gray-800 text-xs uppercase tracking-wider mb-2">Description</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{pet.description}</p>
            </div>
          </div>

          <button onClick={handleOpenModal} disabled={pet.adoptionStatus !== 'available'} className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 mt-6 disabled:opacity-40">
            <Heart className="h-5 w-5 fill-white" /> Adopt {pet.petName}
          </button>
        </div>
      </div>

      {/* Controlled Action Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border rounded-2xl w-full max-w-md p-6 shadow-xl">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Adoption Form Application</h2>
            <p className="text-xs text-gray-400 mb-4">Companion Unit: <span className="text-amber-600 font-bold capitalize">{pet.petName}</span></p>
            
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="space-y-1 bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs text-gray-500">
                <p><strong>Applicant Name:</strong> {session?.user?.name}</p>
                <p><strong>Applicant Email:</strong> {session?.user?.email}</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Pickup Date Selection</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input type="date" required value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} className="w-full bg-white pl-10 pr-4 py-2.5 rounded-xl border text-sm text-gray-800 focus:outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Introduction Message</label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <textarea required rows={3} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Provide home layout summaries, historical experience logs..." className="w-full bg-white pl-10 pr-4 py-2.5 rounded-xl border text-sm text-gray-800 focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="border py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={submitting} className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50">
                  {submitting ? "Processing Transaction..." : "Confirm Application"}
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