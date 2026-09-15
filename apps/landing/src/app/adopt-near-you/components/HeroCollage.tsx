import Image from "next/image";
import { C } from "./theme";
import { HERO_COLLAGE } from "./nearYou";

/** One framed photo with its distance badge. */
function Tile({
  badge,
  image,
  alt,
  className,
  priority,
}: {
  badge: string;
  image: string;
  alt: string;
  className: string;
  priority?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl ${className}`}
      style={{ border: `1px solid ${C.line}`, background: C.chip }}
    >
      <Image
        src={image}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 230px, 45vw"
        className="object-cover"
        priority={priority}
      />
      <span
        className="absolute left-[9px] top-[9px] rounded-[100px] px-2 py-[3px] text-[9.5px] font-bold leading-4"
        style={{ background: "rgba(255,255,255,0.95)", color: C.ink }}
      >
        {badge}
      </span>
    </div>
  );
}

/**
 * The hero's photo panel: the in-region photo runs the full height on the
 * left, with the two further-out ones stacked beside it. Aspect ratios rather
 * than fixed heights, so the panel scales down cleanly.
 */
export default function HeroCollage() {
  const [inRegion, near, far] = HERO_COLLAGE;

  return (
    <div
      className="w-full max-w-[480px] rounded-3xl bg-white p-4 shadow-[0px_8px_24px_0px_rgba(7,59,71,0.10)]"
      style={{ border: `1px solid ${C.line}` }}
    >
      <div className="grid grid-cols-2 gap-4">
        <Tile {...inRegion} className="aspect-[228/324]" priority />
        <div className="flex flex-col gap-4">
          <Tile {...near} className="aspect-[228/155]" />
          <Tile {...far} className="flex-1" />
        </div>
      </div>
    </div>
  );
}
