"use client";

import React, { useState } from 'react';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../dashboard/layout';
import axios from 'axios';
import { ClipboardList } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const AddPetPageContent = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [form, setForm] = useState({
    petName: "", species: "dog", breed: "", age: "", gender: "male",
    petImage: "", healthStatus: "", vaccinationStatus: "fully-vaccinated",
    location: "", adoptionFee: "", description: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await axios.post("https://pet-adoption-server-q5h9.onrender.com/api/pets", form, { withCredentials: true });
      toast.success("Listing created. Forwarding to personal records storage...");
      router.push('/my-listings');
    } catch (err) {
      toast.error("Error creating target collection listing profile.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white border rounded-2xl p-6 shadow-sm">
      <Toaster />
      <h1 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
        <ClipboardList className="text-amber-500 h-5 w-5" /> List New Pet Profile
      </h1>
      <p className="text-xs text-gray-400 mb-6">Complete all mandatory fields to post this shelter animal entry profile.</p>

      <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-gray-500 uppercase mb-1">Pet Name</label>
            <input type="text" required name="petName" value={form.petName} onChange={handleInputChange} placeholder="e.g. Charlie" className="w-full px-4 py-2.5 border rounded-xl" />
          </div>
          <div>
            <label className="block font-bold text-gray-500 uppercase mb-1">Species Class</label>
            <select name="species" value={form.species} onChange={handleInputChange} className="w-full px-4 py-2.5 border rounded-xl font-medium text-gray-700 bg-white">
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
              <option value="bird">Bird</option>
              <option value="rabbit">Rabbit</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block font-bold text-gray-500 uppercase mb-1">Breed</label>
            <input type="text" required name="breed" value={form.breed} onChange={handleInputChange} placeholder="Golden Mix" className="w-full px-4 py-2.5 border rounded-xl" />
          </div>
          <div>
            <label className="block font-bold text-gray-500 uppercase mb-1">Age</label>
            <input type="text" required name="age" value={form.age} onChange={handleInputChange} placeholder="2 Years" className="w-full px-4 py-2.5 border rounded-xl" />
          </div>
          <div>
            <label className="block font-bold text-gray-500 uppercase mb-1">Gender</label>
            <select name="gender" value={form.gender} onChange={handleInputChange} className="w-full px-4 py-2.5 border rounded-xl bg-white">
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-gray-500 uppercase mb-1">Health Status Details</label>
            <input type="text" required name="healthStatus" value={form.healthStatus} onChange={handleInputChange} placeholder="Perfect Health, Active" className="w-full px-4 py-2.5 border rounded-xl" />
          </div>
          <div>
            <label className="block font-bold text-gray-500 uppercase mb-1">Vaccination Level</label>
            <select name="vaccinationStatus" value={form.vaccinationStatus} onChange={handleInputChange} className="w-full px-4 py-2.5 border rounded-xl bg-white">
              <option value="fully-vaccinated">Fully Vaccinated</option>
              <option value="partially-vaccinated">Partially Vaccinated</option>
              <option value="pending-review">Pending Verification</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-gray-500 uppercase mb-1">Location Address</label>
            <input type="text" required name="location" value={form.location} onChange={handleInputChange} placeholder="Dhaka, Bangladesh" className="w-full px-4 py-2.5 border rounded-xl" />
          </div>
          <div>
            <label className="block font-bold text-gray-500 uppercase mb-1">Adoption Fee ($)</label>
            <input type="number" required name="adoptionFee" value={form.adoptionFee} onChange={handleInputChange} placeholder="50" className="w-full px-4 py-2.5 border rounded-xl" />
          </div>
        </div>

        <div>
          <label className="block font-bold text-gray-500 uppercase mb-1">Hosted Image URL path</label>
          <input type="url" required name="petImage" value={form.petImage} onChange={handleInputChange} placeholder="https://postimage.me/assets/target-doc.png" className="w-full px-4 py-2.5 border rounded-xl" />
        </div>

        <div>
          <label className="block font-bold text-gray-500 uppercase mb-1">Shelter Owner Reference (Auto-Filled)</label>
          <input type="text" readOnly value={session?.user?.email || ""} className="w-full px-4 py-2.5 border rounded-xl bg-gray-50 text-gray-400 font-medium cursor-not-allowed" />
        </div>

        <div>
          <label className="block font-bold text-gray-500 uppercase mb-1">Biography Description</label>
          <textarea required rows={3} name="description" value={form.description} onChange={handleInputChange} placeholder="Provide behavioral traits..." className="w-full px-4 py-2.5 border rounded-xl" />
        </div>

        <button type="submit" disabled={submitting} className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition-colors text-sm disabled:opacity-50">
          {submitting ? "Publishing Records..." : "Publish Inventory Profile Listing"}
        </button>
      </form>
    </div>
  );
};

export default function AddPetPage() {
  return <DashboardLayout><AddPetPageContent /></DashboardLayout>;
}