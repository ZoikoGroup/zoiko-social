import Link from "next/link";
import { appUrl, APP_LINKS } from "@/lib/app-links";
import { C } from "./theme";

const COLUMNS = [
  {
    title: "For Individuals",
    body: "Connect, share, and care for animals in your life.",
    actions: [
      { label: "Join Free", href: APP_LINKS.signUp, primary: true },
      { label: "Explore Communities", href: APP_LINKS.communities },
      { label: "Watch Animal News", href: APP_LINKS.news },
    ],
  },
  {
    title: "For Professionals",
    body: "Reach clients and build your practice.",
    actions: [
      { label: "Get Verified", href: APP_LINKS.signUp, primary: true },
      { label: "List Your Practice", href: appUrl("/professionals") },
      { label: "Start Professional Trial", href: APP_LINKS.signUp },
    ],
  },
  {
    title: "For Organizations",
    body: "Amplify your mission and coordinate rescue work.",
    actions: [
      { label: "Verify Your Organization", href: APP_LINKS.signUp, primary: true },
      { label: "Fundraise Safely", href: appUrl("/events") },
      { label: "Partner With Zoiko Social", href: APP_LINKS.docs },
    ],
  },
];

/** The gradient audience panel: one column of calls to action per audience. */
export default function CTASection() {
  return (
    <section className="mx-auto max-w-[1280px] px-4 pb-12 sm:px-6 sm:pb-16 lg:pb-20">
      <div
        className="rounded-3xl px-5 py-10 sm:px-8 sm:py-14 lg:px-16"
        style={{
          background: `linear-gradient(110deg, ${C.ink} 0%, ${C.brand} 45%, #1E8F6E 100%)`,
        }}
      >
        <h2 className="text-center text-2xl font-extrabold leading-tight text-white lg:text-3xl">
          A Social Network Built Around Life — Not Noise
        </h2>

        <div className="mt-10 grid gap-10 md:grid-cols-3">
          {COLUMNS.map((column) => (
            <div key={column.title} className="flex flex-col">
              <h3 className="text-center text-xl font-bold text-white">
                {column.title}
              </h3>
              <p className="mt-2 text-center text-sm leading-5 text-white/80">
                {column.body}
              </p>

              <div className="mt-6 flex flex-col gap-3">
                {column.actions.map((action) => (
                  <Link
                    key={action.label}
                    href={action.href}
                    className={`flex items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      action.primary
                        ? "bg-white hover:bg-white/90"
                        : "border border-white/40 text-white hover:bg-white/10"
                    }`}
                    style={action.primary ? { color: C.ink } : undefined}
                  >
                    {action.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
