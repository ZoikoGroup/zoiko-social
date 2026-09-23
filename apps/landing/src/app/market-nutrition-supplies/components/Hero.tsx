import Image from "next/image";
import { FEATURED } from "./products";
import { C } from "./theme";

export default function Hero() {
  return (
    <section
      className="px-4 py-12 sm:px-8 sm:py-16 lg:px-16 lg:py-20 xl:px-28"
      style={{ background: `linear-gradient(115deg, ${C.chip} 0%, #fff 100%)` }}
    >
      <div className="mx-auto flex max-w-[1230px] flex-col gap-3">
        <p className="text-xs font-semibold uppercase leading-5 tracking-wide" style={{ color: C.brand }}>
          Market / Services &amp; Supplies
        </p>
        <h1 className="text-3xl font-extrabold leading-tight sm:text-5xl sm:leading-[57.6px]" style={{ color: C.ink }}>
          Everyday care products and food.
        </h1>
        <p className="max-w-[820px] pt-1 text-base leading-7" style={{ color: C.muted }}>
          Discover pet food, nutrition, and care supplies from trusted sources. Browse by species, life
          stage, and product type with clear, source-approved information.
        </p>
        {/* Below md the featured cards become a swipeable row rather than a
            tall stack, with the next card peeking in to signal the scroll. */}
        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 pt-6 [scrollbar-width:none] sm:-mx-8 sm:px-8 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pt-9 [&::-webkit-scrollbar]:hidden">
          {FEATURED.map((f, i) => (
            <article
              key={f.name}
              className="flex w-[80%] max-w-[340px] shrink-0 snap-start flex-col overflow-hidden rounded-[20px] bg-white md:w-auto md:max-w-none"
              style={{ border: `1px solid ${C.line}` }}
            >
              <div className="relative h-40 bg-gradient-to-br from-cyan-800 to-orange-500">
                <Image
                  src={f.image}
                  alt={f.imageAlt}
                  fill
                  priority={i === 0}
                  sizes="(min-width: 1024px) 393px, (min-width: 768px) 33vw, 340px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col gap-1 px-4 pb-4 pt-5">
                <span
                  className="self-start rounded-sm px-2 py-[3px] text-[10px] font-bold uppercase leading-4"
                  style={{ background: "#FDF4EA", color: C.warm }}
                >
                  {f.tag}
                </span>
                <h2 className="pt-1 text-base font-bold leading-6" style={{ color: C.ink }}>
                  {f.name}
                </h2>
                <p className="text-xs leading-5" style={{ color: C.muted }}>
                  {f.meta}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
