import React from 'react';

export default function LifeEventsSection() {
  const events = [
    { icon: "/images/adoptions.png", title: "Adoptions &\nBirthdays" },
    { icon: "/images/memorials.png", title: "Memorials" },
    { icon: "/images/training.png", title: "Training Milestones" },
    { icon: "/images/fundraisers.png", title: "Fundraisers" },
    { icon: "/images/education.png", title: "Educational\nGatherings" },
    { icon: "/images/celebrations.png", title: "Celebrations of Life" },
  ];

  return (
    <section className="w-full bg-white px-6 md:px-[80px] lg:pb-[57px] lg:pt-[57px]">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center">
        {/* Header */}
        <div className="text-center">
          <h2 className="font-montserrat text-3xl font-extrabold leading-[52.80px] text-gray-900">
            Life Events and Community Rituals
          </h2>
          <p className="mt-[20px] font-inter text-xl font-normal leading-8 text-gray-600">
            ZoikoSocial recognizes that animals are woven into the milestones of human life
          </p>
        </div>

        {/* Grid */}
        <div className="mt-[62px] flex w-full flex-wrap justify-between gap-y-6 lg:flex-nowrap lg:gap-0">
          {events.map((event, index) => (
            <div 
              key={index} 
              className="relative flex h-[176px] w-[192px] flex-col items-center rounded-xl bg-gray-50 pt-[32px] text-center outline outline-1 -outline-offset-1 outline-gray-200"
            >
              <div className="flex h-12 w-12 items-center justify-center">
                <img src={event.icon} alt={event.title} className="h-full w-full object-contain" />
              </div>
              <div className="absolute top-[106px] w-full whitespace-pre-wrap px-2 font-inter text-sm font-semibold leading-5 text-gray-700">
                {event.title}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-[41px] flex h-auto min-h-[128px] w-full items-center justify-center rounded-xl border-l-4 border-[#066879] bg-gray-50 px-4 py-8 text-center lg:h-[128px] lg:px-0 lg:py-0">
          <p className="w-full max-w-[1198px] font-inter text-lg font-medium leading-8 text-gray-700">
            These moments are not treated as trivial content. They are structured experiences supported by community tools, communication features,<br className="hidden lg:block" />
            and governance frameworks that preserve dignity and meaning.
          </p>
        </div>
      </div>
    </section>
  );
}
