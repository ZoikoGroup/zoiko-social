import Image from "next/image";
import Section from "./Section";
import { COSTS, IMG } from "./content";
import { C } from "./theme";

export default function Costs() {
  return (
    <Section title="Costs & financial assistance">
      {/* Phones crop toward the hands and calculator, the subject of the shot. */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl shadow-[0px_20px_48px_0px_rgba(7,59,71,0.16)] sm:aspect-[1230/369]">
        <Image
          src={`${IMG}costs.webp`}
          alt="A person using a calculator next to receipts and a laptop"
          fill
          sizes="(min-width: 1280px) 1230px, 100vw"
          className="object-cover object-[35%_center] sm:object-center"
        />
      </div>
      <div className="grid gap-4 pt-2 sm:gap-6 sm:pt-6 md:grid-cols-3">
        {COSTS.map((c) => (
          <div
            key={c.title}
            className="flex flex-col items-center gap-3 rounded-[20px] p-6 text-center sm:gap-4 sm:p-8"
            style={{ background: C.panel, border: `1px solid ${C.line}` }}
          >
            <h3 className="text-lg font-bold" style={{ color: C.brand }}>
              {c.title}
            </h3>
            <p className="text-3xl font-extrabold" style={{ color: C.brand }}>
              {c.price}
            </p>
            <p className="text-sm leading-6" style={{ color: C.muted }}>
              {c.body}
            </p>
          </div>
        ))}
      </div>
      <p className="text-xs leading-5" style={{ color: C.muted }}>
        Typical US price ranges; actual costs vary by provider, location, and insurance.
      </p>
    </Section>
  );
}
