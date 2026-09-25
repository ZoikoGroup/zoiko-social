import Image from "next/image";

const values = [
  {
    icon: "/community-standards/icon1.png",
    title: "Respect",
    description: "Treat everyone with dignity and kindness.",
  },
  {
    icon: "/community-standards/icon2.png",
    title: "Safety",
    description: "Protect vulnerable members from harm.",
  },
  {
    icon: "/community-standards/icon3.png",
    title: "Honesty",
    description: "Be truthful and transparent.",
  },
  {
    icon: "/community-standards/icon4.png",
    title: "Inclusion",
    description: "Welcome people from all backgrounds.",
  },
];

export default function Values() {
  return (
    <section className="w-full bg-[#F8FAFA] px-6 py-12 sm:px-8 md:px-12 lg:px-20 xl:px-28 lg:py-20">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-start gap-10 sm:gap-12 lg:gap-16">
        {/* Heading */}
        <div className="flex w-full flex-col items-start">
          <h2 className="font-['Plus_Jakarta_Sans'] text-3xl font-extrabold leading-10 text-[#073B47] sm:text-4xl">
            What we value
          </h2>
        </div>

        {/* Value Cards */}
        <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {values.map((value) => (
            <div
              key={value.title}
              className="flex w-full flex-col items-center gap-2.5 rounded-[20px] border border-[#D5E7EA] bg-white p-8"
            >
              {/* Icon */}
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[20px] bg-slate-100">
                <Image
                  src={value.icon}
                  alt={`${value.title} icon`}
                  width={36}
                  height={36}
                  className="h-9 w-9 object-contain"
                />
              </div>

              {/* Title */}
              <div className="flex w-full flex-col items-center pt-[5px]">
                <h3 className="text-center font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#00AFC7]">
                  {value.title}
                </h3>
              </div>

              {/* Description */}
              <div className="flex w-full flex-col items-center">
                <p className="text-center font-['Plus_Jakarta_Sans'] text-sm font-normal leading-6 text-[#46636A]">
                  {value.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}