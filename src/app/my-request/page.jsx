"use client";

import React, { useEffect, useState } from 'react';
import DashboardLayout from '../dashboard/layout';
import axios from 'axios';
import { Eye, XCircle, Calendar, ShieldCheck } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';

const MyRequestsContent = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserRequests = async () => {
    try {
      const res = await axios.get("https://pet-adoption-server-q5h9.onrender.com/api/my-adoption-requests", { withCredentials: true });
      setRequests(res.data);
    } catch (err) {
      toast.error("Error connecting to personal activity registries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUserRequests(); }, []);

  const handleCancelRequest = async (requestId) => {
    if (!window.confirm("Are you completely certain you want to cancel and delete this application submission contract?")) return;
    try {
      await axios.delete(`https://pet-adoption-server-q5h9.onrender.com/api/adoption-requests/${requestId}`, { withCredentials: true });
      toast.success("Application successfully retracted and destroyed.");
      fetchUserRequests();
    } catch (err) {
      toast.error("Error execution block encountered during document wipe.");
    }
  };

  if (loading) return <div className="text-xs text-gray-400">Loading active activity records...</div>;

  return (
    <div className="bg-white border rounded-2xl p-6 shadow-sm">
      <Toaster />
      <h1 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
        <ShieldCheck className="text-amber-500 h-5 w-5" /> Outgoing Adoption Requests
      </h1>
      <p className="text-xs text-gray-400 mb-6">Track historical timeline tracking logs corresponding to filed companion forms.</p>

      {requests.length === 0 ? (
        <p className="text-center py-12 text-xs font-semibold text-gray-400">You have no active adoption form submissions mapped on record.</p>
      ) : (
        <div className="grid gap-3 text-xs">
          {requests.map((req) => (
            <div key={req._id} className="border p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/40">
              <div className="flex items-center gap-3">
                <img src={req.petImage} alt={req.petName} className="h-11 w-11 rounded-xl object-cover border shrink-0" />
                <div>
                  <h3 className="font-bold text-gray-800 text-sm capitalize">{req.petName}</h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-gray-400 mt-0.5 text-[11px]">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Submitted: {new Date(req.requestDate).toLocaleDateString()}</span>
                    <span>• Pickup Target: {new Date(req.pickupDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 justify-between sm:justify-end">
                <span className={`px-2.5 py-0.5 border text-[10px] font-bold tracking-wider rounded-full uppercase ${
                  req.status === 'approved' ? 'bg-green-50 text-green-700 border-green-100' :
                  req.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                }`}>{req.status}</span>
                
                <div className="flex items-center gap-1.5">
                  <Link href={`/PetDetails/${req.petId}`} className="flex items-center gap-1 bg-white border text-gray-600 px-2.5 py-1.5 rounded-lg hover:bg-gray-50"><Eye className="h-3.5 w-3.5" /> Details</Link>
                  <button onClick={() => handleCancelRequest(req._id)} className="flex items-center gap-1 text-red-600 bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-lg"><XCircle className="h-3.5 w-3.5" /> Cancel</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function MyRequestsPage() {
  return <DashboardLayout><MyRequestsContent /></DashboardLayout>;
}