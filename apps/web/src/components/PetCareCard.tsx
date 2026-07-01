'use client'

interface PetCareProvider {
  initials: string
  name: string
  type: string
  rating: number
  reviewCount: number
  price: string
  priceLabel: string
  gradient: string
  chips: string[]
  fullStars: number
}

const PROVIDERS: PetCareProvider[] = [
  { initials: 'SR', name: 'Sara Renfeld', type: 'Dog Walking & Training', rating: 4.9, reviewCount: 138, price: '$18', priceLabel: '/hr', gradient: 'linear-gradient(135deg,#5C9E78,#2a6b4a)', chips: ['Dogs', 'Puppies', 'Large breeds'], fullStars: 5 },
  { initials: 'MK', name: 'Marco Kutini', type: 'Pet Grooming', rating: 4.8, reviewCount: 214, price: '$45', priceLabel: '/session', gradient: 'linear-gradient(135deg,#4a6eab,#2a4a80)', chips: ['Dogs', 'Cats', 'Rabbits'], fullStars: 5 },
  { initials: 'TL', name: 'Tanya Lorence', type: 'Home Pet Sitting', rating: 4.6, reviewCount: 89, price: '$35', priceLabel: '/night', gradient: 'linear-gradient(135deg,#8C3D2A,#c4622a)', chips: ['Cats', 'Small dogs', 'Birds'], fullStars: 4 },
  { initials: 'AO', name: 'Amara Owusu', type: 'Exotic Animal Care', rating: 5.0, reviewCount: 42, price: '$55', priceLabel: '/visit', gradient: 'linear-gradient(135deg,#6a3a8a,#9a6aaa)', chips: ['Reptiles', 'Parrots', 'Guinea pigs'], fullStars: 5 },
]

export function PetCareCard(): React.JSX.Element {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {PROVIDERS.map((provider) => (
        <div
          key={provider.name}
          className="bg-white rounded-xl border border-[#E2DDD7]/60 p-4 cursor-pointer transition-all duration-200 card-shadow hover:shadow-[0_8px_25px_rgba(0,0,0,0.08)] hover:-translate-y-[2px]"
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
              style={{ background: provider.gradient }}
            >
              {provider.initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate">{provider.name}</div>
              <div className="text-[0.72rem] text-teal-muted/70">{provider.type}</div>
            </div>
            <span className="text-[0.6rem] font-semibold text-sage bg-sage/10 px-2 py-0.5 rounded-full">Available</span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-2.5">
            <span className="text-amber-light text-xs tracking-wider">
              {'★'.repeat(provider.fullStars)}
              {provider.fullStars < 5 ? <span style={{ color: '#E2DDD7' }}>★</span> : ''}
            </span>
            <span className="text-[0.65rem] text-[#a8b0ab] font-medium">{provider.rating}</span>
            <span className="text-[0.6rem] text-[#a8b0ab]">({provider.reviewCount})</span>
          </div>

          {/* Price */}
          <div className="text-lg font-bold text-teal-deep mb-2.5">
            {provider.price}<span className="text-[0.68rem] font-normal text-teal-muted/60">{provider.priceLabel}</span>
          </div>

          {/* Species chips */}
          <div className="flex flex-wrap gap-1.5 mb-3.5">
            {provider.chips.map((chip) => (
              <span key={chip} className="text-[0.62rem] px-2 py-0.5 rounded-full bg-[#F5F2ED]/60 text-teal-mid/80 border border-[#E2DDD7]/50 font-medium">
                {chip}
              </span>
            ))}
          </div>

          {/* Book button */}
          <button className="w-full h-9 rounded-lg border-0 bg-gradient-to-r from-teal-deep to-[#0A2422] text-white text-xs font-semibold cursor-pointer transition-all duration-200 hover:shadow-[0_4px_12px_rgba(12,42,40,0.25)] active:scale-[0.98]">
            Book Session
          </button>
        </div>
      ))}
    </div>
  )
}
