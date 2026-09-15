import Image from "next/image";
import { C } from "./theme";
import { HERO_COLLAGE } from "./fosterNeeds";

/** One framed photo with its duration badge and caption. */
function Tile({
  badge,
  caption,
  image,
  alt,
  className,
  sizes,
  priority,
}: {
  badge: string;
  caption: string;
  image: string;
  alt: string;
  className: string;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl ${className}`}
      style={{ border: `1px solid ${C.line}`, background: C.chip }}
    >
      <Image src={image} alt={alt} fill sizes={sizes} className="object-cover" priority={priority} />
      <span
        className="absolute left-[9px] top-[9px] rounded-[100px] px-2 py-[3px] text-[9.5px] font-bold leading-4"
        style={{ background: "rgba(255,255,255,0.95)", color: C.ink }}
      >
        {badge}
      </span>
      <span className="absolute bottom-[9px] left-[9px] text-xs font-bold leading-4 text-white [text-shadow:_0px_1px_3px_rgb(0_0_0_/_0.40)]">
        {caption}
      </span>
    </div>
  );
}

/**
 * The hero's photo panel: Oliver runs the full height on the left, with
 * Shadow above Biscuit on the right. The comp's proportions are kept with
 * aspect ratios rather than fixed heights, so the panel scales down cleanly.
 */
export default function HeroCollage() {
  const [oliver, shadow, biscuit] = HERO_COLLAGE;
  const sizes = "(min-width: 1024px) 230px, 45vw";

  return (
    <div
      className="w-full max-w-[480px] rounded-3xl bg-white p-4 shadow-[0px_8px_24px_0px_rgba(7,59,71,0.10)]"
      style={{ border: `1px solid ${C.line}` }}
    >
      <div className="grid grid-cols-2 gap-4">
        <Tile {...oliver} className="aspect-[228/324]" sizes={sizes} priority />
        <div className="flex flex-col gap-4">
          {/* Shadow is the short frame in the comp; Biscuit fills the rest. */}
          <Tile {...shadow} className="aspect-[228/81]" sizes={sizes} />
          <Tile {...biscuit} className="flex-1" sizes={sizes} />
        </div>
      </div>
    </div>
  );
}
