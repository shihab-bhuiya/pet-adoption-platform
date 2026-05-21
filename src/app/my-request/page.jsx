"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from '@/lib/auth-client';
import axios from 'axios';
import { PawPrint, Calendar, Clock, AlertCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const MyRequestsPage = () => {
  const { data: session, isPending: authPending } = useSession();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyRequests = async () => {
      // Don't attempt to fetch until the Better Auth session is loaded
      if (authPending || !session?.user) return;

      try {
        // Pointing to your production backend API on Render
        const baseURL = "https://pet-adoption-server-q5h9.onrender.com";
        
        // Better Auth uses cookies/headers, so pass credentials true
        const response = await axios.get(`${baseURL}/api/my-adoption-requests`, {
          withCredentials: true,
        });
        
        setRequests(response.data);
      } catch (error) {
        console.error("Error fetching requests:", error);
        toast.error("Could not load your adoption applications history.");
      } finally {
        setLoading(false);
      }
    };

    if (!authPending) {
      if (session?.user) {
        fetchMyRequests();
      } else {
        // ONLY update state if it hasn't been set to false yet to avoid cascading renders
        if (loading) {
          setLoading(false);
        }
      }
    }
  }, [session, authPending, loading]); // Clean, unified dependency array footer

  if (authPending || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <AlertCircle className="h-12 w-12 text-red-500 mb-2" />
        <h3 className="text-lg font-bold text-gray-800">Access Denied</h3>
        <p className="text-sm text-gray-500">Please sign in to view your submitted requests.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <Toaster />
      <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
        <PawPrint className="h-6 w-6 text-amber-500" />
        My Adoption Requests
      </h1>
      <p className="text-sm text-gray-500 mb-8">Track the status of your pet companion applications.</p>

      {requests.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm">
          <p className="text-gray-400 font-medium">You haven't submitted any adoption requests yet.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {requests.map((req) => (
            <div key={req._id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {req.petImage && (
                  <img src={req.petImage} alt={req.petName} className="h-14 w-14 rounded-xl object-cover border border-gray-100" />
                )}
                <div>
                  <h3 className="font-bold text-gray-800 text-base">{req.petName}</h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {req.submittedAt ? new Date(req.submittedAt).toLocaleDateString() : 'N/A'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      Status: <span className="capitalize font-semibold text-amber-600">{req.status}</span>
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${
                  req.status === 'approved' ? 'bg-green-50 text-green-700 border border-green-100' :
                  req.status === 'rejected' ? 'bg-red-50 text-red-700 border border-red-100' :
                  'bg-amber-50 text-amber-700 border border-amber-100'
                }`}>
                  {req.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRequestsPage;