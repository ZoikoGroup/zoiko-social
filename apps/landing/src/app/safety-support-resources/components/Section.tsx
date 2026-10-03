import { C } from "./theme";

/** The page's repeated section frame: padded, centred, with a heading and optional intro. */
export default function Section({
  id,
  title,
  intro,
  tinted,
  children,
}: {
  id?: string;
  title: string;
  intro?: string;
  /** Grey background, for the sections the design alternates. */
  tinted?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-4 px-4 py-12 sm:px-8 sm:py-16 lg:px-16 lg:py-20 xl:px-28"
      style={{ background: tinted ? C.panel : "#fff" }}
    >
      <div className="mx-auto flex max-w-[1280px] flex-col gap-4 sm:gap-6">
        <h2 className="text-2xl font-extrabold leading-tight sm:text-4xl sm:leading-10" style={{ color: C.ink }}>
          {title}
        </h2>
        {intro && (
          <p className="text-base leading-7" style={{ color: C.muted }}>
            {intro}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
