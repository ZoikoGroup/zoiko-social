import React from "react";

export default function OperatorExplorer() {
  return (
    <div className="w-[1232px] h-64 relative">
      <div className="w-max h-7 left-0 top-[20px] absolute justify-center text-cyan-950 text-xl font-extrabold font-['Plus_Jakarta_Sans'] leading-8">
        Browse by who runs the community
      </div>

      <div className="w-[1232px] h-48 left-0 top-[64px] absolute">
        {/* Vets Card */}
        <div className="w-96 h-48 left-0 top-0 absolute bg-white rounded-3xl outline outline-1 outline-offset-[-1px] outline-zinc-200">
          <div className="size-11 left-[23px] top-[23px] absolute bg-cyan-50 rounded-xl flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#155E75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path d="m9 12 2 2 4-4"/>
            </svg>
          </div>
          <div className="w-9 h-5 left-[23px] top-[77px] absolute justify-center text-teal-950 text-base font-bold font-['Plus_Jakarta_Sans']">
            Vets
          </div>
          <div className="w-80 h-9 left-[23px] top-[109px] absolute justify-center text-gray-500 text-xs font-normal font-['Plus_Jakarta_Sans'] leading-5">
            Communities associated with veterinary professionals
            <br />
            and clinics.
          </div>
          <div className="w-40 h-4 left-[23px] top-[159px] absolute justify-center text-cyan-800 text-xs font-bold font-['Plus_Jakarta_Sans']">
            Browse Vet communities →
          </div>
        </div>

        {/* Trainers Card */}
        <div className="w-96 h-48 left-[416.66px] top-0 absolute bg-white rounded-3xl outline outline-1 outline-offset-[-1px] outline-zinc-200">
          <div className="size-11 left-[23px] top-[23px] absolute bg-cyan-50 rounded-xl flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#155E75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div className="w-14 h-5 left-[23px] top-[77px] absolute justify-center text-teal-950 text-base font-bold font-['Plus_Jakarta_Sans']">
            Trainers
          </div>
          <div className="w-80 h-9 left-[23px] top-[109px] absolute justify-center text-gray-500 text-xs font-normal font-['Plus_Jakarta_Sans'] leading-5">
            Communities associated with animal trainers and training
            <br />
            organizations.
          </div>
          <div className="w-48 h-4 left-[23px] top-[159px] absolute justify-center text-cyan-800 text-xs font-bold font-['Plus_Jakarta_Sans']">
            Browse Trainer communities →
          </div>
        </div>

        {/* Shelters Card */}
        <div className="w-96 h-48 left-[833.33px] top-0 absolute bg-white rounded-3xl outline outline-1 outline-offset-[-1px] outline-zinc-200">
          <div className="size-11 left-[23px] top-[23px] absolute bg-cyan-50 rounded-xl flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#155E75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <div className="w-16 h-5 left-[23px] top-[77px] absolute justify-center text-teal-950 text-base font-bold font-['Plus_Jakarta_Sans']">
            Shelters
          </div>
          <div className="w-72 h-9 left-[23px] top-[109px] absolute justify-center text-gray-500 text-xs font-normal font-['Plus_Jakarta_Sans'] leading-5">
            Communities associated with shelters and rescue
            <br />
            organizations.
          </div>
          <div className="w-48 h-4 left-[23px] top-[159px] absolute justify-center text-cyan-800 text-xs font-bold font-['Plus_Jakarta_Sans']">
            Browse Shelter communities →
          </div>
        </div>
      </div>
    </div>
  );
}
