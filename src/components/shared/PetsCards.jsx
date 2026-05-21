import React from 'react';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import Image from 'next/image';

const PetCard = ({ pet }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
      
      {/* Image Block */}
      <div className="relative h-48 w-full bg-gray-200">
        <Image
          src={pet.imageUrl} 
          alt={pet.petName} 
          className="w-full h-full object-cover"
        />
        <span className="absolute top-3 right-3 bg-amber-500 text-white text-xs px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider">
          {pet.species}
        </span>
      </div>

      {/* Info Block */}
      <div className="p-5 grow">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-bold text-gray-900">{pet.petName}</h3>
          <span className="text-lg font-bold text-emerald-600">${pet.adoptionFee}</span>
        </div>
        
        <div className="text-sm text-gray-500 space-y-1 mb-3">
          <p><strong>Breed:</strong> {pet.breed}</p>
          <p><strong>Age & Gender:</strong> {pet.age} • {pet.gender}</p>
          <div className="flex items-center gap-1 text-gray-400 text-xs pt-1">
            <MapPin className="h-3.5 w-3.5 text-amber-500" />
            <span>{pet.location}</span>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
          {pet.description}
        </p>
      </div>

      {/* View Details Action */}
      <div className="p-5 pt-0">
        <Link 
          href={`/PetDetails/${pet._id}`} 
          className="block text-center bg-amber-500 hover:bg-amber-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default PetCard;