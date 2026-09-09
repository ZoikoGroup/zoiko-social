import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MoreHorizontal } from 'lucide-react'

interface CommunityCardProps {
  id: string;
  name: string;
  species: string;
  breed?: string;
  communityName: string;
  imageFileName: string;
}

export function CommunityCard({
  id,
  name,
  species,
  breed,
  communityName,
  imageFileName
}: CommunityCardProps) {
  return (
    <div className="w-full bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
      {/* Image Section */}
      <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden group">
        <Image 
          src={`/discover-animals/${imageFileName}`}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Bookmark */}
        <div className="absolute top-3 right-3">
          <button className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[#073B47] hover:bg-gray-50 transition-colors shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
            </svg>
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
          {breed ? `${breed} · ${species}` : species}
        </p>

        <p className="text-[13px] text-[#066879] font-bold mb-4">
          From {communityName}
        </p>

        {/* Footer Actions */}
        <div className="flex items-center gap-2 mt-auto">
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
