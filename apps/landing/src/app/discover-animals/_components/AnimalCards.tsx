import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Bookmark, MapPin, MoreHorizontal, CheckCircle2 } from 'lucide-react'

interface AnimalCardProps {
  id: string;
  name: string;
  species: string;
  breed?: string;
  manager: string;
  location: string;
  reasonText?: string;
  isVerified?: boolean;
  imageFileName: string;
}

export function AnimalCard({
  id,
  name,
  species,
  breed,
  manager,
  location,
  reasonText,
  isVerified,
  imageFileName
}: AnimalCardProps) {
  return (
    <div className="w-full bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow font-jakarta">
      {/* Image Section */}
      <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden group">
        <Image 
          src={`/discover-animals/${imageFileName}`}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start pointer-events-none">
          {isVerified && (
            <div className="bg-white px-3 py-1.5 rounded-full flex items-center gap-1.5 text-[#073B47] pointer-events-auto shadow-sm">
              <CheckCircle2 className="w-[14px] h-[14px] text-[#073B47]" />
              <span className="text-[12px] font-bold font-jakarta leading-4">Verified Community</span>
            </div>
          )}
          <button className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[#073B47] hover:bg-gray-50 transition-colors pointer-events-auto shadow-sm ml-auto">
            <Bookmark className="w-4 h-4" />
          </button>
        </div>

        {/* Quick View Button (Hover Only) */}
        <div className="absolute bottom-3 left-3 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="px-3.5 py-1.5 bg-black/60 backdrop-blur-md rounded-lg text-white text-[12px] font-semibold hover:bg-black/80 transition-colors pointer-events-auto">
            Quick view
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-[18px] font-bold text-[#073B47] mb-0.5 font-montserrat">
          <Link href={`/animals/${id}`} className="hover:underline">
            {name}
          </Link>
        </h3>
        
        <p className="text-[13px] text-gray-500 mb-3">
          {breed ? `${breed} • ${species}` : species}
        </p>

        <p className="text-[13px] text-gray-500 mb-1.5 line-clamp-1">
          Managed by <span className="font-semibold text-[#073B47] hover:underline cursor-pointer">{manager}</span>
        </p>

        <div className="flex items-center gap-1.5 text-gray-500 mb-4">
          <MapPin className="w-3.5 h-3.5" />
          <span className="text-[13px]">{location}</span>
        </div>

        {/* Reason Box */}
        {reasonText && (
          <div className="bg-[#EEF8F9] rounded-lg p-2.5 mb-4 mt-auto">
            <p className="text-[12px] text-[#066879] font-bold leading-snug font-jakarta">
              {reasonText}
            </p>
          </div>
        )}
        
        {!reasonText && <div className="mt-auto" />}

        {/* Footer Actions */}
        <div className="flex items-center gap-2 pt-1">
          <button className="flex-1 py-2 bg-[#066879] hover:bg-[#055765] text-white text-[13px] font-bold rounded-lg transition-colors">
            Follow
          </button>
          <Link href={`/animals/${id}`} className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-[#073B47] text-[13px] font-bold rounded-lg transition-colors text-center">
            View
          </Link>
          <button className="w-[34px] h-[34px] flex items-center justify-center border border-gray-300 hover:bg-gray-50 text-[#073B47] rounded-lg transition-colors flex-shrink-0">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
