"use client";

import React, { useState } from 'react';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FileText, PlusCircle, AlertCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const AddPetPage = () => {
  const { data: session, isPending: authPending } = useSession();
  const router = useRouter();

  const [name, setName] = useState("");
  const [species, setSpecies] = useState("dog");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [image, setImage] = useState("");
  const [desc, setDesc] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = { petName: name, species, breed, age, petImage: image, description: desc };
      
      await axios.post("https://pet-adoption-server-q5h9.onrender.com/api/pets", payload, { withCredentials: true });
      toast.success("Pet added successfully!");
      router.push('/AllPets');
    } catch (err) {
      toast.error("Failed to add pet listing.");
    } finally {
      setSubmitting(false);
    }
  };

  if (authPending) return <div className="min-h-screen flex items-center justify-center text-gray-400">Verifying session...</div>;
  if (!session?.user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <AlertCircle className="h-12 w-12 text-red-500 mb-2" />
        <h3 className="text-lg font-bold text-gray-800">Access Denied</h3>
        <p className="text-sm text-gray-500">Please sign in to list animals for adoption.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 min-h-screen">
      <Toaster />
      <div className="bg-white border rounded-2xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
          <PlusCircle className="text-amber-500 h-6 w-6" /> List Pet for Adoption
        </h1>
        <p className="text-sm text-gray-400 mb-6">Enter details to list an animal profile on our active directory.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Pet Name</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Buddy" className="w-full bg-white px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-amber-50 text-gray-800" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Species Type</label>
              <select value={species} onChange={(e) => setSpecies(e.target.value)} className="w-full bg-white px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-amber-50 font-medium text-gray-700">
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
                <option value="rabbit">Rabbit</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Breed Name</label>
              <input type="text" required value={breed} onChange={(e) => setBreed(e.target.value)} placeholder="e.g. Golden Retriever" className="w-full bg-white px-4 py-2.5 rounded-xl border text-sm focus:outline-none text-gray-800" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Age Span</label>
              <input type="text" required value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g. 2 Years, 4 Months" className="w-full bg-white px-4 py-2.5 rounded-xl border text-sm focus:outline-none text-gray-800" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Display Image URL</label>
            <input type="url" required value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://images.unsplash.com/your-pet-photo-path" className="w-full bg-white px-4 py-2.5 rounded-xl border text-sm focus:outline-none text-gray-800" />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Profile Description</label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <textarea required rows={4} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Describe personality, medical tags, history background..." className="w-full bg-white pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none text-gray-800" />
            </div>
          </div>

          <button type="submit" disabled={submitting} className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition-colors text-sm shadow-sm disabled:opacity-50 mt-2">
            {submitting ? "Publishing Entry..." : "Publish Animal Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPetPage;