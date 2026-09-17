"use client";

import Image from "next/image";
import { C } from "./theme";
import { IMAGES } from "./images";

type InfoCardProps = {
  icon: string;
  title: string;
  children: React.ReactNode;
  cta?: string;
};

function IconBox({ icon }: { icon: string }) {
  return (
    <div
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]"
      style={{
        backgroundColor: C.page,
      }}
    >
      <Image
        src={icon}
        alt=""
        width={16}
        height={16}
        className="h-4 w-4 object-contain"
      />
    </div>
  );
}

function InfoCard({
  icon,
  title,
  children,
  cta,
}: InfoCardProps) {
  return (
    <div
      className="
        flex
        w-full
        flex-col
        items-start
        rounded-[20px]
        border
        bg-white
        px-5
        py-5
      "
      style={{
        borderColor: C.cyan89,
      }}
    >
      {/* Icon */}
      <IconBox icon={icon} />

      {/* Title */}
      <div className="self-stretch pt-1.5">
        <div
          className="self-stretch text-sm font-bold leading-5"
          style={{
            color: C.cyan13,
          }}
        >
          {title}
        </div>
      </div>

      {/* Description */}
      <div
        className={
          cta
            ? "self-stretch pb-2"
            : "self-stretch pb-[0.56px]"
        }
      >
        <div
          className="self-stretch text-xs font-normal leading-5"
          style={{
            color: C.azure42,
          }}
        >
          {children}
        </div>
      </div>

      {/* CTA */}
      {cta && (
        <div
          className="text-xs font-bold leading-4"
          style={{
            color: C.cyan25,
          }}
        >
          {cta} &gt;
        </div>
      )}
    </div>
  );
}

export default function BeforeYouInquire() {
  return (
    <section className="w-full px-5 py-12 lg:px-0">
      <div
        className="
          mx-auto
          flex
          w-full
          max-w-[1232px]
          flex-col
          items-start
          gap-6
          rounded-3xl
          border
          p-8
        "
        style={{
          /* Separate light-blue background */
          backgroundColor: C.beforeInquireBackground,

          /* Figma border */
          borderColor: C.cyan89,
        }}
      >
        {/* =========================================
            Section Heading
        ========================================= */}
        <div className="flex w-full items-center gap-2.5">
          <div className="relative flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden">
            <Image
              src={IMAGES.icon1}
              alt=""
              width={20}
              height={20}
              className="h-5 w-5 object-contain"
            />
          </div>

          <div className="flex flex-col items-start">
            <div
              className="text-lg font-extrabold leading-7"
              style={{
                color: C.cyan15,
              }}
            >
              Before you inquire
            </div>
          </div>
        </div>

        {/* =========================================
            Cards
        ========================================= */}
        <div
          className="
            grid
            w-full
            grid-cols-1
            gap-4
            md:grid-cols-2
            lg:grid-cols-3
          "
        >
          {/* =====================================
              Card 1
          ===================================== */}
          <InfoCard
            icon={IMAGES.icon2}
            title="Review the full profile"
          >
            A new listing deserves the same careful review as any
            <br className="hidden xl:block" />
            other. Open the adoption profile before you inquire.
          </InfoCard>

          {/* =====================================
              Card 2
          ===================================== */}
          <InfoCard
            icon={IMAGES.icon3}
            title="Newness isn't urgency"
          >
            A recently published listing is not more deserving or
            <br className="hidden xl:block" />
            time-limited than any other verified listing.
          </InfoCard>

          {/* =====================================
              Card 3
          ===================================== */}
          <InfoCard
            icon={IMAGES.icon4}
            title="Report a concern"
            cta="Report a Concern"
          >
            Every listing here can be reported, whether it was just
            <br className="hidden xl:block" />
            published or listed weeks ago.
          </InfoCard>

          {/* =====================================
              Card 4
          ===================================== */}
          <InfoCard
            icon={IMAGES.icon5}
            title="Full safety guidance"
            cta="Read Adoption Safety"
          >
            Review our complete adoption safety guidance before
            <br className="hidden xl:block" />
            you communicate, meet, or pay.
          </InfoCard>
        </div>
      </div>
    </section>
  );
}