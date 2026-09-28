"use client";

import Image from "next/image";

import { C } from "./theme";
import { IMAGES } from "./images";

export default function FollowAnimalWelfare() {
  return (
    <section
      className="relative w-full overflow-hidden rounded-[32px]"
      style={{
        backgroundColor: C.cyan15,
      }}
    >
      <Image
        src={IMAGES.bg}
        alt=""
        fill
        aria-hidden="true"
        className="pointer-events-none object-cover opacity-30"
        sizes="720px"
      />

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(6,47,57,.96) 0%, rgba(6,104,121,.78) 55%, rgba(6,47,57,.70) 100%)",
        }}
      />

      <div className="relative z-10 px-10 py-10">
        <h3 className="text-2xl font-extrabold leading-9 text-white">
          Follow Animal Welfare for future updates
        </h3>

        <p className="mt-1.5 max-w-[650px] text-sm leading-5 text-white/80">
          Create a free account to follow topics and sources, save stories,
          and set your region — reading Latest stays open either way.
        </p>

        <div className="mt-7 flex flex-wrap gap-2.5">
          <button
            type="button"
            className="rounded-xl px-6 py-3 text-sm font-bold"
            style={{
              backgroundColor: C.orange53,
              color: C.white,
            }}
          >
            Join Free
          </button>

          <button
            type="button"
            className="rounded-xl border px-6 py-3 text-sm font-bold text-white"
            style={{
              borderColor: "rgba(255,255,255,.55)",
              backgroundColor: "transparent",
            }}
          >
            Sign In
          </button>
        </div>
      </div>
    </section>
  );
}