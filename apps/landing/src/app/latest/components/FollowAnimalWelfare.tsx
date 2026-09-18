"use client";

import { C } from "./theme";

export default function FollowAnimalWelfare() {
  return (
    <section
      className="relative mt-4 w-full overflow-hidden rounded-[20px] px-7 py-8"
      style={{
        background:
          "linear-gradient(110deg, #073B47 0%, #0A4A52 55%, #174C48 100%)",
      }}
    >
      <div
        className="pointer-events-none absolute -right-16 -top-20 h-[230px] w-[230px] rounded-full blur-3xl"
        style={{
          backgroundColor: "rgba(214, 166, 78, 0.18)",
        }}
      />

      <div className="relative z-10">
        <h3 className="text-xl font-extrabold leading-7 text-white">
          Follow topics and sources you trust
        </h3>

        <p className="mt-2 max-w-[620px] text-sm leading-5 text-white/75">
          Create a free account to follow topics and sources, save stories,
          and set your region — reading Latest stays open either way.
        </p>

        <div className="mt-5 flex items-center gap-2">
          <button
            type="button"
            className="rounded-[10px] px-4 py-2.5 text-sm font-bold"
            style={{
              backgroundColor: "#F59E0B",
              color: "#FFFFFF",
            }}
          >
            Join Free
          </button>

          <button
            type="button"
            className="rounded-[10px] border px-4 py-2.5 text-sm font-semibold text-white"
            style={{
              borderColor: "rgba(255,255,255,0.45)",
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