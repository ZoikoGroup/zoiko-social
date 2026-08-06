import React from "react";

export default function BuiltForSection() {
  return (
    <section className="w-full bg-gray-50 px-6 py-16 md:px-[80px] lg:py-24">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center">
        {/* Header */}
        <div className="text-center">
          <h2 className="font-montserrat text-2xl font-extrabold text-gray-900 md:text-3xl lg:leading-[52.80px]">
            Built for Individuals and Organizations
          </h2>
          <p className="mt-4 font-inter text-lg font-normal text-gray-600 md:text-xl lg:leading-8">
            ZoikoSocial provides the tools to connect and collaborate across three distinct pillars:
          </p>
        </div>

        {/* Cards */}
        <div className="mt-12 flex w-full flex-col gap-6 lg:mt-16 lg:flex-row lg:gap-8">
          {/* Card 1 */}
          <div className="flex h-auto w-full flex-col items-center rounded-2xl bg-white px-8 pb-8 pt-[60px] text-center outline outline-1 -outline-offset-1 outline-gray-200 lg:h-[400px] lg:w-[405px]">
            <img 
              src="/images/individuals-icon.png" 
              alt="Individuals" 
              className="h-[60px] object-contain"
            />
            <h3 className="mt-12 font-inter text-xl font-bold leading-10 text-gray-900 md:text-2xl">
              For Individuals
            </h3>
            <p className="mt-6 font-inter text-sm font-normal leading-7 text-gray-600 md:text-base">
              A safe, profanity-free environment to<br />
              share life moments, celebrate pets, adopt<br />
              animals, connect with global communities,<br />
              and access trustworthy news and<br />
              professional support.
            </p>
          </div>

          {/* Card 2 */}
          <div className="flex h-auto w-full flex-col items-center rounded-2xl bg-white px-8 pb-8 pt-[60px] text-center outline outline-1 -outline-offset-1 outline-gray-200 lg:h-[400px] lg:w-[405px]">
            <img 
              src="/images/professionals-icon.png" 
              alt="Professionals" 
              className="h-[60px] object-contain"
            />
            <h3 className="mt-12 font-inter text-xl font-bold leading-10 text-gray-900 md:text-2xl">
              For Platform Users
            </h3>
            <p className="mt-6 font-inter text-sm font-normal leading-7 text-gray-600 md:text-base">
              Veterinarians, trainers, behaviorists,<br />
              groomers, nutritionists, and caregivers<br />
              receive verified presence, communication<br />
              tools, ethical advertising, and<br />
              professional-grade engagement<br />
              infrastructure.
            </p>
          </div>

          {/* Card 3 */}
          <div className="flex h-auto w-full flex-col items-center rounded-2xl bg-white px-8 pb-8 pt-[60px] text-center outline outline-1 -outline-offset-1 outline-gray-200 lg:h-[400px] lg:w-[405px]">
            <img 
              src="/images/organizations-icon.png" 
              alt="Organizations" 
              className="h-[60px] object-contain"
            />
            <h3 className="mt-12 font-inter text-xl font-bold leading-10 text-gray-900 md:text-2xl">
              For Organizations
            </h3>
            <p className="mt-6 font-inter text-sm font-normal leading-7 text-gray-600 md:text-base">
              Rescues, shelters, nonprofits, research<br />
              institutions, advocacy groups, and<br />
              companies gain community management,<br />
              fundraising, events, analytics, and global<br />
              reach without compromising integrity.
            </p>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 flex w-full flex-col items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-teal-500 px-6 py-10 text-center lg:mt-12 lg:h-44 lg:px-24">
          <p className="font-inter text-lg font-semibold leading-8 text-white md:text-xl">
            ZoikoSocial provides the digital tools needed to share experiences, organize rescue efforts, support animal charities, and build trusted relationships — all on a platform designed specifically for the communities that care about them.
          </p>
        </div>
      </div>
    </section>
  );
}
