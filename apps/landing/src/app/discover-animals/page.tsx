import React from 'react'
import { Search, SlidersHorizontal, Cat, Dog, Bird, Fish, Turtle, Rabbit, MapPin } from 'lucide-react'
import Link from 'next/link'
import { AnimalCard } from './_components/AnimalCards'
import { ExploreSpeciesCard } from './_components/ExploreSpeciesCard'
import { CommunityCard } from './_components/CommunityCard'
import { OrgCard } from './_components/OrgCard'

export default function DiscoverAnimalsPage(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-[#f7f9fa] pb-20 font-jakarta pt-10">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 xl:px-0 xl:pl-[105px]">
        <div className="max-w-[1232px]">
          
          {/* MASTHEAD */}
          <div className="flex flex-col items-start justify-center text-left max-w-[760px] mb-10 md:mb-16 pt-6 md:pt-8">
            <h1 className="text-[28px] sm:text-[32px] md:text-[36px] leading-tight font-bold text-[#073B47] font-montserrat mb-3 md:mb-4">
              Meet animals from across Zoiko Social.
            </h1>
            <p className="text-[13px] md:text-[14px] text-[#64748B] mb-6 md:mb-8 leading-relaxed max-w-[640px]">
              Explore individual animal profiles by species, interests, communities, and safe regional context. Follow the animals you care about and discover the stories around them.
            </p>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-3 w-full">
              <div className="relative w-full max-w-[520px]">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-gray-400" />
                </div>
                <input 
                  type="text" 
                  placeholder="Search by animal name, species, or approved profile details" 
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-[13px] text-[#073B47] focus:outline-none focus:ring-2 focus:ring-teal-light shadow-sm font-jakarta"
                />
              </div>
              <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#066879] text-white hover:bg-[#055765] transition-colors shadow-sm font-bold text-[13px] flex-shrink-0 font-jakarta">
                <SlidersHorizontal className="w-[16px] h-[16px]" strokeWidth={2} />
                Tune discovery
              </button>
            </div>
          </div>

          {/* QUICK SPECIES FILTER */}
          <div className="mb-12 overflow-hidden">
            <div 
              className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <style>{`
                .no-scrollbar::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              
              <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#066879] bg-white text-[#073B47] text-[14px] font-semibold font-['Plus_Jakarta_Sans'] shadow-sm flex-shrink-0">
                <div className="w-6 h-6 rounded-full bg-[#FFF5F0] flex items-center justify-center">
                  <span className="text-[12px]">🐾</span>
                </div>
                All Species
              </button>
              
              <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-[#073B47] text-[14px] font-semibold font-['Plus_Jakarta_Sans'] transition-colors shadow-sm flex-shrink-0">
                <div className="w-6 h-6 rounded-full bg-[#FFF5F0] flex items-center justify-center">
                  <Dog className="w-3.5 h-3.5 text-[#073B47]" />
                </div>
                Dogs
              </button>

              <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-[#073B47] text-[14px] font-semibold font-['Plus_Jakarta_Sans'] transition-colors shadow-sm flex-shrink-0">
                <div className="w-6 h-6 rounded-full bg-[#FFF5F0] flex items-center justify-center">
                  <Cat className="w-3.5 h-3.5 text-[#073B47]" />
                </div>
                Cats
              </button>

              <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-[#073B47] text-[14px] font-semibold font-['Plus_Jakarta_Sans'] transition-colors shadow-sm flex-shrink-0">
                <div className="w-6 h-6 rounded-full bg-[#FFF5F0] flex items-center justify-center">
                  <Bird className="w-3.5 h-3.5 text-[#073B47]" />
                </div>
                Birds
              </button>

              <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-[#073B47] text-[14px] font-semibold font-['Plus_Jakarta_Sans'] transition-colors shadow-sm flex-shrink-0">
                <div className="w-6 h-6 rounded-full bg-[#FFF5F0] flex items-center justify-center">
                  <Rabbit className="w-3.5 h-3.5 text-[#073B47]" />
                </div>
                Small Animals
              </button>

              <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-[#073B47] text-[14px] font-semibold font-['Plus_Jakarta_Sans'] transition-colors shadow-sm flex-shrink-0">
                <div className="w-6 h-6 rounded-full bg-[#FFF5F0] flex items-center justify-center">
                  <span className="text-[12px]">🐴</span>
                </div>
                Horses
              </button>

              <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-[#073B47] text-[14px] font-semibold font-['Plus_Jakarta_Sans'] transition-colors shadow-sm flex-shrink-0">
                <div className="w-6 h-6 rounded-full bg-[#FFF5F0] flex items-center justify-center">
                  <Turtle className="w-3.5 h-3.5 text-[#073B47]" />
                </div>
                Reptiles
              </button>

              <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-[#073B47] text-[14px] font-semibold font-['Plus_Jakarta_Sans'] transition-colors shadow-sm flex-shrink-0">
                <div className="w-6 h-6 rounded-full bg-[#FFF5F0] flex items-center justify-center">
                  <Fish className="w-3.5 h-3.5 text-[#073B47]" />
                </div>
                Aquatic
              </button>

              <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-[#073B47] text-[14px] font-semibold font-['Plus_Jakarta_Sans'] transition-colors shadow-sm flex-shrink-0">
                <div className="w-6 h-6 rounded-full bg-[#FFF5F0] flex items-center justify-center">
                  <span className="text-[12px]">🌲</span>
                </div>
                Wildlife
              </button>

              <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-[#073B47] text-[14px] font-semibold font-['Plus_Jakarta_Sans'] transition-colors shadow-sm flex-shrink-0">
                <div className="w-6 h-6 rounded-full bg-[#FFF5F0] flex items-center justify-center">
                  <span className="text-[12px]">🐾</span>
                </div>
                Other
              </button>

            </div>
          </div>

          {/* RECOMMENDED FOR YOU */}
          <div className="mb-16">
            <div className="mb-6">
              <h2 className="text-[20px] md:text-[20px] md:text-[24px] font-bold text-[#073B47] font-montserrat mb-1">Recommended for You</h2>
              <p className="text-[13px] md:text-[14px] text-gray-500 font-jakarta">Based on who you follow, your species preferences, and communities you've joined.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 md:gap-6">
              <AnimalCard 
                id="luna-1"
                name="Luna"
                species="Dog"
                breed="Golden Retriever"
                manager="Golden Retriever Guardians"
                location="Sacramento, CA area"
                reasonText="Because you follow Golden Retriever Guardians"
                isVerified={true}
                imageFileName="32_5391.jpg"
              />
              <AnimalCard 
                id="whiskers-1"
                name="Whiskers"
                species="Cat"
                breed="Domestic Shorthair"
                manager="Maria T."
                location="London area"
                reasonText="Because you follow cat communities"
                isVerified={false}
                imageFileName="32_5441.jpg"
              />
              <AnimalCard 
                id="kiwi-1"
                name="Kiwi"
                species="Bird"
                breed="African Grey Parrot"
                manager="Exotic Bird Keepers Network"
                location="London area"
                reasonText="New in bird profiles"
                isVerified={true}
                imageFileName="32_5474.jpg"
              />
              <AnimalCard 
                id="duke-1"
                name="Duke"
                species="Horse"
                breed="Shire Horse"
                manager="Meadowbrook Sanctuary"
                location="Yorkshire, UK area"
                reasonText="From a community you joined"
                isVerified={true}
                imageFileName="32_5514.jpg"
              />
              <AnimalCard 
                id="shelly-1"
                name="Shelly"
                species="Reptile"
                breed="Tortoise"
                manager="Reptile & Exotic Pet Care"
                location="Sacramento, CA area"
                reasonText="Because you selected Reptiles"
                isVerified={true}
                imageFileName="32_5555.jpg"
              />
              <AnimalCard 
                id="finn-1"
                name="Finn"
                species="Aquatic"
                breed="Betta Fish"
                manager="James O."
                location="Seattle, WA area"
                reasonText="Popular in Aquatic profiles"
                isVerified={false}
                imageFileName="32_5588.jpg"
              />
              <AnimalCard 
                id="bella-1"
                name="Bella"
                species="Dog"
                breed="Mixed Breed - Senior"
                manager="Priya S."
                location="Austin, TX area"
                reasonText="Senior animals you might like"
                isVerified={false}
                imageFileName="32_5619.jpg"
              />
              <AnimalCard 
                id="nova-1"
                name="Nova"
                species="Wildlife"
                breed="Barn Owl"
                manager="Global Wildlife Rescue Network"
                location="San Diego, CA"
                reasonText="Related to Conservation"
                isVerified={true}
                imageFileName="32_6037.jpg"
              />
            </div>
            
            <div className="flex justify-center mt-10">
              <button className="px-6 py-2.5 bg-white border border-gray-200 text-[#073B47] font-bold text-[14px] rounded-xl hover:bg-gray-50 shadow-sm transition-colors">
                Load More
              </button>
            </div>
          </div>

          {/* EXPLORE BY SPECIES */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[20px] md:text-[24px] font-bold text-[#073B47] font-montserrat">Explore by Species</h2>
              <Link href="/species" className="text-[14px] font-bold text-[#073B47] hover:underline">
                View all species &rarr;
              </Link>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              <ExploreSpeciesCard 
                name="Dogs"
                countText="1.2M profiles"
                imageFileName="32_5690.jpg"
                href="/species/dogs"
              />
              <ExploreSpeciesCard 
                name="Cats"
                countText="980K profiles"
                imageFileName="32_5696.jpg"
                href="/species/cats"
              />
              <ExploreSpeciesCard 
                name="Birds"
                countText="150K profiles"
                imageFileName="32_5701.jpg"
                href="/species/birds"
              />
              <ExploreSpeciesCard 
                name="Horses"
                countText="42K profiles"
                imageFileName="32_5705.jpg"
                href="/species/horses"
              />
              <ExploreSpeciesCard 
                name="Reptiles"
                countText="98K profiles"
                imageFileName="32_5710.jpg"
                href="/species/reptiles"
              />
              <ExploreSpeciesCard 
                name="Aquatic"
                countText="67K profiles"
                imageFileName="32_5714.jpg"
                href="/species/aquatic"
              />
              <ExploreSpeciesCard 
                name="Wildlife"
                countText="210K profiles"
                imageFileName="32_5719.jpg"
                href="/species/wildlife"
              />
              <ExploreSpeciesCard 
                name="Small Animals"
                countText="320K profiles"
                imageFileName="32_5724.jpg"
                href="/species/small-animals"
              />
            </div>
          </div>

          {/* RECENTLY ADDED */}
          <div className="mb-16">
            <div className="mb-6">
              <h2 className="text-[20px] md:text-[24px] font-bold text-[#073B47] font-montserrat mb-1">Recently Added</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 md:gap-6">
              <AnimalCard 
                id="rosie-1"
                name="Rosie"
                species="Small Animal"
                breed="Holland Lop"
                manager="Sofia R."
                location="Portland, OR"
                isVerified={false}
                imageFileName="32_5734.jpg"
              />
              <AnimalCard 
                id="milo-1"
                name="Milo"
                species="Cat"
                breed="Domestic Shorthair"
                manager="Alex K."
                location="Austin, TX"
                isVerified={false}
                imageFileName="32_5762.jpg"
              />
              <AnimalCard 
                id="captain-1"
                name="Captain"
                species="Dog"
                breed="Border Collie"
                manager="Tom W."
                location="Denver, CO"
                isVerified={false}
                imageFileName="32_5790.jpg"
              />
              <AnimalCard 
                id="sage-1"
                name="Sage"
                species="Reptile"
                breed="Corn Snake"
                manager="Reptile & Exotic Pet Care"
                location="Phoenix, AZ"
                isVerified={false}
                imageFileName="32_5818.jpg"
              />
            </div>
          </div>

          {/* FROM COMMUNITIES */}
          <div className="mb-16">
            <div className="mb-6">
              <h2 className="text-[20px] md:text-[24px] font-bold text-[#073B47] font-montserrat mb-1">From Communities</h2>
              <p className="text-[14px] text-gray-500">Animal profiles from communities you've joined.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <CommunityCard 
                id="max-1"
                name="Max"
                species="Dog"
                breed="Golden Retriever"
                communityName="Golden Retriever Guardians"
                imageFileName="32_5854.jpg"
              />
              <CommunityCard 
                id="coco-1"
                name="Coco"
                species="Cat"
                breed="Domestic Shorthair"
                communityName="London Cat Rescue Coalition"
                imageFileName="32_5882.jpg"
              />
              <CommunityCard 
                id="percy-1"
                name="Percy"
                species="Bird"
                breed="Macaw"
                communityName="Exotic Bird Keepers Network"
                imageFileName="32_5910.jpg"
              />
            </div>
          </div>

          {/* NEAR YOU */}
          <div className="mb-16">
            <h2 className="text-[20px] md:text-[24px] font-bold text-[#073B47] font-montserrat mb-6">Near You</h2>
            
            <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-full bg-teal-wash flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-[#073B47]" />
                </div>
                <div>
                  <h3 className="text-[16px] md:text-[18px] font-bold text-[#073B47] mb-1 font-jakarta">See animal profiles near you</h3>
                  <p className="text-[13px] md:text-[14px] text-gray-500 font-jakarta leading-relaxed">
                    Set a region to discover animals in your area. We'll only ever show a safe, approximate location — never your precise position.
                  </p>
                </div>
              </div>
              <button className="w-full md:w-auto px-6 py-3 bg-[#066879] hover:bg-[#055765] text-white text-[14px] font-bold rounded-xl transition-colors whitespace-nowrap shadow-sm font-jakarta">
                Set Region
              </button>
            </div>
          </div>

          {/* ORGANIZATION-ASSOCIATED PROFILES */}
          <div className="mb-16">
            <div className="mb-6">
              <h2 className="text-[20px] md:text-[24px] font-bold text-[#073B47] font-montserrat mb-1">Organization-Associated Profiles</h2>
              <p className="text-[14px] text-gray-500">Profiles managed by verified rescues, sanctuaries, and organizations.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <OrgCard 
                id="willow-org"
                name="Willow"
                species="Dog"
                breed="Labrador Mix"
                manager="Sacramento Animal Rescue"
                location="Sacramento, CA area"
                imageFileName="32_5962.jpg"
                isAdoptionAvailable={true}
              />
              <OrgCard 
                id="comet-1"
                name="Comet"
                species="Horse"
                breed="Shetland Pony"
                manager="Meadowbrook Sanctuary"
                location="Yorkshire, UK area"
                imageFileName="32_5705.jpg"
                isAdoptionAvailable={false}
              />
              <OrgCard 
                id="nova-org"
                name="Nova"
                species="Wildlife"
                breed="Barn Owl"
                manager="Global Wildlife Rescue Network"
                location="San Diego, CA"
                imageFileName="32_6037.jpg"
                isAdoptionAvailable={false}
              />
            </div>
          </div>

          {/* COMMON QUESTIONS */}
          <div className="mb-20 flex flex-col items-center">
            <h2 className="text-[20px] md:text-[24px] font-bold text-[#073B47] font-montserrat mb-8">Common questions</h2>
            
            <div className="w-full max-w-[760px] flex flex-col gap-4">
              <details className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm group cursor-pointer hover:border-teal-wash transition-colors">
                <summary className="flex items-center justify-between font-bold text-[#073B47] text-[14px] md:text-[16px] font-jakarta list-none">
                  How does Zoiko Social protect an animal's location?
                  <span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-[#073B47] text-[18px] leading-none font-light flex-shrink-0">
                    +
                  </span>
                </summary>
                <div className="pt-4 text-[13px] md:text-[14px] text-gray-500 font-jakarta leading-relaxed">
                  We obscure precise location data to protect vulnerable animals. Location is only shown at a safe, approximate regional level (e.g., "Sacramento, CA area") unless verified rescue organizations choose to share more specific details for adoption events.
                </div>
              </details>
              
              <details className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm group cursor-pointer hover:border-teal-wash transition-colors">
                <summary className="flex items-center justify-between font-bold text-[#073B47] text-[14px] md:text-[16px] font-jakarta list-none">
                  How are these recommendations chosen?
                  <span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-[#073B47] text-[18px] leading-none font-light flex-shrink-0">
                    +
                  </span>
                </summary>
                <div className="pt-4 text-[13px] md:text-[14px] text-gray-500 font-jakarta leading-relaxed">
                  Recommendations are powered by your species preferences, communities you've joined, and interactions with verified organizations. You can always refine these using the "Tune discovery" button.
                </div>
              </details>

              <details className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm group cursor-pointer hover:border-teal-wash transition-colors">
                <summary className="flex items-center justify-between font-bold text-[#073B47] text-[14px] md:text-[16px] font-jakarta list-none">
                  Can I adopt an animal directly from this page?
                  <span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-[#073B47] text-[18px] leading-none font-light flex-shrink-0">
                    +
                  </span>
                </summary>
                <div className="pt-4 text-[13px] md:text-[14px] text-gray-500 font-jakarta leading-relaxed">
                  While you can't adopt directly with a single click, you can view the animal's full profile which links directly to the verified organization's official adoption portal or contact information.
                </div>
              </details>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}
