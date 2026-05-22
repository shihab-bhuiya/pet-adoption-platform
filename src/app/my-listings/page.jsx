"use client";

import React, { useEffect, useState } from 'react';
import DashboardLayout from '../dashboard/layout';
import axios from 'axios';
import { Trash2, Edit3, Eye, Layers } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';

const MyListingsContent = () => {
  const [data, setData] = useState({ stats: { totalListings: 0, available: 0, adopted: 0 }, listings: [] });
  const [loading, setLoading] = useState(true);
  
  // Requests Management Modal Overlay Mapping state
  const [showModal, setShowModal] = useState(false);
  const [activeRequests, setActiveRequests] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState(null);

  const fetchListings = async () => {
    try {
      const res = await axios.get("https://pet-adoption-server-q5h9.onrender.com/api/my-listings", { withCredentials: true });
      setData(res.data);
    } catch (err) {
      toast.error("Error reading inventory data streams.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchListings(); }, []);

  const handleOpenRequests = async (petId) => {
    try {
      setSelectedPetId(petId);
      const res = await axios.get(`https://pet-adoption-server-q5h9.onrender.com/api/shelter-requests/${petId}`, { withCredentials: true });
      setActiveRequests(res.data);
      setShowModal(true);
    } catch (err) {
      toast.error("Failed to parse request logs.");
    }
  };

  const handleProcessStatus = async (requestId, status) => {
    try {
      await axios.patch(`https://pet-adoption-server-q5h9.onrender.com/api/adoption-requests/${requestId}/status`, { status }, { withCredentials: true });
      toast.success(`Application structurally marked as ${status}!`);
      setShowModal(false);
      fetchListings(); // Refresh parent listings and stats
    } catch (err) {
      toast.error(err.response?.data?.message || "Error completing operational parameters.");
    }
  };

  const handleDeleteListing = async (petId) => {
    if (!window.confirm("Are you entirely sure you want to completely erase this animal profile registry asset? This drop configuration cascades automatically across all active applicant sheets.")) return;
    try {
      await axios.delete(`https://pet-adoption-server-q5h9.onrender.com/api/pets/${petId}`, { withCredentials: true });
      toast.success("Listing dropped successfully.");
      fetchListings();
    } catch (err) {
      toast.error("Failed to drop record item entry.");
    }
  };

  if (loading) return <div className="text-gray-400 text-xs">Loading personal listings array configurations...</div>;

  return (
    <div className="space-y-6">
      <Toaster />
      {/* Structural Stats Counter Grid */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-white border rounded-xl p-4">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Inventory</p>
          <p className="text-2xl font-extrabold text-gray-800 mt-1">{data.stats.totalListings}</p>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <p className="text-[10px] font-bold text-green-500 uppercase tracking-wider">Active Available</p>
          <p className="text-2xl font-extrabold text-green-600 mt-1">{data.stats.available}</p>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Adopted Homes</p>
          <p className="text-2xl font-extrabold text-amber-600 mt-1">{data.stats.adopted}</p>
        </div>
      </div>

      {/* Lists Inventory Mapping Core */}
      <div className="grid gap-3">
        {data.listings.map((pet) => (
          <div key={pet._id} className="bg-white border rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <img src={pet.petImage} alt={pet.petName} className="h-12 w-12 rounded-xl object-cover border shrink-0" />
              <div>
                <h3 className="font-bold text-gray-800 text-sm capitalize">{pet.petName}</h3>
                <p className="text-gray-400 mt-0.5">Fee: ${pet.adoptionFee} • Status: <span className="font-semibold text-amber-600 uppercase text-[10px]">{pet.adoptionStatus}</span></p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
              <button onClick={() => handleOpenRequests(pet._id)} className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-white font-bold px-3 py-2 rounded-lg">
                <Layers className="h-3.5 w-3.5" /> Requests
              </button>
              <Link href={`/PetDetails/${pet._id}`} className="flex items-center gap-1 bg-gray-50 hover:bg-gray-100 border text-gray-600 px-3 py-2 rounded-lg">
                <Eye className="h-3.5 w-3.5" /> View
              </Link>
              <button onClick={() => handleDeleteListing(pet._id)} className="flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg">
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Micro Adoption Decision Modal Control Box */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border rounded-2xl w-full max-w-2xl p-6 shadow-xl max-h-[85vh] overflow-y-auto">
            <h2 className="text-base font-bold text-gray-900 mb-4">Incoming Adoption Requests Tracking Logs</h2>
            
            {activeRequests.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-6">No application forms currently tracking logs against this item.</p>
            ) : (
              <div className="space-y-3 text-xs">
                {activeRequests.map((req) => (
                  <div key={req._id} className="border p-4 rounded-xl bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="font-bold text-gray-800">{req.userName} ({req.userEmail})</p>
                      <p className="text-gray-400 mt-1"><strong>Pickup Intent Date:</strong> {new Date(req.pickupDate).toLocaleDateString()}</p>
                      <p className="text-gray-500 mt-0.5"><strong>Message:</strong> "{req.message}"</p>
                      <p className="mt-1">Status Flag: <span className="font-bold text-amber-700 uppercase tracking-wider text-[10px]">{req.status}</span></p>
                    </div>

                    {req.status === "pending" && (
                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => handleProcessStatus(req._id, "approved")} className="bg-green-600 hover:bg-green-700 text-white font-bold px-3 py-1.5 rounded-lg">Approve</button>
                        <button onClick={() => handleProcessStatus(req._id, "rejected")} className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-lg">Reject</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => setShowModal(false)} className="w-full mt-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 rounded-xl text-xs">Close Panel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default function MyListingsPage() {
  return <DashboardLayout><MyListingsContent /></DashboardLayout>;
}