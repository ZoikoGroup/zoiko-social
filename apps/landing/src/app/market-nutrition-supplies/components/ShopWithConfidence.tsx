import { C } from "./theme";

const POINTS: readonly { title: string; body: string }[] = [
  {
    title: "Source-approved products",
    body: "Only products from authorized sellers and manufacturers. No fake or unauthorized items.",
  },
  {
    title: "Clear product information",
    body: "Species, life stage, ingredients, and warnings from official sources — no health claims.",
  },
  {
    title: "Safety & recall information",
    body: "Warnings, recalls, and important safety info available. Always check before purchasing.",
  },
  {
    title: "No medical advice",
    body: "Product discovery only. Never replaces veterinary guidance for health conditions.",
  },
];

export default function ShopWithConfidence() {
  return (
    <section className="bg-white px-4 pt-12 sm:px-8 sm:pt-16 lg:px-16 lg:pt-20 xl:px-28">
      <div className="mx-auto max-w-[1230px] rounded-[20px] p-6 sm:p-12" style={{ background: C.chip }}>
        <h2 className="text-lg font-bold leading-7 sm:text-xl" style={{ color: C.brand }}>
          Shop with confidence
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {POINTS.map((p) => (
            <div
              key={p.title}
              className="flex flex-col gap-2 rounded-xl bg-white px-4 py-3"
              style={{ borderLeft: `3px solid ${C.brand}` }}
            >
              <h3 className="text-xs font-bold leading-5" style={{ color: C.brand }}>
                {p.title}
              </h3>
              <p className="text-xs leading-5" style={{ color: C.muted }}>
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
