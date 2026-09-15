import Image from "next/image";
import { C } from "./theme";

/** The hero's right-hand promotional panel. */
export default function AdoptionHighlight() {
  return (
    <aside
      className="w-full max-w-[384px] rounded-3xl p-5 shadow-[0px_1px_2px_0px_rgba(7,59,71,0.06)]"
      style={{ background: C.panel, border: `1px solid ${C.line}` }}
    >
      <p
        className="text-xs font-bold uppercase leading-4 tracking-wide"
        style={{ color: C.muted }}
      >
        Adoption Highlight
      </p>
      <h2 className="pt-1.5 text-lg font-extrabold leading-6" style={{ color: C.ink }}>
        Meet your next family member.
      </h2>
      <p className="pt-1.5 text-base leading-6" style={{ color: C.muted }}>
        Every listing comes from a verified rescue or shelter.
      </p>

      <div className="relative mt-4 aspect-[378/221] w-full overflow-hidden rounded-2xl">
        <Image
          src="/adopt/adopt-highlight.webp"
          alt="A girl holding a small white puppy in her arms."
          fill
          sizes="(min-width: 1024px) 378px, 100vw"
          className="object-cover"
          priority
        />
      </div>
    </aside>
  );
}
