"use client";

import React from 'react';
import Link from 'next/link';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 text-xs border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* About Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-white">
            <div className="h-7 w-7 bg-amber-500 rounded-lg flex items-center justify-center text-white">
              <Heart className="h-3.5 w-3.5 fill-white" />
            </div>
            <span className="font-black tracking-tight text-sm uppercase">ForeverHome</span>
          </div>
          <p className="leading-relaxed text-gray-400 max-w-sm text-[11px]">
            A dedicated production portal built to optimize local shelter operations, connect verified applicants with companion animals, and ensure systematic animal tracking pipelines.
          </p>
        </div>

        {/* Quick Mapping Links */}
        <div className="space-y-3">
          <h4 className="text-white font-bold tracking-wider uppercase text-[10px]">Platform Routing</h4>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <Link href="/" className="hover:text-amber-400 transition-colors">Home Page</Link>
            <Link href="/AllPets" className="hover:text-amber-400 transition-colors">All Pets Catalog</Link>
            <Link href="/my-request" className="hover:text-amber-400 transition-colors">Application History</Link>
            <Link href="/my-listings" className="hover:text-amber-400 transition-colors">Shelter Inventory</Link>
          </div>
        </div>

        {/* Mandatory Contact Info */}
        <div className="space-y-3">
          <h4 className="text-white font-bold tracking-wider uppercase text-[10px]">Contact Information</h4>
          <ul className="space-y-2 text-[11px]">
            <li className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-amber-500 shrink-0" /> Dhaka, Bangladesh</li>
            <li className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-amber-500 shrink-0" /> +880 1700-000000</li>
            <li className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-amber-500 shrink-0" /> shelter.support@foreverhome.org</li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright line */}
      <div className="border-t border-gray-800 text-center py-6 text-[10px] tracking-wide text-gray-500">
        © {new Date().getFullYear()} ForeverHome Adoption Systems Inc. All Rights Reserved. Clean Recruiter Submission Mockup.
      </div>
    </footer>
  );
};

export default Footer;