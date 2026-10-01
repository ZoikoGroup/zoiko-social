import Image from "next/image";

export default function Accountability() {
  return (
    <section className="w-full bg-[#F8FAFA] py-12 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-6 sm:gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Left Column: Team Office Photo */}
          <div className="lg:col-span-6">
            {/* Mobile Photo: Sticky notes workshop (zupu7.jpg) */}
            <div className="relative h-56 w-full overflow-hidden rounded-2xl shadow-md sm:hidden">
              <Image
                src="/zoiko Social-Trust&Safety-protecting-under-18s/zupu7.jpg"
                alt="Zoiko Social team in workshop with sticky notes"
                fill
                sizes="100vw"
                className="object-cover object-center"
              />
            </div>

            {/* Desktop Photo: Office meeting (zupfp2.png) */}
            <div className="relative hidden h-[320px] w-full overflow-hidden rounded-3xl shadow-xl sm:block sm:h-[380px] lg:h-[420px]">
              <Image
                src="/zoiko Social-Trust&Safety-profanity-free-policy/zupfp2.png"
                alt="Zoiko Social team collaborating in the office"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover object-center"
              />
            </div>
          </div>

          {/* Right Column: Copy */}
          <div className="lg:col-span-6">
            <h2 className="text-xl font-bold tracking-tight text-[#0F2422] sm:text-3xl lg:text-[34px] lg:leading-tight">
              Building Trust Through <br />
              Accountability
            </h2>

            <p className="mt-4 text-xs leading-relaxed text-[#5A7371] sm:mt-6 sm:text-sm md:text-base">
              Our moderation team is trained to understand nuance. We don&apos;t
              ban words — we respond to harm. That means a joke shared between
              friends might be fine, but the same word used to demean someone is
              not.
            </p>

            <p className="mt-3 text-xs leading-relaxed text-[#5A7371] sm:mt-4 sm:text-sm md:text-base">
              We publish our enforcement data monthly so you can see exactly how
              we&apos;re holding ourselves accountable to our community.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
