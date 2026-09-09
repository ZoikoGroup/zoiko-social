import React from "react";
import Image from "next/image";

export default function OurPurposeSection() {
  return (
    <section className="relative mx-auto w-full max-w-[1440px] bg-white px-6 py-12 md:px-[80px] md:py-16 lg:py-[47px]">
      <div className="flex flex-col gap-10 lg:flex-row lg:gap-[100px]">
        <div className="flex flex-1 flex-col">
          <h2 className="font-montserrat text-3xl font-extrabold leading-[52.80px] text-gray-900">
            Our Purpose
          </h2>

          <h3 className="mt-8 font-inter text-2xl font-semibold leading-9 text-gray-900 ">
            ZoikoSocial exists to serve one of the most fundamental relationships in human life — our relationship with animals.
          </h3>

          <p className="mt-6 font-inter text-base font-normal leading-7 text-gray-600 md:mt-8">
            Across cultures, continents, and centuries, animals have been companions, protectors, providers, symbols, and members of our families. Yet the digital world has never provided a social platform designed specifically to honor, protect, and responsibly support that relationship.
          </p>

          <p className="mt-7 font-inter text-base font-bold leading-7 text-gray-900">
            ZoikoSocial was built to change that.
          </p>

          <p className="mt-6 font-inter text-base font-normal leading-7 text-gray-600">
            We are a global social infrastructure purpose-built for animal lovers, caretakers, professionals, advocates, and communities. Our platform combines communication, content, news, commerce, and coordination into a single, trusted environment governed by institutional-grade standards.
          </p>

          <div className="mt-8 rounded-xl border-l-4 border-[#066879] bg-[#F7FDFF] p-6 md:mt-[42px] md:p-8 md:py-[29px]">
            <p className="font-inter text-[18px] font-semibold leading-8 text-[#066879] xl:text-[20px]">
              This is not a general-purpose social network adapted for animals. ZoikoSocial is designed from first principles around animal life, welfare, and the human responsibility that accompanies care.
            </p>
          </div>
        </div>

        {/* Right Column - Cards */}
        <div className="flex w-full flex-col gap-6 lg:w-[480px] lg:pt-[53px]">
          {/* Card 1 */}
          <div className="flex min-h-[208px] flex-col items-center justify-center rounded-2xl bg-gray-50 px-6 pb-6 pt-10 outline outline-1 -outline-offset-1 outline-gray-200">
            <Image
              src="/images/global-reach.png"
              alt="Global Reach"
              width={48}
              height={48}
              className="h-[56px] w-[56px] object-contain"
            />

            <h4 className="mt-4 font-inter text-xl font-bold leading-8 text-gray-900">
              Global Reach
            </h4>
            <p className="mt-1 text-center font-inter text-base font-normal leading-6 text-gray-600">
              Connecting animal communities across continents and
              <br className="hidden sm:block" />
              cultures
            </p>
          </div>

          {/* Card 2 */}
          <div className="flex min-h-[176px] flex-col items-center justify-center rounded-2xl bg-gray-50 px-6 pb-6 pt-10 outline outline-1 -outline-offset-1 outline-gray-200">
            <Image
              src="/images/built-on-trust.png"
              alt="Built on Trust"
              width={48}
              height={48}
              className="h-[56px] w-[56px] object-contain"
            />

            <h4 className="mt-4 font-inter text-xl font-bold leading-8 text-gray-900">
              Built on Trust
            </h4>
            <p className="mt-1 text-center font-inter text-base font-normal leading-6 text-gray-600">
              Institutional-grade safety and moderation standards
            </p>
          </div>

          {/* Card 3 */}
          <div className="flex min-h-[176px] flex-col items-center justify-center rounded-2xl bg-gray-50 px-6 pb-6 pt-10 outline outline-1 -outline-offset-1 outline-gray-200">
            <Image
              src="/images/purpose-built.png"
              alt="Purpose Built"
              width={48}
              height={48}
              className="h-[56px] w-[56px] object-contain"
            />

            <h4 className="mt-4 font-inter text-xl font-bold leading-8 text-gray-900">
              Purpose-Built
            </h4>
            <p className="mt-1 text-center font-inter text-base font-normal leading-6 text-gray-600">
              Designed from first principles for animal life and welfare
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
