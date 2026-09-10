import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface ExploreSpeciesCardProps {
  name: string;
  countText: string;
  imageFileName: string;
  href: string;
}

export function ExploreSpeciesCard({
  name,
  countText,
  imageFileName,
  href
}: ExploreSpeciesCardProps) {
  return (
    <Link href={href} className="group relative w-full aspect-square rounded-2xl overflow-hidden block">
      <Image 
        src={`/discover-animals/${imageFileName}`}
        alt={name}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-700"
      />
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      
      {/* Content */}
      <div className="absolute inset-0 p-4 flex flex-col justify-end">
        <h3 className="text-[16px] font-bold text-white font-montserrat leading-tight">
          {name}
        </h3>
        <p className="text-[13px] text-white/80 font-medium">
          {countText}
        </p>
      </div>
    </Link>
  )
}
